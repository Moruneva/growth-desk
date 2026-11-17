# A paid order and a delivered file are two different records

*Moruneva field guide · Digital goods · 17 November 2026*

A creator can have a valid-looking payment list and still have an unanswered delivery question. That matters when the payment platform, download service, and email or license handoff are separate systems. It is tempting to merge everything into one column called **Done**. That column hides the distinction between what the merchant system knows and what the delivery system records.

This guide describes a small **manual record comparison**. It is not payment verification, a financial report, an access-rights determination, or advice to fulfill or revoke any order.

## 1. First use the free records you already have

PayPal provides an Activity Download report with configurable fields and a CSV export. Its documented fields include `Transaction ID`, `Status`, `Gross`, `Fee`, `Net`, `Currency`, and a transaction `Type`. The report is an appropriate *merchant-side starting point*, subject to the account, transaction type, reporting period, and local format. It does not itself say whether a customer successfully obtained a file or a working license.

Your fulfillment system needs its own evidence. Decide what “delivered” means for the product: granting a permission, sending a license, making a download available, or confirming successful access are different events. Keep that definition explicit. An email-sent record alone is a weak proxy for successful access.

An order reference can link the two systems, but only if the relationship is recorded at the time of fulfillment or otherwise independently verified. Matching the same customer name, similar amount, or nearby timestamp is insufficient.

### What the columns mean — and do not mean

| Claim | Possible source | What it does **not** establish |
| --- | --- | --- |
| The payer clicked a checkout button | Buyer-facing checkout | A completed payment |
| A merchant-side transaction is marked completed | Authenticated provider account/report | Successful file access or an absence of later reversals |
| A license or link was issued | Authorized delivery log | The buyer could use it |
| The buyer accessed the item | Delivery/access log | Ongoing entitlement, refund resolution, or full legal compliance |

The exact strength of each record depends on the system generating it. Keep the original source record available to an authorized operator.

## 2. Do not paste a raw PayPal export into a simplified checker

The [free Moruneva offline preview](../offline/digital-delivery-crosscheck-offline.html) intentionally takes two **manually normalized, fictional** CSV lists. It **does not import a raw PayPal Activity Download CSV**, authenticate an account, or understand all merchant event types. Here is the conceptual mapping an authorized operator would have to review before any future real-world integration:

| PayPal Activity Download field | Simplified research field | Important review question |
| --- | --- | --- |
| `Transaction ID` | `transaction_id` | Does the delivery system store this exact reference, or a different order ID? |
| `Status`, together with `Type` and related events | `status` | Is the entry a sale, reversal, refund, adjustment, or a separate event? Never collapse unlike events automatically. |
| `Gross` | `amount` | Is the comparison based on the actual gross transaction rather than `Net` after fees, tax, or item-level amounts? |
| `Currency` | `currency` | Is the currency recorded explicitly and consistently? |
| *No universal delivery field* | `delivery_id`, `delivery_status` | What authorized fulfillment record independently supports this claim? |

PayPal reports have more columns, localized monetary formats, varying transaction types, and related transactions. **The table is a research translation checklist, not a verified conversion specification.** Do not delete or overwrite original records during normalization. Do not infer that a refund is represented solely by one `Status` cell.

## 3. A fictional three-order exercise

This is invented data, **not a PayPal export**:

**Manually simplified merchant records**

```csv
transaction_id,status,amount,currency
EXAMPLE-101,completed,299,TWD
EXAMPLE-102,pending,499,TWD
EXAMPLE-103,completed,200,TWD
```

**Independently simplified delivery records**

```csv
transaction_id,delivery_id,delivery_status,amount,currency
EXAMPLE-101,ACCESS-101,delivered,299,TWD
EXAMPLE-102,ACCESS-102,delivered,499,TWD
EXAMPLE-104,ACCESS-104,delivered,200,TWD
```

This produces different questions:

1. `EXAMPLE-101`: both typed records agree. That only establishes **internal consistency**, not verified payment or usable access.
2. `EXAMPLE-102`: delivery is recorded while the merchant-side status is pending. An authorized operator should verify the *actual* provider state before taking action.
3. `EXAMPLE-103`: the merchant list has no corresponding delivery row. Confirm whether entitlement was granted elsewhere before declaring a failure.
4. `EXAMPLE-104`: delivery has no matching entry in the provided merchant list. The payment export might be incomplete or the identifiers might differ; do not presume nonpayment.

Duplicates, currency mismatches, partial releases, refunds, valid resends, and incomplete exports require their own human review. Never use a match or mismatch alone to grant, block, revoke, or refund access.

## 4. The zero-cost spreadsheet alternative

For a low-volume digital seller, a private spreadsheet plus the processor’s authenticated report may be sufficient. If payment identifiers are in column `A` of a `Payments` sheet and delivery identifiers are in column `A` of a `Deliveries` sheet, a simple existence check can start with:

```excel
=COUNTIF(Deliveries!A:A,A2)
```

To look up a delivery status stored in column `C`:

```excel
=XLOOKUP(A2,Deliveries!A:A,Deliveries!C:C,"NO MATCH",0)
```

These formulas are **only record lookups**. Check duplicate identifiers before trusting any first-match result. Do not use the returned text to authorize fulfillment. Google documents both [COUNTIF](https://support.google.com/docs/answer/3093480) and [XLOOKUP](https://support.google.com/docs/answer/12405947); most sellers should try these free options before adding another tool.

The offline Moruneva preview may be useful when a reviewer needs several discrepancy categories together and a **portable CSV review queue**. Every exported finding is explicitly marked `UNVERIFIED_RECORDS_ONLY`. If a familiar filter or lookup is faster and sufficient, that is a valid reason **not to adopt our tool**.

## 5. What a future connected product would require

A production system cannot safely trust a local CSV status typed by a browser user. An authorized payment integration would need server-side provider verification, carefully scoped credentials, verified webhook signatures, duplicate-event handling, and reconciliation with the merchant’s own state. The delivery or entitlement system would still require its own authenticated records and explicit business rules for retries, access rights, disputes, and refunds.

In PayPal’s documented supported checkout integration, a pending capture is **not** a signal to fulfill; the completed capture event is the relevant successful event. That documentation does **not** establish that the same webhook flow is enabled for every no-code payment link or account. Integration eligibility and behavior require a separate account-specific test.

Moruneva’s present tool implements none of this connected functionality. It neither takes a payment nor confirms a purchase. It cannot certify tax, consumer-rights, or data-protection compliance.

## 6. The research question that decides whether we keep building

We want to learn whether an independent operator regularly spends enough time comparing *separate* authorized payment and delivery records for a portable review queue to matter. Our simplest test is:

- Can you open the [single-file offline preview](../offline/digital-delivery-crosscheck-offline.html), load its **invented** example, and download a review report?
- Can you do the same comparison faster or more accurately with your usual **free spreadsheet or merchant-native report**?
- What exactly caused friction: getting records, normalizing columns, matching identifiers, interpreting discrepancies, or communicating review decisions?

Share a **non-identifying observation only** in the [voluntary trial discussion](https://github.com/Moruneva/growth-desk/issues/7). Use fictional data for the trial; do not upload customer data, actual transaction IDs, payment exports, credentials, private order records, or generated review reports. An honest “my spreadsheet was better” is useful evidence. There is no paid product or verified customer use yet.

### Primary references

- [PayPal Developer — Activity Download report](https://developer.paypal.com/reports/activity-download/) (merchant CSV structure and status/type distinctions; updated 2 July 2026).
- [PayPal Developer — Subscribe to checkout webhooks](https://developer.paypal.com/payment-methods/webhooks/) (supported alternative-payment flow, pending/completed/denied handling; updated 14 October 2026).
- [PayPal Developer — Integrate webhooks](https://developer.paypal.com/api/rest/webhooks/rest/) (signature and event implementation reference).
- [Google Docs Editors Help — COUNTIF](https://support.google.com/docs/answer/3093480) and [XLOOKUP](https://support.google.com/docs/answer/12405947) (free spreadsheet functions).

*Research boundary: this guide uses provider documentation and fictional examples. No independent seller interview, verified product trial, paid order, or payment-provider integration has been established for this Moruneva experiment.*
