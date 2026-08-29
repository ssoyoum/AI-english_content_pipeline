import unittest

from src.api import AdminLessonGenerateRequest, admin_generate_lesson, app


class AdminContentTests(unittest.TestCase):
    def test_admin_route_and_generate_route_exist(self):
        routes = {route.path for route in app.routes}
        self.assertIn("/admin", routes)
        self.assertIn("/api/admin/lessons/generate", routes)
        self.assertIn("/api/admin/lessons/publish", routes)

    def test_local_sample_generates_requested_sentence_count(self):
        result = admin_generate_lesson(
            AdminLessonGenerateRequest(
                topic="AI Regulation",
                level="Intermediate",
                sentence_count=10,
                category="Technology",
                sample=True,
            )
        )
        self.assertEqual(result["status"], "draft")
        self.assertEqual(result["metadata"]["source"], "local sample")
        self.assertEqual(len(result["content"]["sentence_interpretations"]), 10)


if __name__ == "__main__":
    unittest.main()
