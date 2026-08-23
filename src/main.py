"""CLI entry point for the English Content Pipeline MVP."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  # Optional for sample mode; environment variables still work.
    load_dotenv = None

if load_dotenv:
    load_dotenv()

from src.generators.content_generator import ContentGenerationError, ContentGenerator
from src.generators.audio_script import build_audio_script
from src.generators.manual_generator import ManualContentGenerator
from src.generators.sample_generator import SampleContentGenerator
from src.generators.tts_generator import LocalTTSGenerator, TTSGenerationError
from src.pipeline.pipeline import ContentPipeline, record_stage
from src.publishers.notion_publisher import NotionPublishError, NotionPublisher


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate an English learning content package.")
    parser.add_argument("--topic", help="Topic for the learning content")
    parser.add_argument(
        "--sample",
        action="store_true",
        help="Use deterministic sample data without calling an LLM API",
    )
    parser.add_argument(
        "--output-dir",
        default="outputs",
        help="Directory where generated artifacts are saved (default: outputs)",
    )
    parser.add_argument(
        "--content-file",
        help="Use a user-authored JSON content file without calling an LLM API",
    )
    parser.add_argument(
        "--notion-preview",
        action="store_true",
        help="Write Notion Markdown locally without publishing",
    )
    parser.add_argument(
        "--publish-notion",
        action="store_true",
        help="Create a Notion page using NOTION_API_KEY and NOTION_PARENT_PAGE_ID",
    )
    parser.add_argument(
        "--tts",
        action="store_true",
        help="Generate an MP3 file using the configurable API-key-free Edge voice",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    output_dir: Path | None = None
    try:
        if args.sample and args.content_file:
            raise ContentGenerationError("Use either --sample or --content-file, not both.")
        if not args.topic and not args.content_file:
            raise ContentGenerationError("--topic is required unless --content-file is provided.")
        if args.content_file:
            generator = ManualContentGenerator(Path(args.content_file))
        elif args.sample:
            generator = SampleContentGenerator()
        else:
            generator = ContentGenerator()
        output_dir = ContentPipeline(generator).run(args.topic or "", Path(args.output_dir))
        record_stage(output_dir, "content_generation", "success")
        content = json.loads((output_dir / "content.json").read_text(encoding="utf-8"))

        if args.notion_preview:
            try:
                preview_path = NotionPublisher.write_preview(content, output_dir / "notion.md")
                record_stage(
                    output_dir,
                    "notion_preview",
                    "success",
                    {"artifact": str(preview_path.relative_to(output_dir))},
                )
                print(f"[OK] Notion preview created: {preview_path}")
            except Exception as error:
                record_stage(output_dir, "notion_preview", "failed", {"error": str(error)}, "failed")
                raise

        if args.publish_notion:
            try:
                notion_result = NotionPublisher().publish(content)
                notion_url = notion_result.get("url", "(URL unavailable)")
                (output_dir / "notion_result.json").write_text(
                    json.dumps(notion_result, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
                record_stage(
                    output_dir,
                    "notion_publish",
                    "success",
                    {"url": notion_url, "artifact": "notion_result.json"},
                )
                print(f"[OK] Notion page created: {notion_url}")
            except Exception as error:
                record_stage(output_dir, "notion_publish", "failed", {"error": str(error)}, "failed")
                raise

        if args.tts:
            try:
                audio_plan = build_audio_script(content)
                (output_dir / "audio_script.txt").write_text(
                    audio_plan["full_script"], encoding="utf-8"
                )
                (output_dir / "audio_plan.json").write_text(
                    json.dumps(
                        {key: value for key, value in audio_plan.items() if key != "full_script"},
                        ensure_ascii=False,
                        indent=2,
                    )
                    + "\n",
                    encoding="utf-8",
                )
                audio_path = LocalTTSGenerator().generate(
                    audio_plan["full_script"], output_dir / "audio.mp3"
                )
                record_stage(
                    output_dir,
                    "tts",
                    "success",
                    {
                        "artifact": str(audio_path.relative_to(output_dir)),
                        "difficult_sentences": len(audio_plan["difficult_sentences"]),
                        "difficult_words": len(audio_plan["difficult_words"]),
                    },
                )
                print(f"[OK] Local audio created: {audio_path}")
            except Exception as error:
                record_stage(output_dir, "tts", "failed", {"error": str(error)}, "failed")
                raise
        if args.notion_preview or args.publish_notion or args.tts:
            record_stage(output_dir, "pipeline", "success", overall_status="completed")
    except ContentGenerationError as error:
        print(f"[ERROR] {error}")
        return 1
    except (NotionPublishError, TTSGenerationError) as error:
        print(f"[ERROR] {error}")
        return 1
    except Exception as error:
        print(f"[ERROR] Pipeline failed: {error}")
        return 1

    print(f"[OK] Content package created: {output_dir}")
    print(f"[OK] Main artifact: {output_dir / 'content.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
