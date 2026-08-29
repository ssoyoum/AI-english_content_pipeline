"""Generate the seven sample lesson TTS tracks used by the UI preview."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.generators.tts_generator import LocalTTSGenerator

LESSONS = {
    "weekly-day-2-rest": [
        "Rest is not a reward for finishing everything; it is part of the process that helps us do meaningful work.",
        "A sustainable routine gives people enough space to focus, recover, and return with more energy.",
        "Even a small change in our daily habits can improve the way we feel and work.",
        "Rest gives the brain time to organize new information and make useful connections.",
        "Learners often remember more when they alternate focused practice with short, intentional breaks.",
        "A realistic schedule protects energy instead of using every available minute for work.",
        "Sleep is one of the simplest ways to support memory, attention, and emotional balance.",
        "When people ignore recovery, even meaningful goals can begin to feel impossible.",
        "A short walk can create enough distance to return to a difficult problem with fresh eyes.",
        "The goal is not to avoid effort but to make effort sustainable over the long term.",
    ],
    "weekly-day-3-digital-focus": [
        "Digital minimalism asks us to use technology with intention rather than by default.",
        "Short periods away from notifications can restore attention and reduce mental noise.",
        "A focused digital environment makes it easier to notice what deserves our attention.",
        "Before adding a new tool, people can ask whether it solves a real and recurring problem.",
        "Turning off unnecessary alerts creates a quiet boundary around important work.",
        "Choosing fewer sources can help us read more carefully and remember what we learn.",
        "Intentional use does not reject technology; it gives technology a clear purpose.",
        "A device-free transition between tasks can protect the quality of our concentration.",
        "The less attention we spend on low-value choices, the more energy remains for creative work.",
        "Digital minimalism is a practice that can be adjusted as our priorities change.",
    ],
    "weekly-day-4-technology-trust": [
        "People trust a system more when they understand how it makes important decisions.",
        "Clear explanations turn complex tools into services that people can use responsibly.",
        "Trust grows when a service explains its limits as clearly as its benefits.",
        "People need a way to question an automated decision when the result affects their lives.",
        "Transparent design shows which information was used and which information was left out.",
        "A reliable tool should make it possible to correct an error without starting over.",
        "Clear language can reduce fear when people are asked to try an unfamiliar system.",
        "Accountability matters because every useful technology still reflects human choices.",
        "The best explanation is not the longest one but the one that helps a person act.",
        "Trust becomes stronger when users can see how feedback changes the product.",
    ],
    "weekly-day-5-global-communication": [
        "Effective communication depends on listening carefully and checking what the other person means.",
        "A shared vocabulary helps teams solve misunderstandings before they become larger problems.",
        "Good collaboration begins when speakers make room for different ways of expressing an idea.",
        "A short summary after a meeting can prevent small misunderstandings from spreading.",
        "Time-zone differences require teams to document decisions instead of relying on memory.",
        "Questions are often more useful than quick answers when the context is unfamiliar.",
        "Respectful disagreement can reveal an assumption that the whole team had overlooked.",
        "Shared examples give abstract instructions a meaning that everyone can discuss.",
        "A team communicates better when important information is easy to find later.",
        "Listening for the intention behind a sentence is as important as translating its words.",
    ],
    "weekly-day-6-small-habits": [
        "A habit becomes easier to keep when the action is simple enough to repeat every day.",
        "Consistency matters more than intensity when we are building a lasting change.",
        "The first step should be small enough that it does not depend on perfect motivation.",
        "Attaching a new action to an existing routine makes it easier to remember.",
        "Tracking a habit can provide useful information without turning the routine into a competition.",
        "Missing one day is a signal to adjust the plan, not a reason to abandon it.",
        "A flexible routine can survive changes in schedule, energy, and unexpected events.",
        "People are more likely to continue when progress is visible in a simple form.",
        "The purpose of a routine is to support a life, not to control every moment of it.",
        "Over time, repeated choices can become evidence that a person is capable of change.",
    ],
    "weekly-day-7-ideas-action": [
        "A useful idea becomes stronger when we test it with a real person and learn from the result.",
        "Small experiments give us evidence that can guide the next decision.",
        "An experiment turns an abstract possibility into something that can be observed and discussed.",
        "Good ideas become clearer when we describe the problem they are meant to solve.",
        "Feedback is most useful when it arrives early enough to change the next attempt.",
        "A failed test can narrow the possibilities and save time on the next decision.",
        "Creative work needs both imagination and a practical way to evaluate results.",
        "Teams move faster when they separate a promising idea from their personal identity.",
        "A clear next step keeps a discussion from ending with enthusiasm but no action.",
        "Learning by doing gives language a purpose because every phrase supports a real decision.",
    ],
}


def main() -> None:
    generator = LocalTTSGenerator()
    for slug, sentences in LESSONS.items():
        output_dir = ROOT / "outputs" / slug
        transcript = " ".join(sentences)
        generator.generate(
            transcript,
            output_dir / "audio.mp3",
            output_dir / "audio_cues.json",
            transcript_text=transcript,
        )
        print(f"generated {slug}")


if __name__ == "__main__":
    main()
