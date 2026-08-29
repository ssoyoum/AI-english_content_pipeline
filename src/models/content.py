"""Validation and schema definitions for the learning-content payload."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any


class ContentValidationError(ValueError):
    """Raised when generated content does not match the pipeline contract."""


CONTENT_JSON_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "required": [
        "topic",
        "title",
        "article",
        "vocabulary",
        "sentence_interpretations",
        "review_rules",
        "conversation_questions",
        "audio_script",
        "metadata",
    ],
    "properties": {
        "topic": {"type": "string"},
        "title": {"type": "string"},
        "article": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["heading", "paragraph"],
                "properties": {
                    "heading": {"type": "string"},
                    "paragraph": {"type": "string"},
                },
            },
        },
        "vocabulary": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["expression", "meaning", "example"],
                "properties": {
                    "expression": {"type": "string"},
                    "meaning": {"type": "string"},
                    "example": {"type": "string"},
                },
            },
        },
        "sentence_interpretations": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": [
                    "sentence",
                    "translation",
                    "learning_note",
                    "focus_terms",
                ],
                "properties": {
                    "section": {"type": "string"},
                    "subheading": {"type": "string"},
                    "sentence": {"type": "string"},
                    "translation": {"type": "string"},
                    "learning_note": {"type": "string"},
                    "focus_terms": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                },
            },
        },
        "review_rules": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["sentence_index", "concepts"],
                "properties": {
                    "sentence_index": {"type": "integer"},
                    "concepts": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": False,
                            "required": ["name", "keywords", "wrong_patterns", "feedback"],
                            "properties": {
                                "name": {"type": "string"},
                                "keywords": {"type": "array", "items": {"type": "string"}},
                                "wrong_patterns": {"type": "array", "items": {"type": "string"}},
                                "feedback": {"type": "string"},
                            },
                        },
                    },
                },
            },
        },
        "conversation_questions": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["question", "sample_answer", "coaching_point"],
                "properties": {
                    "question": {"type": "string"},
                    "sample_answer": {"type": "string"},
                    "coaching_point": {"type": "string"},
                },
            },
        },
        "audio_script": {"type": "string"},
        "metadata": {
            "type": "object",
            "additionalProperties": False,
            "required": ["reading_time", "conversation_time"],
            "properties": {
                "reading_time": {"type": "string"},
                "conversation_time": {"type": "string"},
            },
        },
    },
}


def _require_string(value: Any, path: str) -> None:
    if not isinstance(value, str) or not value.strip():
        raise ContentValidationError(f"{path} must be a non-empty string")


def _require_list(value: Any, path: str) -> list[Any]:
    if not isinstance(value, list) or not value:
        raise ContentValidationError(f"{path} must be a non-empty list")
    return value


def validate_content(data: Mapping[str, Any]) -> dict[str, Any]:
    """Validate and return a JSON-serializable content payload."""

    if not isinstance(data, Mapping):
        raise ContentValidationError("content must be an object")

    for key in ("topic", "title", "audio_script"):
        _require_string(data.get(key), key)

    article = _require_list(data.get("article"), "article")
    for index, section in enumerate(article):
        if not isinstance(section, Mapping):
            raise ContentValidationError(f"article[{index}] must be an object")
        _require_string(section.get("heading"), f"article[{index}].heading")
        _require_string(section.get("paragraph"), f"article[{index}].paragraph")

    vocabulary = _require_list(data.get("vocabulary"), "vocabulary")
    for index, item in enumerate(vocabulary):
        if not isinstance(item, Mapping):
            raise ContentValidationError(f"vocabulary[{index}] must be an object")
        for key in ("expression", "meaning", "example"):
            _require_string(item.get(key), f"vocabulary[{index}].{key}")

    interpretations = _require_list(data.get("sentence_interpretations"), "sentence_interpretations")
    for index, item in enumerate(interpretations):
        if not isinstance(item, Mapping):
            raise ContentValidationError(f"sentence_interpretations[{index}] must be an object")
        for key in ("sentence", "translation", "learning_note"):
            _require_string(item.get(key), f"sentence_interpretations[{index}].{key}")
        for key in ("section", "subheading"):
            if key in item and item[key] is not None:
                _require_string(item[key], f"sentence_interpretations[{index}].{key}")
        if not isinstance(item.get("focus_terms"), list):
            raise ContentValidationError(f"sentence_interpretations[{index}].focus_terms must be a list")

    review_rules = _require_list(data.get("review_rules"), "review_rules")
    if len(review_rules) != len(interpretations):
        raise ContentValidationError("review_rules must contain one item per sentence interpretation")
    for index, rule in enumerate(review_rules):
        if not isinstance(rule, Mapping):
            raise ContentValidationError(f"review_rules[{index}] must be an object")
        if rule.get("sentence_index") != index + 1:
            raise ContentValidationError(
                f"review_rules[{index}].sentence_index must be {index + 1}"
            )
        concepts = _require_list(rule.get("concepts"), f"review_rules[{index}].concepts")
        for concept_index, concept in enumerate(concepts):
            if not isinstance(concept, Mapping):
                raise ContentValidationError(
                    f"review_rules[{index}].concepts[{concept_index}] must be an object"
                )
            for key in ("name", "feedback"):
                _require_string(
                    concept.get(key),
                    f"review_rules[{index}].concepts[{concept_index}].{key}",
                )
            for key in ("keywords", "wrong_patterns"):
                if not isinstance(concept.get(key), list):
                    raise ContentValidationError(
                        f"review_rules[{index}].concepts[{concept_index}].{key} must be a list"
                    )

    questions = _require_list(data.get("conversation_questions"), "conversation_questions")
    if len(questions) != 3:
        raise ContentValidationError("conversation_questions must contain exactly 3 items")
    for index, item in enumerate(questions):
        if not isinstance(item, Mapping):
            raise ContentValidationError(f"conversation_questions[{index}] must be an object")
        for key in ("question", "sample_answer", "coaching_point"):
            _require_string(item.get(key), f"conversation_questions[{index}].{key}")

    metadata = data.get("metadata")
    if not isinstance(metadata, Mapping):
        raise ContentValidationError("metadata must be an object")
    for key in ("reading_time", "conversation_time"):
        _require_string(metadata.get(key), f"metadata.{key}")

    return dict(data)
