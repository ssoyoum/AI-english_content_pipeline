"""Generate structured learning content with the OpenAI Responses API."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from src.models.content import CONTENT_JSON_SCHEMA, ContentValidationError, validate_content


class ContentGenerationError(RuntimeError):
    """Raised when the model cannot produce valid learning content."""


class ContentGenerator:
    def __init__(self, model: str | None = None, prompt_path: Path | None = None) -> None:
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-5.2")
        self.prompt_path = prompt_path or Path(__file__).resolve().parents[2] / "prompts" / "content_generation_prompt.md"
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ContentGenerationError(
                "OPENAI_API_KEY is not set. Add it to the environment or use --sample."
            )
        try:
            from openai import OpenAI
        except ImportError as error:
            raise ContentGenerationError(
                "The OpenAI package is not installed. Run: pip install -r requirements.txt"
            ) from error
        self.client = OpenAI(api_key=api_key)

    def generate(self, topic: str) -> dict[str, Any]:
        if not topic.strip():
            raise ContentGenerationError("topic must not be empty")
        instructions = self.prompt_path.read_text(encoding="utf-8")
        try:
            response = self.client.responses.create(
                model=self.model,
                instructions=instructions,
                input=f"Create the learning package for this topic: {topic.strip()}",
                text={
                    "format": {
                        "type": "json_schema",
                        "name": "english_learning_content",
                        "strict": True,
                        "schema": CONTENT_JSON_SCHEMA,
                    }
                },
            )
            data = json.loads(response.output_text)
            return validate_content(data)
        except ContentValidationError as error:
            raise ContentGenerationError(f"Generated content failed validation: {error}") from error
        except json.JSONDecodeError as error:
            raise ContentGenerationError("The model returned invalid JSON") from error
        except Exception as error:
            raise ContentGenerationError(f"LLM generation failed: {error}") from error
