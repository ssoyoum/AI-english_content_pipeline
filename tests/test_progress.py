import unittest
from datetime import date

from src.pipeline.progress import calculate_current_streak


class ProgressTests(unittest.TestCase):
    def test_counts_consecutive_days_ending_yesterday(self):
        records = {
            "2026-08-27": True,
            "2026-08-28": True,
            "2026-08-29": True,
            "2026-08-25": True,
        }
        self.assertEqual(calculate_current_streak(records, date(2026, 8, 30)), 3)

    def test_gap_breaks_streak(self):
        records = {"2026-08-28": True, "2026-08-30": True}
        self.assertEqual(calculate_current_streak(records, date(2026, 8, 30)), 1)

    def test_empty_records_have_no_streak(self):
        self.assertEqual(calculate_current_streak({}, date(2026, 8, 30)), 0)


if __name__ == "__main__":
    unittest.main()
