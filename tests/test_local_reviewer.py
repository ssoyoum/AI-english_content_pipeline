import unittest

from src.review.local_reviewer import review_interpretation


class LocalReviewerTests(unittest.TestCase):
    concepts = [
        {
            "name": "현재의 현실",
            "keywords": ["현재", "현실", "지금"],
            "wrong_patterns": ["미래", "언젠가"],
            "feedback": "present reality는 현재 실제로 일어나고 있다는 뜻입니다.",
        },
        {
            "name": "영향을 받는 대상",
            "keywords": ["생태계", "공동체", "자원"],
            "wrong_patterns": [],
            "feedback": "affects 뒤의 세 대상을 함께 확인하세요.",
        },
    ]

    def test_detects_understood_and_missing_concepts(self):
        result = review_interpretation("현재의 현실이 생태계에 영향을 준다.", self.concepts)
        self.assertEqual(len(result["understood"]), 2)
        self.assertFalse(result["issues"])

    def test_detects_misunderstanding(self):
        result = review_interpretation("미래에 생길 일이다.", self.concepts)
        self.assertTrue(any("미래" in issue for issue in result["issues"]))


if __name__ == "__main__":
    unittest.main()
