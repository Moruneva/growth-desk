# Creator Content Usage Rights: 10-Minute Preflight

A free, repeatable planning checklist for small marketing and creator teams. Published by [Moruneva](https://moruneva.com), 8 November 2026.

**What this covers:** comparing a documented usage window against a proposed ad schedule, distinguishing organic reuse from paid ads, and identifying where separate creator-handle platform authorization still needs human confirmation.

**What it cannot establish:** that your contract is enforceable; that a creator owns every element in the video; that any TikTok/Meta permission is currently valid; that an ad is lawful or safe to run. Do not treat this sheet as legal clearance.

## Use a spreadsheet first

Create one row per *intended use* of an asset. Keep the source agreement and any private authorization code in a permissioned system; use only harmless references in the planning sheet.

| Field | Example value | What you must verify |
| --- | --- | --- |
| Anonymous item | ITEM-001 | Internally map to the real record, privately |
| Agreed first day | 2026-11-01 | The signed agreement and its interpretation |
| Agreed last day | 2026-11-30 | Whether the last day is inclusive and which time zone applies |
| Planned ad first day | 2026-11-15 | Actual schedule in the platform |
| Planned ad last day | 2026-12-05 | Pauses, extensions, scheduled end |
| Recorded scope | Paid ads from the brand account | Organic, paid brand use and creator-handle use are not interchangeable |
| Intended scope | Paid ads from the brand account | The specific placement and edited asset |
| Platform authorization | Not yet checked | Live account access is separate from a contract |
| Reviewer status | NEEDS_REVIEW | Human checks actual terms, expiry, scope, territories and materials |

### Minimal date formula

In a spreadsheet where `B2` and `C2` are the **actual date values** for recorded start/end, and `D2`/`E2` are proposed start/end:

```text
=IF(OR(B2="",C2="",D2="",E2=""),"REVIEW MISSING DATE",IF(OR(B2>C2,D2>E2,D2<B2,E2>C2),"REVIEW DATE WINDOW","DATES INSIDE RECORDED WINDOW — NOT APPROVAL"))
```

The formula assumes valid spreadsheet date types and compatible time zones. It cannot see licenses, payment status, revocation, territories, exclusivity, edits, likeness rights, music licenses, platform authorization or latest signed amendments.

## Three entirely fictional cases

| Example | Agreed use | Scheduled use | Review question |
| --- | --- | --- | --- |
| A: five days too long | Brand-account paid ads, Nov 1–30 | Brand paid ads, Nov 15–Dec 5 | Does the Dec 5 plan exceed the Nov 30 license? |
| B: platform access missing | Creator-handle paid ads, Nov 1–Dec 31 | Creator-handle ads, Nov 20–Dec 15 | Is the relevant post/account authorization actually valid? |
| C: category mismatch | Organic reposting, Nov 1–Dec 31 | Brand-account paid ads, Nov 20–Dec 15 | Is paid use granted separately from organic reposting? |

For all three, the outcome is **review the real source documents and platform account**. A date inside the recorded window is never permission.

## A free browser-local comparison

Moruneva has a free [Creator Rights Window Checker](https://moruneva.com/creator-rights-window) that runs the same synthetic examples without a login or server upload. Choose **Load three fictional cases** and compare the flags against your own spreadsheet before deciding whether it saves any work.

The companion [step-by-step field guide](https://moruneva.com/creator-usage-rights-guide) explains the cases, remaining blind spots and links to source material. This is an independent planning utility, not an external TikTok or Meta integration, and no customer results are claimed.

A spreadsheet may already be the right solution. If you repeatedly coordinate usage rights among multiple people, which missing human handoff actually costs time? You can [contact Moruneva](mailto:hello@moruneva.com?subject=Voluntary%20creator%20rights%20workflow%20feedback) voluntarily. **Do not email agreements, creator names, authorization codes, private records or screenshots of clients.**

## Official resources to consult

- [Creators Guild of America Foundation — Licensing and Usage Rights](https://creatorsguildofamerica.org/en/foundation/licensing-and-usage-rights): distinguish scope, duration, exclusivity, paid versus organic reuse and expiration clauses.
- [TikTok Ads — About Spark Ads](https://ads.tiktok.com/resources/help/article/spark-ads): creator-post authorization is a separate platform action.
- [TikTok Ads — Create Spark Ads](https://ads.tiktok.com/resources/help/article/how-to-create-spark-ads-for-smart-campaigns-on-tiktok-ads-manager): possible authorization windows. Check the live platform UI and the current instructions.

This public reference contains only fictional dates and categories. It is not a Growth Desk software release, a statement of customer use, or a paid service offer.
