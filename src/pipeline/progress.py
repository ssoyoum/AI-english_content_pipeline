"""Pure helpers for deriving progress values from locally stored study records."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Mapping


def calculate_current_streak(
    completion_by_date: Mapping[str, object],
    reference_date: date | None = None,
) -> int:
    """Count consecutive completed days ending today or the most recent day.

    A completed day is represented by a truthy value keyed as ``YYYY-MM-DD``.
    If today is not complete, yesterday can still be the end of the current
    streak; older gaps stop the count.
    """

    completed = {key for key, value in completion_by_date.items() if value}
    if not completed:
        return 0
    cursor = reference_date or date.today()
    if cursor.isoformat() not in completed:
        cursor -= timedelta(days=1)
    streak = 0
    while cursor.isoformat() in completed:
        streak += 1
        cursor -= timedelta(days=1)
    return streak
