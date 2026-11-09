/* Moruneva / fictional approval + payment release gate.
 * Pure local decision function. Never sends, requests, persists, or verifies a payment.
 * All inputs represent human-provided hypothetical claims, NOT real system evidence.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.MorunevaApprovalGate = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const PAYMENT = Object.freeze(["paid", "pending", "overdue", "refunded", "unknown"]);
  const CODES = Object.freeze({
    INVALID_INPUT: "REVIEW_INPUT",
    MISSING_REFERENCE: "REVIEW_REFERENCE",
    UNKNOWN_PAYMENT: "HOLD_PAYMENT_UNKNOWN",
    NOT_PAID: "HOLD_PAYMENT_UNCONFIRMED",
    REFUNDED: "BLOCK_REFUNDED",
    MISSING_EVIDENCE: "HOLD_EVIDENCE",
    APPROVAL_ONE: "HOLD_APPROVAL_ONE",
    APPROVAL_TWO: "HOLD_APPROVAL_TWO",
    ALREADY_QUEUED: "BLOCK_DUPLICATE",
    NOT_A_LIVE_SENDER: "BLOCK_LIVE_MODE",
    READY_DRAFT: "READY_FOR_MANUAL_DRAFT_REVIEW"
  });
  function evaluate(input) {
    const r = (code, explanation) => Object.freeze({
      code, explanation, draftPermitted: code === CODES.READY_DRAFT,
      maySend: false, externalPaymentVerified: false
    });
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
      return r(CODES.INVALID_INPUT, "Use a structured fictional case.");
    }
    const keys = ["approvalOne","approvalTwo","paymentStatus","paymentVerified","caseRef","eventRef","alreadyQueued","liveMode"];
    if (Object.keys(input).some(k => !keys.includes(k))) {
      return r(CODES.INVALID_INPUT, "Unexpected field; do not supply customer records or credentials.");
    }
    for (const k of ["approvalOne","approvalTwo","paymentVerified","alreadyQueued","liveMode"]) {
      if (typeof input[k] !== "boolean") {
        return r(CODES.INVALID_INPUT, "All gate flags must be explicit true or false values.");
      }
    }
    if (!PAYMENT.includes(input.paymentStatus)) {
      return r(CODES.INVALID_INPUT, "Payment status must be one of the documented choices.");
    }
    if ([input.caseRef, input.eventRef].some(v =>
      typeof v !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(v))) {
      return r(CODES.MISSING_REFERENCE, "Use short fictional, stable references with letters, digits, _ or -.");
    }
    // No live actuation exists by design, even with every other input green.
    if (input.liveMode) return r(CODES.NOT_A_LIVE_SENDER, "This checker cannot connect to or release any live action.");
    if (input.alreadyQueued) return r(CODES.ALREADY_QUEUED, "An action is already marked queued; review before replay.");
    if (input.paymentStatus === "refunded") return r(CODES.REFUNDED, "Refunded is not an active paid state.");
    if (input.paymentStatus === "unknown") return r(CODES.UNKNOWN_PAYMENT, "Unknown payment status must be reconciled.");
    if (input.paymentStatus !== "paid") return r(CODES.NOT_PAID, "Pending or overdue payment cannot release this hypothetical draft.");
    if (!input.paymentVerified) return r(CODES.MISSING_EVIDENCE, "Claimed paid status lacks independently checked evidence.");
    if (!input.approvalOne) return r(CODES.APPROVAL_ONE, "First explicit human approval is missing.");
    if (!input.approvalTwo) return r(CODES.APPROVAL_TWO, "Second explicit human approval is missing.");
    return r(CODES.READY_DRAFT, "Conditions allow only a manually reviewed draft; no external action was sent.");
  }
  return Object.freeze({ evaluate, PAYMENT, CODES });
});
