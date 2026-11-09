"""Offline safety tests for the synthetic intake/outbox contract."""
import sqlite3
import tempfile
import unittest
from pathlib import Path
from lead_intake import counts, ingest, setup


class IntakeContractTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        setup(self.db)

    def tearDown(self):
        self.db.close()

    def test_new_contact_queues_one_pending_human_approval(self):
        result = ingest(self.db, "evt-1", " TEST@EXAMPLE.COM ")
        self.assertEqual(result.decision, "NEW_CONTACT")
        self.assertTrue(result.outbox_queued)
        self.assertEqual(counts(self.db), {"contacts": 1, "processed_events": 1, "review_queue": 0, "outbox": 1})
        self.assertEqual(self.db.execute("SELECT state FROM outbox").fetchone()[0], "pending_human_approval")

    def test_replayed_event_never_queues_second_action(self):
        ingest(self.db, "evt-1", "user@example.test")
        self.assertEqual(ingest(self.db, "evt-1", "other@example.test").decision, "DUPLICATE_EVENT")
        self.assertEqual(counts(self.db)["outbox"], 1)
        self.assertEqual(counts(self.db)["contacts"], 1)

    def test_different_events_same_normalized_contact(self):
        ingest(self.db, "evt-1", "U@EXAMPLE.TEST")
        result = ingest(self.db, "evt-2", "u@example.test")
        self.assertEqual(result.decision, "KNOWN_CONTACT")
        self.assertFalse(result.outbox_queued)
        self.assertEqual(counts(self.db)["processed_events"], 2)
        self.assertEqual(counts(self.db)["outbox"], 1)

    def test_invalid_address_is_flagged_without_side_effect(self):
        self.assertEqual(ingest(self.db, "evt-bad", "no-address").decision, "REVIEW_INVALID_EMAIL")
        self.assertEqual(counts(self.db), {"contacts": 0, "processed_events": 0, "review_queue": 1, "outbox": 0})
        self.assertEqual(ingest(self.db, "evt-bad", "valid@example.test").decision, "ALREADY_FLAGGED_FOR_REVIEW")

    def test_missing_address_is_review_not_sent(self):
        self.assertEqual(ingest(self.db, "evt-empty", None).decision, "REVIEW_INVALID_EMAIL")
        self.assertEqual(counts(self.db)["outbox"], 0)

    def test_event_id_constraints(self):
        for val in ("", "x" * 129, "bad\nvalue", None):
            with self.subTest(val=val):
                with self.assertRaises(ValueError):
                    ingest(self.db, val, "u@example.test")

    def test_sql_injection_like_input_is_treated_as_data(self):
        result = ingest(self.db, "evt-1' OR 1=1 --", "u@example.test")
        self.assertEqual(result.decision, "NEW_CONTACT")
        self.assertEqual(counts(self.db)["contacts"], 1)

    def test_sqlite_file_survives_restart_without_replay(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "state.db"
            db = sqlite3.connect(path)
            setup(db)
            ingest(db, "evt-1", "user@example.test")
            db.close()
            reopened = sqlite3.connect(path)
            setup(reopened)
            self.assertEqual(ingest(reopened, "evt-1", "user@example.test").decision, "DUPLICATE_EVENT")
            self.assertEqual(counts(reopened)["outbox"], 1)
            reopened.close()

    def test_atomic_rollback_if_outbox_insert_fails(self):
        self.db.execute("CREATE TRIGGER block_outbox BEFORE INSERT ON outbox BEGIN SELECT RAISE(ABORT,'test failure'); END")
        with self.assertRaises(sqlite3.IntegrityError):
            ingest(self.db, "evt-1", "user@example.test")
        self.assertEqual(counts(self.db), {"contacts": 0, "processed_events": 0, "review_queue": 0, "outbox": 0})

    def test_receipt_excludes_email_data(self):
        receipt = ingest(self.db, "private-evt", "private-user@example.test")
        self.assertNotIn("private-user", repr(receipt))
        self.assertNotIn("private-evt", repr(receipt))


if __name__ == "__main__":
    unittest.main()
