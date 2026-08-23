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
    return sorted(lessons, key=lambda lesson: lesson["day"])


def get_lesson(day: int) -> dict[str, Any]:
    lesson = next((item for item in list_lessons() if item.get("day") == day), None)
    if lesson is None:
        raise LessonCatalogError(f"Lesson day {day} is not registered.")
    relative_path = Path(lesson["content_file"])
    if relative_path.is_absolute() or ".." in relative_path.parts:
        raise LessonCatalogError("Lesson content path must stay under content/.")
    content_path = CONTENT_ROOT / relative_path
    if not content_path.exists():
        raise LessonCatalogError(f"Lesson content file not found: {relative_path}")
    return {**lesson, "content_path": content_path}
