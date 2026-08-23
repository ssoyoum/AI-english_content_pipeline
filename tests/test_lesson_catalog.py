import unittest

from src.pipeline.lesson_catalog import get_lesson, list_lessons


class LessonCatalogTests(unittest.TestCase):
    def test_catalog_contains_two_lessons(self):
        lessons = list_lessons()
        self.assertEqual([lesson["day"] for lesson in lessons], [1, 2])
        self.assertEqual(get_lesson(2)["topic"], "Climate Change and Water")


if __name__ == "__main__":
    unittest.main()
