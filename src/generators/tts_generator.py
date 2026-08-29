"""Generate local audio without a paid TTS API."""

from __future__ import annotations

import asyncio
import os
import re
import subprocess
from pathlib import Path


class TTSGenerationError(RuntimeError):
    """Raised when local speech synthesis is unavailable."""


class LocalTTSGenerator:
    def generate(
        self,
        audio_script: str,
        output_path: Path,
        timing_path: Path | None = None,
        transcript_text: str | None = None,
    ) -> Path:
        if not audio_script.strip():
            raise TTSGenerationError("audio_script must not be empty")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.unlink(missing_ok=True)
        if timing_path:
            timing_path.unlink(missing_ok=True)

        # Prefer the configurable neural voice so the result matches TTS_VOICE.
        edge_error: Exception | None = None
        try:
            return self._generate_with_edge_tts(
                audio_script,
                output_path,
                timing_path,
                transcript_text,
            )
        except Exception as error:  # Windows voice engines can fail independently of the package.
            edge_error = error

        pyttsx_error: Exception | None = None
        windows_error: Exception | None = None
        try:
            import pyttsx3

            engine = pyttsx3.init()
            engine.save_to_file(audio_script, str(output_path))
            engine.runAndWait()
            if output_path.exists() and output_path.stat().st_size > 0:
                return output_path
        except Exception as error:
            pyttsx_error = error

        try:
            return self._generate_with_windows_speech(audio_script, output_path)
        except Exception as error:
            windows_error = error
            details = (
                f"Edge TTS={edge_error}; pyttsx3={pyttsx_error}; "
                f"Windows Speech={windows_error}"
            )
            raise TTSGenerationError(f"TTS failed: {details}") from error

    @staticmethod
    def _generate_with_edge_tts(
        audio_script: str,
        output_path: Path,
        timing_path: Path | None = None,
        transcript_text: str | None = None,
    ) -> Path:
        """Use Microsoft's free Edge voice endpoint without an API key."""
        import edge_tts
        import json

        voice = os.getenv("TTS_VOICE", "en-US-JennyNeural")
        rate = os.getenv("TTS_RATE", "-5%")
        pitch = os.getenv("TTS_PITCH", "+0Hz")
        prepared_script = re.sub(
            r"(?<=[.!?])\s+(?=[A-Z])",
            "\n\n",
            audio_script.strip(),
        )

        async def save_audio() -> None:
            communicate = edge_tts.Communicate(
                prepared_script,
                voice,
                rate=rate,
                pitch=pitch,
                boundary="WordBoundary",
            )
            audio_chunks: list[bytes] = []
            word_cues: list[dict[str, object]] = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_chunks.append(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    word_cues.append(
                        {
                            "text": chunk["text"],
                            "start": chunk["offset"] / 10_000_000,
                            "end": (chunk["offset"] + chunk["duration"]) / 10_000_000,
                        }
                    )
            output_path.write_bytes(b"".join(audio_chunks))
            if timing_path:
                timing_path.write_text(
                    json.dumps(
                        {
                            "version": 1,
                            "voice": voice,
                            "rate": rate,
                            "pitch": pitch,
                            "transcript": transcript_text or audio_script,
                            "words": word_cues,
                        },
                        ensure_ascii=False,
                        indent=2,
                    )
                    + "\n",
                    encoding="utf-8",
                )

        asyncio.run(save_audio())
        if not output_path.exists() or output_path.stat().st_size == 0:
            raise TTSGenerationError(f"Edge TTS did not create an audio file: {output_path}")
        return output_path

    @staticmethod
    def _generate_with_windows_speech(audio_script: str, output_path: Path) -> Path:
        output_path = output_path.resolve()
        text_path = output_path.with_suffix(".txt")
        text_path.write_text(audio_script, encoding="utf-8")
        environment = os.environ.copy()
        environment["PIPELINE_TTS_TEXT"] = str(text_path)
        environment["PIPELINE_TTS_OUTPUT"] = str(output_path)
        script = (
            "Add-Type -AssemblyName System.Speech; "
            "$textPath = $env:PIPELINE_TTS_TEXT; "
            "$outputPath = $env:PIPELINE_TTS_OUTPUT; "
            "$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
            "$synth.SetOutputToWaveFile($outputPath); "
            "$synth.Speak([System.IO.File]::ReadAllText($textPath)); "
            "$synth.SetOutputToNull(); "
            "$synth.Dispose();"
        )
        try:
            result = subprocess.run(
                ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script],
                check=True,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                env=environment,
                timeout=120,
            )
        finally:
            text_path.unlink(missing_ok=True)
        if not output_path.exists() or output_path.stat().st_size == 0:
            diagnostics = " ".join(part for part in (result.stdout.strip(), result.stderr.strip()) if part)
            suffix = f" Output: {diagnostics}" if diagnostics else ""
            raise TTSGenerationError(f"Windows Speech did not create an audio file: {output_path}.{suffix}")
        return output_path
