"""Orchestrate generation and local artifact persistence."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Protocol

from src.models.content import validate_content


class Generator(Protocol):
    def generate(self, topic: str) -> dict[str, Any]: ...


def slugify(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return normalized or "untitled-content"


class ContentPipeline:
    def __init__(self, generator: Generator) -> None:
        self.generator = generator

    def run(self, topic: str, output_root: Path) -> Path:
        data = validate_content(self.generator.generate(topic))
        content_dir = output_root / slugify(data["title"])
        content_dir.mkdir(parents=True, exist_ok=True)
        (content_dir / "content.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        run_metadata = {
            "status": "content_generated",
            "created_at": datetime.now(UTC).isoformat(),
            "topic": data["topic"],
            "title": data["title"],
        }
        (content_dir / "run.json").write_text(
            json.dumps(run_metadata, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return content_dir


def record_stage(
    content_dir: Path,
    stage: str,
    stage_status: str,
    details: dict[str, Any] | None = None,
    overall_status: str | None = None,
) -> None:
    """Persist stage-level status without exposing credentials or full payloads."""

    metadata_path = content_dir / "run.json"
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    metadata.setdefault("stages", {})[stage] = {
        "status": stage_status,
        "updated_at": datetime.now(UTC).isoformat(),
        **(details or {}),
    }
    if overall_status:
        metadata["status"] = overall_status
    metadata_path.write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
