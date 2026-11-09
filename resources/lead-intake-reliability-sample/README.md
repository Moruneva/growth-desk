# Synthetic lead-intake reliability sample

**Public technical proof, not a customer case study.** This is a small standalone Python/SQLite model for one of the business automation failure patterns found in public paid-work briefs: duplicate form/webhook events, incomplete lead records, and duplicate queued follow-ups. It is independent of the unreleased Growth Desk product.

Run offline with Python 3.10+ (no dependencies):

```sh
python3 -m unittest discover -s resources/lead-intake-reliability-sample -p 'test_*.py' -v
```

The 10 deterministic tests exercise:

| Scenario | Contract checked |
| --- | --- |
| First valid lead | One contact, one pending draft in the outbox |
| Same event ID replayed | No second contact or draft |
| New event for normalized existing email | Existing contact reused; no duplicate draft |
| Missing or invalid email | Mark for manual review; do not queue follow-up |
| Repeated invalid event | Remains flagged; no silent reclassification |
| Invalid/control-character event ID | Reject early |
| SQL-like text in event ID | Treat as bound input data, never executable SQL |
| Process restart | SQLite state persists; replay remains suppressed |
| Outbox storage failure | Transaction rolls back all corresponding writes |
| Receipt privacy boundary | Returned receipt excludes raw email and event identifier |

**Deliberate boundaries:** The sample has no HTTP listener, n8n workflow, account integration, live third-party API, outbound message sender, scheduler, AI classifier, customer consent collection, or external validation. It never automatically sends a message: outbox entries remain `pending_human_approval`. The SQLite demo uses only synthetic addresses; a real implementation requires consent, retention/deletion controls, secure storage, monitoring, concurrency and reconciliation tests, credentials handling, and a signed scope. Email normalization is simplified for demonstration, and the one-follow-up-per-contact rule is a hypothetical acceptance criterion requiring buyer confirmation.

**What the evidence means:** Passing tests proves only the listed local state transitions against synthetic cases. It does not establish a deployed production integration, successful client delivery, n8n certification, paid user adoption, or an actual order.

Reference problem sources: public n8n Community paid lead-management job dated 2026-11-05, which the buyer subsequently closed the same day (do not contact the poster); related currently public automation job descriptions about duplicate-event and error handling. This sample was **not commissioned by that buyer**.
