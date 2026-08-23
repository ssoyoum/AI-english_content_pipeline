import unittest

from src.generators.sample_generator import SampleContentGenerator
from src.publishers.html_publisher import build_learning_html


class HtmlPublisherTests(unittest.TestCase):
    def test_highlights_focus_terms_and_includes_study_controls(self):
        content = SampleContentGenerator().generate("Climate Change and Water")
        html = build_learning_html(
            content,
            audio_filename="audio.mp3",
            review_url="/pipeline/review",
            content_reference="outputs/example/content.json",
            lesson_day=2,
            lesson_days=[1, 2],
        )
        self.assertIn("class='focus-word'", html)
        self.assertIn("audio.mp3", html)
        self.assertIn("reviewAnswer", html)
        self.assertIn("Read mode", html)
        self.assertIn("DAY 02", html)
        self.assertIn("calendar-grid", html)
        self.assertIn("availableLessonDays", html)


if __name__ == "__main__":
    unittest.main()
