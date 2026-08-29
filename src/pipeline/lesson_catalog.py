"""Resolve numbered lessons to authored content files."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = PROJECT_ROOT / "content"
CATALOG_PATH = CONTENT_ROOT / "lessons.json"


class LessonCatalogError(ValueError):
    """Raised when a lesson cannot be resolved safely."""


def list_lessons() -> list[dict[str, Any]]:
    data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    lessons = data.get("lessons")
    if not isinstance(lessons, list) or not lessons:
        raise LessonCatalogError("lessons.json must contain a non-empty lessons list.")
    normalized: list[dict[str, Any]] = []
    registered_files: set[str] = set()
    for lesson in lessons:
        if not isinstance(lesson, dict):
            raise LessonCatalogError("Each catalog lesson must be an object.")
        if not lesson.get("id") or not lesson.get("content_file"):
            raise LessonCatalogError("Each catalog lesson needs id and content_file.")
        content_path = _resolve_content_path(lesson["content_file"])
        registered_files.add(content_path.name)
        try:
            content = json.loads(content_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            raise LessonCatalogError(f"Lesson content could not be read: {content_path.name}") from error
        sentence_count = len(content.get("sentence_interpretations", []))
        normalized.append({**lesson, "sentence_count": sentence_count})
    next_day = max((int(lesson.get("day", 0)) for lesson in normalized), default=0) + 1
    for content_path in sorted(CONTENT_ROOT.glob("*.json")):
        if content_path.name in registered_files or content_path.name == CATALOG_PATH.name:
            continue
        try:
            content = json.loads(content_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            raise LessonCatalogError(f"Lesson content could not be read: {content_path.name}") from error
        lesson_id = content_path.stem.replace("_", "-")
        normalized.append({
            "day": next_day,
            "id": lesson_id,
            "topic": content.get("topic", lesson_id),
            "title": content.get("title", lesson_id.replace("-", " ").title()),
            "level": "Intermediate",
            "category": content.get("topic", "General"),
            "content_file": content_path.name,
            "sentence_count": len(content.get("sentence_interpretations", [])),
        })
        next_day += 1
    return sorted(normalized, key=lambda lesson: lesson["day"])


def _resolve_content_path(relative_file: str) -> Path:
    relative_path = Path(relative_file)
    if relative_path.is_absolute() or ".." in relative_path.parts:
        raise LessonCatalogError("Lesson content path must stay under content/.")
    content_path = (CONTENT_ROOT / relative_path).resolve()
    if CONTENT_ROOT.resolve() not in content_path.parents:
        raise LessonCatalogError("Lesson content path must stay under content/.")
    if not content_path.exists():
        raise LessonCatalogError(f"Lesson content file not found: {relative_path}")
    return content_path


def get_lesson(day: int) -> dict[str, Any]:
    lesson = next((item for item in list_lessons() if item.get("day") == day), None)
    if lesson is None:
        raise LessonCatalogError(f"Lesson day {day} is not registered.")
    return {**lesson, "content_path": _resolve_content_path(lesson["content_file"])}


def get_lesson_by_id(lesson_id: str) -> dict[str, Any]:
    lesson = next((item for item in list_lessons() if item.get("id") == lesson_id), None)
    if lesson is None:
        raise LessonCatalogError(f"Lesson id {lesson_id} is not registered.")
    return {**lesson, "content_path": _resolve_content_path(lesson["content_file"])}


def read_lesson_content(lesson: dict[str, Any]) -> dict[str, Any]:
    content_path = lesson.get("content_path")
    if not isinstance(content_path, Path):
        content_path = _resolve_content_path(str(lesson["content_file"]))
    try:
        return json.loads(content_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise LessonCatalogError(f"Lesson content could not be read: {content_path.name}") from error
