"""Generate TTS tracks for every lesson registered in the content catalog."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.pipeline.lesson_catalog import get_lesson, list_lessons, read_lesson_content
from src.generators.tts_generator import LocalTTSGenerator


def main() -> None:
    generator = LocalTTSGenerator()
    for metadata in list_lessons():
        lesson = get_lesson(metadata["day"])
        content = read_lesson_content(lesson)
        output_slug = metadata.get("audio_output", metadata["id"])
        output_dir = ROOT / "outputs" / output_slug
        transcript = content["audio_script"]
        generator.generate(
            transcript,
            output_dir / "audio.mp3",
            output_dir / "audio_cues.json",
            transcript_text=transcript,
        )
        print(f"generated {metadata['id']}")


if __name__ == "__main__":
    main()
