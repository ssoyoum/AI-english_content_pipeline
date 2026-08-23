"""Load user-authored content without calling an LLM API."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from src.models.content import ContentValidationError, validate_content


class ManualContentGenerator:
    def __init__(self, content_path: Path) -> None:
        self.content_path = content_path

    def generate(self, topic: str = "") -> dict[str, Any]:
        try:
            data = json.loads(self.content_path.read_text(encoding="utf-8"))
        except FileNotFoundError as error:
            raise ContentValidationError(f"Content file not found: {self.content_path}") from error
        except json.JSONDecodeError as error:
            raise ContentValidationError(f"Content file is not valid JSON: {self.content_path}") from error
        return validate_content(data)
