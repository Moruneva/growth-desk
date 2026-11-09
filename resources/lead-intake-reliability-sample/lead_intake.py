"""Fictional lead-intake reliability proof; no outbound requests, no n8n deployment.

All identifiers used in the demonstration/tests are synthetic. This is an
in-memory or local SQLite contract model, not a live CRM integration.
"""

import re
import sqlite3
from dataclasses import dataclass
from typing import Optional

EMAIL_RE = re.compile(r"^[^\s@]{1,64}@[^\s@]{1,255}$")
SCHEMA = """
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS processed_events (
    event_id TEXT PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id)
);
CREATE TABLE IF NOT EXISTS review_queue (
    event_id TEXT PRIMARY KEY,
    reason TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS outbox (
    id INTEGER PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id),
    action TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'pending_human_approval',
    UNIQUE(contact_id, action)
);
"""


@dataclass(frozen=True)
class Receipt:
    decision: str
    contact_id: Optional[int] = None
    outbox_queued: bool = False


def setup(db: sqlite3.Connection) -> None:
    """Initialize local persistent state; external side effects are absent."""
    db.executescript(SCHEMA)


def ingest(db: sqlite3.Connection, event_id: str, email: Optional[str]) -> Receipt:
    """Atomically de-duplicate an event and queue at most one human-approved draft.

    Assumptions: event_id is stable per source submission; email is the agreed
    identity key; there is a single welcome-review action per contact. Inputs
    do not include credentials or real recipient details in the demonstration.
    """
    if not isinstance(event_id, str) or not (1 <= len(event_id) <= 128):
        raise ValueError("event_id must be a 1–128 character string")
    if any(ord(ch) < 32 or ord(ch) == 127 for ch in event_id):
        raise ValueError("event_id contains a control character")
    clean = email.strip().lower() if isinstance(email, str) else ""
    valid_email = len(clean) <= 254 and bool(EMAIL_RE.fullmatch(clean))
    # BEGIN IMMEDIATE makes the event/contact/outbox decision one transaction.
    db.execute("BEGIN IMMEDIATE")
    try:
        if db.execute("SELECT 1 FROM processed_events WHERE event_id=?", (event_id,)).fetchone():
            db.commit()
            return Receipt("DUPLICATE_EVENT")
        if db.execute("SELECT 1 FROM review_queue WHERE event_id=?", (event_id,)).fetchone():
            db.commit()
            return Receipt("ALREADY_FLAGGED_FOR_REVIEW")
        if not valid_email:
            db.execute("INSERT INTO review_queue(event_id, reason) VALUES (?, ?)",
                       (event_id, "MISSING_OR_INVALID_EMAIL"))
            db.commit()
            return Receipt("REVIEW_INVALID_EMAIL")
        previous = db.execute("SELECT id FROM contacts WHERE email=?", (clean,)).fetchone()
        if previous is None:
            cur = db.execute("INSERT INTO contacts(email) VALUES (?)", (clean,))
            contact_id = cur.lastrowid
        else:
            contact_id = previous[0]
        db.execute("INSERT INTO processed_events(event_id, contact_id) VALUES (?, ?)",
                   (event_id, contact_id))
        cur = db.execute("INSERT OR IGNORE INTO outbox(contact_id, action) VALUES (?, ?)",
                         (contact_id, "welcome_review"))
        db.commit()
        return Receipt("NEW_CONTACT" if previous is None else "KNOWN_CONTACT",
                       contact_id, cur.rowcount == 1)
    except Exception:
        db.rollback()
        raise


def counts(db: sqlite3.Connection) -> dict:
    """Summarize local state without disclosing email addresses or event IDs."""
    names = ("contacts", "processed_events", "review_queue", "outbox")
    return {name: db.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0] for name in names}
