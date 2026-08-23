"""Publish a generated learning package to Notion using the Markdown API."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class NotionPublishError(RuntimeError):
    """Raised when a Notion page cannot be created."""


def build_notion_markdown(content: dict[str, Any]) -> str:
    """Convert the shared content contract into a Notion-friendly document."""

    lines = [
        f"# {content['title']}",
        "",
        f"**Topic:** {content['topic']}",
        "",
        "## Article",
        "",
    ]
    for section in content["article"]:
        lines.extend([f"### {section['heading']}", "", section["paragraph"], ""])

    lines.extend(["## Vocabulary & Expressions", "", "| Expression | Meaning | Example |", "| --- | --- | --- |"])
    for item in content["vocabulary"]:
        lines.append(f"| {item['expression']} | {item['meaning']} | {item['example']} |")
    lines.append("")

    lines.extend(["## Sentence-by-sentence Interpretation", ""])
    for index, item in enumerate(content["sentence_interpretations"], start=1):
        lines.extend(
            [
                f"### {index}. {item['sentence']}",
                "",
                f"**Corrected Interpretation:** {item['translation']}",
                "",
                f"**Learning Note:** {item['learning_note']}",
                "",
                f"**Focus Terms:** {', '.join(item['focus_terms'])}",
                "",
            ]
        )

    lines.extend(["## Conversation Questions", ""])
    for index, item in enumerate(content["conversation_questions"], start=1):
        lines.extend(
            [
                f"### {index}. {item['question']}",
                "",
                f"**Sample Answer:** {item['sample_answer']}",
                "",
                f"**Coaching Point:** {item['coaching_point']}",
                "",
            ]
        )

    lines.extend(
        [
            "## Audio",
            "",
            f"Reading time: {content['metadata']['reading_time']}",
            "",
            f"Conversation time: {content['metadata']['conversation_time']}",
            "",
            "The clean audio script is generated and stored locally by the pipeline.",
        ]
    )
    return "\n".join(lines).strip() + "\n"


class NotionPublisher:
    def __init__(self, token: str | None = None, parent_page_id: str | None = None) -> None:
        self.token = token or os.getenv("NOTION_API_KEY")
        self.parent_page_id = parent_page_id or os.getenv("NOTION_PARENT_PAGE_ID")
        self.notion_version = os.getenv("NOTION_VERSION", "2026-03-11")
        if not self.token or not self.parent_page_id:
            raise NotionPublishError(
                "NOTION_API_KEY and NOTION_PARENT_PAGE_ID are required for publishing."
            )

    def publish(self, content: dict[str, Any]) -> dict[str, Any]:
        body = {
            "parent": {"page_id": self.parent_page_id},
            "markdown": build_notion_markdown(content),
        }
        request = Request(
            "https://api.notion.com/v1/pages",
            data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
                "Notion-Version": self.notion_version,
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            raise NotionPublishError(f"Notion returned HTTP {error.code}: {detail}") from error
        except URLError as error:
            raise NotionPublishError(f"Could not connect to Notion: {error.reason}") from error

    @staticmethod
    def write_preview(content: dict[str, Any], output_path: Path) -> Path:
        output_path.write_text(build_notion_markdown(content), encoding="utf-8")
        return output_path
