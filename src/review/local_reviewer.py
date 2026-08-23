"""Deterministic interpretation review without an LLM API."""

from __future__ import annotations

from typing import Any


def review_interpretation(
    answer: str,
    concepts: list[dict[str, Any]],
    learning_note: str = "",
) -> dict[str, list[str]]:
    """Compare a learner's answer against authored, explainable rules."""

    normalized = answer.strip().lower()
    understood: list[str] = []
    issues: list[str] = []
    learn: list[str] = []

    if not normalized:
        return {
            "understood": [],
            "issues": ["해석을 입력하면 핵심 의미를 비교할 수 있습니다."],
            "learn": [learning_note] if learning_note else [],
        }

    for concept in concepts:
        name = concept.get("name", "핵심 의미")
        keywords = concept.get("keywords", [])
        wrong_patterns = concept.get("wrong_patterns", [])
        feedback = concept.get("feedback", "")
        wrong_match = next(
            (pattern for pattern in wrong_patterns if pattern.lower() in normalized),
            None,
        )
        found = any(keyword.lower() in normalized for keyword in keywords)

        if wrong_match:
            issues.append(
                f"{name}: '{wrong_match}'와 관련된 표현 때문에 의미를 다시 확인해보세요."
            )
        elif found:
            understood.append(f"{name}: 핵심 의미를 포함했습니다.")
        else:
            issues.append(f"{name}: 이 의미가 해석에 충분히 드러나지 않습니다.")

        if feedback:
            learn.append(feedback)

    return {
        "understood": understood,
        "issues": issues,
        "learn": list(dict.fromkeys(learn)),
    }
