"""Small local HTTP layer for the CLI pipeline; the UI can call this later."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.generators.content_generator import ContentGenerator
from src.generators.audio_script import build_audio_script
from src.generators.manual_generator import ManualContentGenerator
from src.generators.sample_generator import SampleContentGenerator
from src.generators.tts_generator import LocalTTSGenerator
from src.pipeline.pipeline import ContentPipeline, record_stage
from src.pipeline.lesson_catalog import LessonCatalogError, get_lesson, list_lessons
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


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CONTENT_ROOT = PROJECT_ROOT / "content"
OUTPUT_ROOT = PROJECT_ROOT / "outputs"
UI_ROOT = PROJECT_ROOT / "ui"
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
app = FastAPI(title="English Content Pipeline", version="0.1.0")
app.mount("/outputs", StaticFiles(directory=OUTPUT_ROOT), name="outputs")
app.mount("/ui", StaticFiles(directory=UI_ROOT, html=True), name="ui")


@app.get("/", include_in_schema=False)
def home() -> RedirectResponse:
    return RedirectResponse(url="/ui/")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/lessons")
def lessons() -> list[dict[str, Any]]:
    return list_lessons()


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
