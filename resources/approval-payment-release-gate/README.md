# Two human approvals + payment state: a fictional safety gate

Independent public technical sample from **Moruneva**, created 10 November 2026. This is **not** part of an existing Growth Desk product release, not a payment platform integration, and not a completed client project.

## Reproduce the 18 checks locally

Requirements: Node.js 18+; no downloads, API keys, dependencies, accounts, network requests or real customer records.

```bash
cd resources/approval-payment-release-gate
node --test test_approval_payment_release_gate.cjs
```

The executable module exports `evaluate(input)`, `CODES` and `PAYMENT`. Test cases cover: both approvals, missing either approval, pending/overdue/unknown/refunded status, claimed paid without external evidence, duplicate queue state, explicitly forbidden live mode, missing or malformed references, invalid flags, unexpected fields, state revision, and intentionally closed outputs.

When all hypothetical conditions are satisfied the sole positive result is `READY_FOR_MANUAL_DRAFT_REVIEW`. **All cases report `maySend: false` and `externalPaymentVerified: false`.** The function does not send, charge, read databases, store data, authenticate a user or access payment providers. Visitor-provided checkbox values are hypothetical inputs, never real proof of approval or settlement.

## Limitations

- A real paid state must be independently checked from an authorized payment source at the time of dispatch.
- An actual system also needs durable idempotency keys, audit events, revocation and concurrency controls, authorization, retention/deletion policy, and operational monitoring.
- Free native n8n Wait/Error features and Make incomplete-execution handling may already solve part of a buyer's problem; compare them before paying for bespoke code.
- This public sample must not be presented as a production-ready connector, completed customer engagement, certification, successful transaction or claim that 18 tests establish real-world safety.

[Read the full original guide and use the browser-local fictional demo](https://moruneva.com/approval-payment-release-guide).

Primary documentation referenced by the guide: [n8n waiting](https://docs.n8n.io/build/flow-logic/wait), [n8n error handling](https://docs.n8n.io/build/flow-logic/handle-errors-gracefully), [Make error handlers](https://help.make.com/overview-of-error-handling), [Make incomplete executions](https://help.make.com/manage-incomplete-executions).
