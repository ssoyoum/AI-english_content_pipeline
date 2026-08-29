"""Helpers for the lightweight, file-backed administrator content studio."""

from __future__ import annotations

import copy
import json
import re
from pathlib import Path
from typing import Any

from src.models.content import validate_content


def slugify_lesson(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return normalized or "untitled-lesson"


def resize_content(content: dict[str, Any], sentence_count: int) -> dict[str, Any]:
    """Keep a deterministic sample draft aligned with the requested sentence count."""

    result = copy.deepcopy(content)
    interpretations = list(result["sentence_interpretations"])
    if len(interpretations) < sentence_count:
        seed = interpretations[-1]
        for index in range(len(interpretations), sentence_count):
            item = copy.deepcopy(seed)
            item["section"] = "PRACTICE SENTENCES"
            item["subheading"] = f"Practice Sentence {index + 1:02d}"
            item["sentence"] = f"This practice sentence helps us connect the lesson idea to action {index + 1}."
            item["translation"] = f"이 연습 문장은 레슨의 핵심 생각을 실천과 연결합니다({index + 1})."
            item["learning_note"] = "Notice how the sentence connects an idea with a practical action."
            item["focus_terms"] = ["practice sentence", "connect", "action"]
            interpretations.append(item)
    result["sentence_interpretations"] = interpretations[:sentence_count]
    result["review_rules"] = [
        {
            "sentence_index": index + 1,
            "concepts": result["review_rules"][min(index, len(result["review_rules"]) - 1)]["concepts"],
        }
        for index in range(sentence_count)
    ]
    result["article"] = _build_article(result["sentence_interpretations"])
    result["audio_script"] = " ".join(item["sentence"] for item in result["sentence_interpretations"])
    result["vocabulary"] = result["vocabulary"][:10] or [
        {"expression": "key idea", "meaning": "핵심 생각", "example": result["sentence_interpretations"][0]["sentence"]}
    ]
    return validate_content(result)


def _build_article(interpretations: list[dict[str, Any]]) -> list[dict[str, str]]:
    sections: list[dict[str, str]] = []
    for item in interpretations:
        heading = item.get("section") or "READING PRACTICE"
        if not sections or sections[-1]["heading"] != heading:
            sections.append({"heading": heading, "paragraph": item["sentence"]})
        else:
            sections[-1]["paragraph"] += f" {item['sentence']}"
    return sections


def write_catalog_entry(catalog_path: Path, entry: dict[str, Any]) -> None:
    data = json.loads(catalog_path.read_text(encoding="utf-8"))
    lessons = data.setdefault("lessons", [])
    if any(item.get("id") == entry["id"] for item in lessons):
        raise ValueError(f"Lesson id already exists: {entry['id']}")
    entry["day"] = max((int(item.get("day", 0)) for item in lessons), default=0) + 1
    lessons.append(entry)
    catalog_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
