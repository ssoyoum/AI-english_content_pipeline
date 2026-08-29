import unittest

from src.api import app, lesson_catalog_api, lesson_content_api


class ApiTests(unittest.TestCase):
    def test_api_metadata_and_routes(self):
        self.assertEqual(app.title, "English Content Pipeline")
        routes = {route.path for route in app.routes}
        self.assertIn("/health", routes)
        self.assertIn("/pipeline/content", routes)
        self.assertIn("/lessons", routes)
        self.assertIn("/api/lessons", routes)
        self.assertIn("/api/lessons/{lesson_id}", routes)
        self.assertIn("/lessons/{day}/generate", routes)
        self.assertIn("/", routes)
        self.assertIn("/ui", routes)

    def test_lesson_api_returns_catalog_and_full_content(self):
        catalog = lesson_catalog_api()
        self.assertEqual(len(catalog), 7)
        self.assertEqual(catalog[0]["id"], "climate-change-water")
        detail = lesson_content_api("climate-change-water")
        self.assertEqual(detail["content"]["title"], "Climate Change and Water")
        self.assertEqual(len(detail["content"]["sentence_interpretations"]), 10)


if __name__ == "__main__":
    unittest.main()
