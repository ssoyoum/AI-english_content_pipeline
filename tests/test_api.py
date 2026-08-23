import unittest

from src.api import app


class ApiTests(unittest.TestCase):
    def test_api_metadata_and_routes(self):
        self.assertEqual(app.title, "English Content Pipeline")
        routes = {route.path for route in app.routes}
        self.assertIn("/health", routes)
        self.assertIn("/pipeline/content", routes)
        self.assertIn("/lessons", routes)
        self.assertIn("/lessons/{day}/generate", routes)


if __name__ == "__main__":
    unittest.main()
