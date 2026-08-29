"""Small local HTTP layer for the CLI pipeline; the UI can call this later."""

from __future__ import annotations

import json
import secrets
from copy import deepcopy
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from dotenv import load_dotenv
except ImportError:  # Optional for sample mode; environment variables still work.
    load_dotenv = None

if load_dotenv:
    load_dotenv()

from src.generators.content_generator import ContentGenerator
from src.generators.audio_script import build_audio_script
from src.generators.manual_generator import ManualContentGenerator
from src.generators.sample_generator import SampleContentGenerator
from src.generators.tts_generator import LocalTTSGenerator
from src.models.content import validate_content
from src.pipeline.pipeline import ContentPipeline, record_stage
from src.pipeline.admin_content import resize_content, slugify_lesson, write_catalog_entry
from src.pipeline.lesson_catalog import (
    LessonCatalogError,
    get_lesson,
    get_lesson_by_id,
    list_lessons,
    read_lesson_content,
)
from src.publishers.html_publisher import write_learning_html
from src.review.local_reviewer import review_interpretation


class ContentRequest(BaseModel):
    topic: str | None = Field(default=None, description="Topic for LLM content generation")
    sample: bool = Field(default=False, description="Use deterministic sample content")
    content_file: str | None = Field(default=None, description="JSON file under content/")
    output_dir: str = "outputs"
    tts: bool = Field(default=True, description="Generate the Jenny Neural MP3 audio")
    day: int = Field(default=1, ge=1, description="Lesson day number")


class ReviewRequest(BaseModel):
    content_file: str
    sentence_index: int = Field(ge=1)
    answer: str


class LessonGenerateRequest(BaseModel):
    tts: bool = True


class AdminLessonGenerateRequest(BaseModel):
    topic: str = Field(min_length=1)
    level: str = Field(default="Intermediate")
    sentence_count: int = Field(default=10, ge=1, le=30)
    category: str = Field(default="Technology")
    learning_goal: str | None = None
    tone: str | None = None
    target_vocabulary: str | None = None
    sample: bool = Field(default=False, description="Use deterministic local content instead of the LLM")


class AdminPublishRequest(BaseModel):
    draft_id: str | None = None
    content: dict[str, Any] | None = None
    topic: str = Field(min_length=1)
    title: str = Field(min_length=1)
    level: str = Field(default="Intermediate")
    category: str = Field(default="Technology")
    generate_tts: bool = False


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CONTENT_ROOT = PROJECT_ROOT / "content"
OUTPUT_ROOT = PROJECT_ROOT / "outputs"
UI_ROOT = PROJECT_ROOT / "ui"
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
app = FastAPI(title="English Content Pipeline", version="0.1.0")
admin_drafts: dict[str, dict[str, Any]] = {}
app.mount("/outputs", StaticFiles(directory=OUTPUT_ROOT), name="outputs")
app.mount("/ui", StaticFiles(directory=UI_ROOT, html=True), name="ui")


@app.get("/", include_in_schema=False)
def home() -> RedirectResponse:
    return RedirectResponse(url="/ui/")


@app.get("/admin", include_in_schema=False)
def admin_home() -> FileResponse:
    return FileResponse(UI_ROOT / "admin.html")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/lessons")
def lessons() -> list[dict[str, Any]]:
    return list_lessons()


def _lesson_payload(lesson: dict[str, Any]) -> dict[str, Any]:
    payload = {key: value for key, value in lesson.items() if key != "content_path"}
    payload["content"] = read_lesson_content(lesson)
    output_slug = lesson.get("audio_output")
    if output_slug:
        audio_path = OUTPUT_ROOT / str(output_slug) / "audio.mp3"
        cues_path = OUTPUT_ROOT / str(output_slug) / "audio_cues.json"
        payload["audio_url"] = f"/outputs/{output_slug}/audio.mp3" if audio_path.exists() else None
        payload["cues_url"] = f"/outputs/{output_slug}/audio_cues.json" if cues_path.exists() else None
    else:
        payload["audio_url"] = None
        payload["cues_url"] = None
    return payload


@app.get("/api/lessons")
def lesson_catalog_api() -> list[dict[str, Any]]:
    """Return lesson metadata for the dashboard and lesson picker."""

    return list_lessons()


@app.get("/api/lessons/{lesson_id}")
def lesson_content_api(lesson_id: str) -> dict[str, Any]:
    """Return one catalog entry and its authored learning content."""

    try:
        lesson = get_lesson_by_id(lesson_id)
        return _lesson_payload(lesson)
    except LessonCatalogError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


def _admin_sample_content(request: AdminLessonGenerateRequest) -> dict[str, Any]:
    """Use an existing authored lesson as a local, clearly marked demo draft."""

    source_lesson = get_lesson(1)
    content = deepcopy(read_lesson_content(source_lesson))
    content["topic"] = request.topic.strip()
    content["title"] = request.topic.strip()
    return resize_content(content, request.sentence_count)


@app.post("/api/admin/lessons/generate")
def admin_generate_lesson(request: AdminLessonGenerateRequest) -> dict[str, Any]:
    """Create an in-memory Draft for the administrator review screen."""

    try:
        if request.sample:
            content = _admin_sample_content(request)
            source = "local sample"
        else:
            content = ContentGenerator().generate(request.topic)
            source = "llm"
        if len(content.get("sentence_interpretations", [])) != request.sentence_count:
            raise ValueError(
                f"The generated draft contains {len(content.get('sentence_interpretations', []))} sentences; "
                f"expected {request.sentence_count}."
            )
    except Exception as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

    draft_id = secrets.token_urlsafe(12)
    metadata = {
        "topic": request.topic.strip(),
        "title": content["title"],
        "level": request.level,
        "category": request.category,
        "sentence_count": request.sentence_count,
        "source": source,
    }
    admin_drafts[draft_id] = {"metadata": metadata, "content": deepcopy(content)}
    return {"status": "draft", "draft_id": draft_id, "metadata": metadata, "content": content}


@app.post("/api/admin/lessons/publish")
def admin_publish_lesson(request: AdminPublishRequest) -> dict[str, Any]:
    """Validate and publish an edited Draft as a Lesson JSON catalog entry."""

    stored = admin_drafts.get(request.draft_id or "")
    content = deepcopy(request.content or (stored or {}).get("content") or {})
    content["topic"] = request.topic.strip()
    content["title"] = request.title.strip()
    try:
        content = validate_content(content)
    except Exception as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    lesson_id = slugify_lesson(request.title)
    try:
        get_lesson_by_id(lesson_id)
    except LessonCatalogError:
        pass
    else:
        raise HTTPException(status_code=409, detail=f"Lesson id already exists: {lesson_id}")

    content_path = CONTENT_ROOT / f"{lesson_id}.json"
    try:
        content_path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        entry: dict[str, Any] = {
            "id": lesson_id,
            "topic": request.topic.strip(),
            "title": request.title.strip(),
            "level": request.level,
            "category": request.category,
            "content_file": content_path.name,
        }
        warnings: list[str] = []
        if request.generate_tts:
            try:
                output_dir = OUTPUT_ROOT / lesson_id
                audio_plan = build_audio_script(content)
                audio_path = LocalTTSGenerator().generate(
                    audio_plan["full_script"],
                    output_dir / "audio.mp3",
                    output_dir / "audio_cues.json",
                    audio_plan["body"],
                )
                entry["audio_output"] = lesson_id
                entry["audio_file"] = audio_path.name
            except Exception as error:
                warnings.append(f"TTS was not generated: {error}")
        write_catalog_entry(CONTENT_ROOT / "lessons.json", entry)
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Publish failed: {error}") from error

    if request.draft_id:
        admin_drafts.setdefault(request.draft_id, {})["status"] = "published"
    day = next(item["day"] for item in list_lessons() if item["id"] == lesson_id)
    return {
        "status": "published",
        "lesson_id": lesson_id,
        "day": day,
        "title": request.title.strip(),
        "level": request.level,
        "category": request.category,
        "sentence_count": len(content["sentence_interpretations"]),
        "lesson_url": f"/ui/#lesson={lesson_id}",
        "warnings": warnings,
    }


@app.get("/lessons/{day}")
def lesson_detail(day: int) -> dict[str, Any]:
    try:
        lesson = get_lesson(day)
    except LessonCatalogError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return {key: value for key, value in lesson.items() if key != "content_path"}


@app.post("/lessons/{day}/generate")
def generate_lesson(day: int, request: LessonGenerateRequest) -> dict[str, object]:
    try:
        lesson = get_lesson(day)
    except LessonCatalogError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return generate_content(
        ContentRequest(
            content_file=lesson["content_file"],
            tts=request.tts,
            day=day,
        )
    )


@app.post("/pipeline/content")
def generate_content(request: ContentRequest) -> dict[str, object]:
    if request.sample and request.content_file:
        raise HTTPException(status_code=400, detail="Use either sample or content_file, not both.")
    if not request.topic and not request.content_file and not request.sample:
        raise HTTPException(status_code=400, detail="topic or content_file is required.")

    if request.content_file:
        relative_path = Path(request.content_file)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            raise HTTPException(status_code=400, detail="content_file must stay under content/.")
        source = CONTENT_ROOT / relative_path
        generator = ManualContentGenerator(source)
    elif request.sample:
        generator = SampleContentGenerator()
    else:
        generator = ContentGenerator()

    try:
        requested_output = Path(request.output_dir)
        output_root = requested_output if requested_output.is_absolute() else PROJECT_ROOT / requested_output
        output_dir = ContentPipeline(generator).run(request.topic or "", output_root)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error

    record_stage(output_dir, "content_generation", "success")
    content = json.loads((output_dir / "content.json").read_text(encoding="utf-8"))
    audio_filename: str | None = None
    timing_data: dict[str, object] | None = None
    try:
        if request.tts:
            audio_plan = build_audio_script(content)
            (output_dir / "audio_script.txt").write_text(
                audio_plan["full_script"], encoding="utf-8"
            )
            (output_dir / "audio_plan.json").write_text(
                json.dumps(
                    {key: value for key, value in audio_plan.items() if key != "full_script"},
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            audio_path = LocalTTSGenerator().generate(
                audio_plan["full_script"],
                output_dir / "audio.mp3",
                output_dir / "audio_cues.json",
                audio_plan["body"],
            )
            audio_filename = audio_path.name
            timing_path = output_dir / "audio_cues.json"
            if timing_path.exists():
                timing_data = json.loads(timing_path.read_text(encoding="utf-8"))
            record_stage(
                output_dir,
                "tts",
                "success",
                {
                    "artifact": audio_filename,
                    "timing_artifact": "audio_cues.json",
                    "difficult_sentences": len(audio_plan["difficult_sentences"]),
                    "difficult_words": len(audio_plan["difficult_words"]),
                },
            )

        html_path = write_learning_html(
            content,
            output_dir / "learning.html",
            audio_filename=audio_filename,
            timing_data=timing_data,
            review_url="/pipeline/review",
            content_reference=(output_dir / "content.json").relative_to(PROJECT_ROOT).as_posix(),
            lesson_day=request.day,
            lesson_days=[lesson["day"] for lesson in list_lessons()],
            lesson_base_url="/lessons",
        )
        record_stage(output_dir, "html", "success", {"artifact": html_path.name})
        record_stage(output_dir, "pipeline", "success", overall_status="completed")
    except Exception as error:
        record_stage(output_dir, "pipeline", "failed", {"error": str(error)}, "failed")
        raise HTTPException(status_code=500, detail=str(error)) from error

    html_url = None
    audio_url = None
    try:
        relative_dir = output_dir.resolve().relative_to(OUTPUT_ROOT.resolve()).as_posix()
        html_url = f"/outputs/{relative_dir}/learning.html"
        if audio_filename:
            audio_url = f"/outputs/{relative_dir}/{audio_filename}"
    except ValueError:
        pass

    return {
        "status": "completed",
        "output_dir": str(output_dir),
        "content_file": str(output_dir / "content.json"),
        "run_file": str(output_dir / "run.json"),
        "html_file": str(output_dir / "learning.html"),
        "html_url": html_url,
        "audio_file": str(output_dir / audio_filename) if audio_filename else None,
        "audio_url": audio_url,
    }


@app.post("/pipeline/review")
def review_content(request: ReviewRequest) -> dict[str, list[str]]:
    path = Path(request.content_file)
    if path.is_absolute() or ".." in path.parts:
        raise HTTPException(status_code=400, detail="content_file must be a relative content or output path.")
    resolved = (PROJECT_ROOT / path).resolve()
    allowed_roots = (CONTENT_ROOT.resolve(), OUTPUT_ROOT.resolve())
    if not any(root == resolved or root in resolved.parents for root in allowed_roots):
        raise HTTPException(status_code=400, detail="content_file must be under content/ or outputs/.")
    if not resolved.exists():
        raise HTTPException(status_code=404, detail="Content file not found.")

    try:
        content = json.loads(resolved.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=400, detail="Content file could not be read.") from error

    if request.sentence_index > len(content.get("sentence_interpretations", [])):
        raise HTTPException(status_code=404, detail="Sentence not found.")
    sentence_item = content["sentence_interpretations"][request.sentence_index - 1]
    rules = content.get("review_rules", [])
    concepts: list[dict[str, Any]] = []
    for rule in rules:
        if rule.get("sentence_index") == request.sentence_index:
            concepts = rule.get("concepts", [])
            break

    if not concepts:
        return {
            "understood": [],
            "issues": ["이 문장에 대한 로컬 리뷰 규칙이 아직 없습니다."],
            "learn": [sentence_item["learning_note"]],
        }
    return review_interpretation(request.answer, concepts, sentence_item["learning_note"])
