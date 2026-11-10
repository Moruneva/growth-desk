# Moruneva Sheet Change Preview — Google Sheets editor prototype v0.1

**Status:** working, source-tested Apps Script editor prototype; **not installed, published, approved by Google Workspace Marketplace, market-validated, or monetized**. This is Moruneva's original cross-industry marketplace experiment, distinct from n8n.

## The user job

When a shop operator, content manager, or small-team analyst prepares a second tab of revised records, visually comparing every field is error-prone. Compare **two tabs inside Google Sheets** before changing data. Identify potential clear risks, new/absent rows, changed displayed values, duplicated keys, unmatched rows and changed columns with **row numbers and field names**. No uploaded files or third-party API.

The key header must match exactly in both tabs. A missing proposed row **does not imply a deletion**; the behavior of future imports depends on the target system. This prototype never writes into original/proposed tabs or runs an import.

## Run locally in a spreadsheet (no marketplace install needed)

1. Create a **new spreadsheet containing fictional test data**. Make tabs `Original` and `Proposed`, both with row-1 headers `SKU`, `Price`, `Title`; give each a unique SKU per row.
2. From that spreadsheet use **Extensions → Apps Script**, create files `Core.gs`, `Code.gs`, `Sidebar.html`; paste the corresponding exact files from this folder. If editing the manifest, enable manifest display and replace `appsscript.json` with the file here.
3. Save, reload the spreadsheet, and open **Moruneva · Change Preview → Compare two tabs**. The platform may ask the spreadsheet owner to authorize the project. Select the two tabs and the key header `SKU`, then run Preview.
4. Example: Original has `A | 10 | Tea` and `B | 20 | Book`, Proposed has `A | [blank] | Tea` and `C | 30 | Cup`. Expected findings: `POSSIBLE_CLEAR` for A Price, `ROW_MISSING_IN_PROPOSAL` for B, `ROW_NEW_IN_PROPOSAL` for C. **No change is applied**.
5. This is an *unpublished, individually copied Apps Script prototype*. Making a true user-installable Marketplace listing requires an authenticated Google Workspace developer project, security/OAuth/publishing review and actual in-product verification. No account or merchant identity is inferred from source-code tests.

## Limits and trust boundaries

- Read-only. No network calls or modified cells. Only *displayed values* are compared, not formulas, number formatting, hidden rows, protected ranges, import semantics, or live external system behavior.
- Up to **500 data rows** and **32 columns** per tab. Each batch fails closed on duplicate column names, missing key header or excessive findings.
- The sidebar displays only *row numbers, header names, and classifications*; original values and keys are not returned. Note that field names may themselves be sensitive.
- Duplicate or missing keys are flagged rather than matched. A key such as an email address might be personally identifying: avoid real customer data during this prototype trial.
- For a fair free-alternative comparison, try built-in Sheets conditional formatting, `XLOOKUP` / `VLOOKUP` and a simple filtered view, then time the task and count correct identified differences. If native Sheets suffices, keep this as a free example and stop paid listing plans.
- Company and owner are **Moruneva**. Does not borrow private LoomStacks intellectual property. Source under this folder is intended for review, not production certification.

## Evidence

Run `node --test resources/sheet-change-preview/test.cjs` from the repository root. The test suite uses Node's own test runner and executes the exact `Core.gs` file in an isolated VM. Tests cover row reordering, duplicate keys, missing keys, blank-risk classification, field mismatches, PII omission and fail-closed input limits.

## Next gate

Real Google Sheets Apps Script UI invocation; buyer-side free-method comparison; platform policy and identity review; lawful listing/settlement. **None has passed yet.**
