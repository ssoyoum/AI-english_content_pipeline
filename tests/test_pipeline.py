import json
import tempfile
import unittest
from pathlib import Path

from src.generators.sample_generator import SampleContentGenerator
from src.models.content import ContentValidationError, validate_content
from src.pipeline.pipeline import ContentPipeline, record_stage, slugify


class PipelineTests(unittest.TestCase):
    def test_sample_content_matches_contract(self):
        content = SampleContentGenerator().generate("Climate Change and Water")
        self.assertEqual(len(content["conversation_questions"]), 3)
        self.assertTrue(content["sentence_interpretations"])

    def test_pipeline_writes_content_and_run_metadata(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            output = ContentPipeline(SampleContentGenerator()).run(
                "Climate Change and Water", Path(temporary_directory)
            )
            self.assertEqual(output.name, "climate-change-and-water")
            content = json.loads((output / "content.json").read_text(encoding="utf-8"))
            metadata = json.loads((output / "run.json").read_text(encoding="utf-8"))
            self.assertEqual(content["title"], "Climate Change and Water")
            self.assertEqual(metadata["status"], "content_generated")

    def test_slugify(self):
        self.assertEqual(slugify("Climate Change & Water!"), "climate-change-water")

    def test_invalid_content_is_rejected(self):
        with self.assertRaises(ContentValidationError):
            validate_content({"topic": "Only a topic"})

    def test_record_stage_updates_run_metadata(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            output = ContentPipeline(SampleContentGenerator()).run(
                "Climate Change and Water", Path(temporary_directory)
            )
            record_stage(output, "tts", "success", {"artifact": "audio.mp3"})
            metadata = json.loads((output / "run.json").read_text(encoding="utf-8"))
            self.assertEqual(metadata["stages"]["tts"]["status"], "success")
            self.assertEqual(metadata["stages"]["tts"]["artifact"], "audio.mp3")


if __name__ == "__main__":
    unittest.main()
