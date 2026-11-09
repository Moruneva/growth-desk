"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {evaluate,CODES,PAYMENT} = require("./approval-payment-release-gate.js");
const base = () => ({
 approvalOne:true, approvalTwo:true, paymentStatus:"paid", paymentVerified:true,
 caseRef:"fictional_case_01", eventRef:"event_001", alreadyQueued:false, liveMode:false
});
const expectCode=(changes,code)=>{const out=evaluate({...base(),...changes});assert.equal(out.code,code);assert.equal(out.maySend,false);assert.equal(out.externalPaymentVerified,false);return out};
test("only fully stated fictional case qualifies for MANUAL draft review",()=>{const r=expectCode({},CODES.READY_DRAFT);assert.equal(r.draftPermitted,true);assert.equal(Object.isFrozen(r),true)});
test("first approval is required",()=>expectCode({approvalOne:false},CODES.APPROVAL_ONE));
test("second approval is required",()=>expectCode({approvalTwo:false},CODES.APPROVAL_TWO));
test("pending payment always holds",()=>expectCode({paymentStatus:"pending"},CODES.NOT_PAID));
test("overdue payment always holds",()=>expectCode({paymentStatus:"overdue"},CODES.NOT_PAID));
test("unknown payment must not be inferred",()=>expectCode({paymentStatus:"unknown"},CODES.UNKNOWN_PAYMENT));
test("refunded payment must block",()=>expectCode({paymentStatus:"refunded"},CODES.REFUNDED));
test("paid string without independent evidence must hold",()=>expectCode({paymentVerified:false},CODES.MISSING_EVIDENCE));
test("duplicate queue state cannot pass",()=>expectCode({alreadyQueued:true},CODES.ALREADY_QUEUED));
test("live mode cannot ever be sent from this module",()=>expectCode({liveMode:true},CODES.NOT_A_LIVE_SENDER));
test("missing fictional stable event reference goes to review",()=>expectCode({eventRef:""},CODES.MISSING_REFERENCE));
test("reject identifiers with spaces or URL-looking payloads",()=>expectCode({caseRef:"https://secret.example/"},CODES.MISSING_REFERENCE));
test("reject truthy strings rather than pretending they are approvals",()=>expectCode({approvalOne:"yes"},CODES.INVALID_INPUT));
test("reject unknown statuses",()=>expectCode({paymentStatus:"paid?"},CODES.INVALID_INPUT));
test("reject private fields such as email and credentials",()=>expectCode({apiKey:"secret"},CODES.INVALID_INPUT));
test("reject malformed nonobjects",()=>{assert.equal(evaluate(null).code,CODES.INVALID_INPUT);assert.equal(evaluate([]).code,CODES.INVALID_INPUT)});
test("payment choices are explicit and frozen",()=>{assert.deepEqual([...PAYMENT],["paid","pending","overdue","refunded","unknown"]);assert.equal(Object.isFrozen(PAYMENT),true)});
test("approval revocation after previous eligible case immediately holds",()=>{
  assert.equal(evaluate(base()).draftPermitted,true);
  assert.equal(evaluate({...base(),approvalTwo:false}).draftPermitted,false);
});
