import unittest

from src.pipeline.lesson_catalog import get_lesson, get_lesson_by_id, list_lessons


class LessonCatalogTests(unittest.TestCase):
    def test_catalog_contains_weekly_lessons(self):
        lessons = list_lessons()
        self.assertEqual([lesson["day"] for lesson in lessons], list(range(1, 8)))
        self.assertTrue(all(lesson["sentence_count"] == 10 for lesson in lessons))
        self.assertEqual(get_lesson(1)["topic"], "Climate Change and Water")
        self.assertEqual(get_lesson_by_id("technology-and-trust")["day"], 4)


if __name__ == "__main__":
    unittest.main()
