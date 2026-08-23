"""Build a structured, API-free listening and pronunciation practice script."""

from __future__ import annotations

import re
from typing import Any


WORD_RE = re.compile(r"[A-Za-z]+(?:'[A-Za-z]+)?")
STOP_WORDS = {
    "about", "after", "again", "also", "although", "among", "another", "because",
    "before", "being", "between", "could", "every", "from", "have", "into", "more",
    "most", "much", "only", "other", "people", "rather", "same", "should", "some",
    "than", "that", "their", "these", "they", "this", "those", "through", "under",
    "using", "what", "when", "which", "while", "with", "would", "your",
}


def _words(text: str) -> list[str]:
    return WORD_RE.findall(text)


def _sentence_score(item: dict[str, Any], index: int) -> tuple[int, int]:
    sentence_words = _words(item["sentence"])
    long_words = sum(len(word) >= 8 for word in sentence_words)
    connectors = sum(
        word.lower() in {"although", "instead", "rather", "because", "however", "while", "as"}
        for word in sentence_words
    )
    score = len(sentence_words) + (long_words * 2) + (len(item.get("focus_terms", [])) * 3) + connectors
    return score, -index


def _select_difficult_sentences(content: dict[str, Any], limit: int = 3) -> list[str]:
    items = content["sentence_interpretations"]
    ranked = sorted(
        enumerate(items),
        key=lambda pair: _sentence_score(pair[1], pair[0]),
        reverse=True,
    )
    return [item["sentence"] for _, item in ranked[: min(limit, len(ranked))]]


def _select_difficult_words(content: dict[str, Any], limit: int = 5) -> list[str]:
    candidates: dict[str, tuple[str, int, int]] = {}

    def add_candidate(word: str, source_bonus: int) -> None:
        normalized = word.lower()
        if len(normalized) < 6 or normalized in STOP_WORDS:
            return
        current = candidates.get(normalized)
        score = len(normalized) + source_bonus
        if current is None or score > current[1]:
            candidates[normalized] = (word, score, len(normalized))

    for item in content["vocabulary"]:
        for word in _words(item["expression"]):
            add_candidate(word, 8)
    for item in content["sentence_interpretations"]:
        for term in item.get("focus_terms", []):
            for word in _words(term):
                add_candidate(word, 5)
        for word in _words(item["sentence"]):
            add_candidate(word, 1)

    ranked = sorted(candidates.values(), key=lambda value: (value[1], value[2], value[0].lower()), reverse=True)
    return [value[0] for value in ranked[: min(limit, len(ranked))]]


def _get_audio_override(content: dict[str, Any], key: str) -> list[str] | None:
    practice = content.get("audio_practice")
    if not isinstance(practice, dict):
        return None
    values = practice.get(key)
    if not isinstance(values, list) or not values:
        return None
    return [value.strip() for value in values if isinstance(value, str) and value.strip()]


def _validated_sentence_override(content: dict[str, Any]) -> list[str] | None:
    override = _get_audio_override(content, "difficult_sentences")
    if override is None:
        return None
    available = {item["sentence"] for item in content["sentence_interpretations"]}
    invalid = [sentence for sentence in override if sentence not in available]
    if invalid:
        raise ValueError(f"audio_practice contains unknown sentence(s): {invalid}")
    return override[:3]


def _validated_word_override(content: dict[str, Any]) -> list[str] | None:
    override = _get_audio_override(content, "difficult_words")
    if override is None:
        return None
    body_words = {word.lower() for word in _words(content["audio_script"])}
    invalid = [word for word in override if word.lower() not in body_words]
    if invalid:
        raise ValueError(f"audio_practice contains unknown word(s): {invalid}")
    return override[:5]


def build_audio_script(content: dict[str, Any]) -> dict[str, Any]:
    """Return intro, article, and repeat practice sections for TTS."""

    difficult_sentences = _validated_sentence_override(content) or _select_difficult_sentences(content)
    difficult_words = _validated_word_override(content) or _select_difficult_words(content)
    introduction = (
        f"Welcome to today's English learning audio. Today's topic is {content['title']}. "
        "First, listen to the full passage. Then, we will practice three challenging sentences "
        "and five important words, repeating each one twice. Let's begin."
    )
    body = content["audio_script"].strip()
    sentence_practice = "Now, let's practice the challenging sentences. Listen and repeat. " + " ".join(
        f"{sentence} {sentence}" for sentence in difficult_sentences
    )
    word_practice = "Finally, let's practice five important words. " + " ".join(
        f"{word}. {word}." for word in difficult_words
    )
    full_script = "\n\n".join([introduction, body, sentence_practice, word_practice])
    return {
        "introduction": introduction,
        "body": body,
        "difficult_sentences": difficult_sentences,
        "difficult_words": difficult_words,
        "full_script": full_script,
    }
