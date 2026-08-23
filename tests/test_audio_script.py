import unittest

from src.generators.audio_script import build_audio_script
from src.generators.sample_generator import SampleContentGenerator


class AudioScriptTests(unittest.TestCase):
    def test_builds_intro_body_and_practice_sections(self):
        content = SampleContentGenerator().generate("Climate Change and Water")
        plan = build_audio_script(content)

        self.assertIn("Welcome to today's English learning audio", plan["introduction"])
        self.assertEqual(len(plan["difficult_sentences"]), 3)
        self.assertEqual(len(plan["difficult_words"]), 5)
        self.assertGreater(plan["full_script"].find(plan["body"]), 0)

        for sentence in plan["difficult_sentences"]:
            self.assertIn(f"{sentence} {sentence}", plan["full_script"])
        for word in plan["difficult_words"]:
            self.assertIn(f"{word}. {word}.", plan["full_script"])

    def test_manual_audio_practice_override(self):
        content = SampleContentGenerator().generate("Climate Change and Water")
        content["audio_practice"] = {
            "difficult_sentences": [item["sentence"] for item in content["sentence_interpretations"]],
            "difficult_words": ["reality", "resources", "ecosystems", "communities", "availability"],
        }
        plan = build_audio_script(content)
        self.assertEqual(len(plan["difficult_sentences"]), 3)
        self.assertEqual(plan["difficult_words"][0], "reality")


if __name__ == "__main__":
    unittest.main()
