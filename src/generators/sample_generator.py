"""Deterministic sample generator for local pipeline testing."""

from __future__ import annotations

from typing import Any

from src.models.content import validate_content


class SampleContentGenerator:
    def generate(self, topic: str) -> dict[str, Any]:
        title = topic.strip() or "Climate Change and Water"
        content = {
            "topic": title,
            "title": title,
            "article": [
                {
                    "heading": "Introduction",
                    "paragraph": (
                        "Climate change is no longer a distant threat—it is a present reality that affects "
                        "ecosystems, communities, and the availability of vital resources. Among the most "
                        "critical of these resources is water."
                    ),
                },
                {
                    "heading": "Changing Rainfall Patterns",
                    "paragraph": (
                        "Over the past few decades, scientists have observed shifts in rainfall distribution "
                        "around the world. Some regions are experiencing prolonged droughts, while others face "
                        "intense flooding."
                    ),
                },
                {
                    "heading": "Rising Temperatures",
                    "paragraph": (
                        "Higher temperatures increase the rate of evaporation from lakes, rivers, and soil. "
                        "Even if rainfall levels remain the same, the net water availability decreases."
                    ),
                },
            ],
            "vocabulary": [
                {
                    "expression": "present reality",
                    "meaning": "현재의 현실",
                    "example": "Climate change is a present reality.",
                },
                {
                    "expression": "prolonged droughts",
                    "meaning": "장기간의 가뭄",
                    "example": "Prolonged droughts can threaten food production.",
                },
                {
                    "expression": "net water availability",
                    "meaning": "실제로 이용 가능한 물의 양",
                    "example": "Net water availability may decrease even when rainfall stays the same.",
                },
            ],
            "sentence_interpretations": [
                {
                    "sentence": "Climate change is no longer a distant threat—it is a present reality that affects ecosystems, communities, and the availability of vital resources.",
                    "translation": "기후 변화는 더 이상 먼 미래의 위협이 아니라 생태계와 공동체, 필수 자원의 이용 가능성에 영향을 미치는 현재의 현실이다.",
                    "learning_note": "no longer A는 ‘더 이상 A가 아니다’라는 뜻입니다.",
                    "focus_terms": ["no longer", "present reality", "availability"],
                },
                {
                    "sentence": "Some regions are experiencing prolonged droughts, while others face intense flooding.",
                    "translation": "일부 지역은 장기간의 가뭄을 겪는 반면, 다른 지역은 극심한 홍수에 직면하고 있다.",
                    "learning_note": "while은 두 지역의 서로 다른 상황을 대조합니다.",
                    "focus_terms": ["prolonged droughts", "while", "intense flooding"],
                },
                {
                    "sentence": "Even if rainfall levels remain the same, the net water availability decreases.",
                    "translation": "강우량이 동일하게 유지되더라도 실제로 이용 가능한 물의 양은 줄어든다.",
                    "learning_note": "even if는 ‘~일지라도’라는 조건을 만듭니다.",
                    "focus_terms": ["Even if", "remain the same", "net water availability"],
                },
            ],
            "conversation_questions": [
                {
                    "question": "How does climate change affect water availability in your country?",
                    "sample_answer": "Korea has a monsoon climate, but changing rainfall patterns are making water management more difficult.",
                    "coaching_point": "Use ‘due to’ or ‘because of’ to explain a cause.",
                },
                {
                    "question": "How can individuals help reduce water waste during dry seasons?",
                    "sample_answer": "People can reuse water whenever possible and avoid unnecessary consumption.",
                    "coaching_point": "Use can + base verb to describe practical actions.",
                },
                {
                    "question": "What policies could help communities manage climate-related water challenges?",
                    "sample_answer": "Water reuse technologies and better infrastructure could help communities adapt.",
                    "coaching_point": "Use could to suggest possible solutions politely.",
                },
            ],
            "review_rules": [
                {
                    "sentence_index": 1,
                    "concepts": [
                        {
                            "name": "현재의 현실",
                            "keywords": ["현재", "현실", "생태계", "공동체", "자원"],
                            "wrong_patterns": ["먼 미래에만"],
                            "feedback": "present reality는 현재 실제로 일어나고 있는 현실을 뜻합니다.",
                        }
                    ],
                },
                {
                    "sentence_index": 2,
                    "concepts": [
                        {
                            "name": "가뭄과 홍수의 대조",
                            "keywords": ["가뭄", "홍수", "반면", "일부 지역", "다른 지역"],
                            "wrong_patterns": ["모든 지역이 가뭄"],
                            "feedback": "while은 서로 다른 지역의 상황을 대조합니다.",
                        }
                    ],
                },
                {
                    "sentence_index": 3,
                    "concepts": [
                        {
                            "name": "조건과 결과",
                            "keywords": ["강우량", "같은", "물", "감소"],
                            "wrong_patterns": ["물의 양이 증가"],
                            "feedback": "even if는 특정 조건에도 결과가 유지됨을 나타냅니다.",
                        }
                    ],
                },
            ],
            "audio_script": (
                "Climate change is no longer a distant threat. It is a present reality that affects ecosystems, "
                "communities, and the availability of vital resources. Among the most critical of these resources "
                "is water."
            ),
            "metadata": {"reading_time": "5 minutes", "conversation_time": "10 minutes"},
        }
        return validate_content(content)
