# Shot Handoff Preflight: a fair, five-minute comparison

*A practical, fictional exercise for editors and production coordinators. Updated 18 November 2026.*

## Choose the right existing tool first

A shot handoff and a timeline recut are different questions. Before trying Moruneva, check whether your existing system already answers yours.

| Your actual task | Start with | Why |
| --- | --- | --- |
| Identify clips added, trimmed, moved or split **between two edits** | [PostBase Edit Change List](https://postbase.tv/tools/edit-change-list) | A free, no-account comparison accepting EDL, XML, FCPXML and AAF, with change-list and marker exports. AAF parsing is an explicit server-side exception to its otherwise in-browser workflow. |
| Generate VFX shot names and compare revisions **from an editorial timeline** | [PostBase VFX Shot Manager](https://postbase.tv/tools/vfx-shot-manager) | Supports timeline and marker files, naming templates, shot revisions and exports. |
| Manage shots, versions, submissions and deliveries across a production | [Autodesk Flow Production Tracking guidance](https://help.autodesk.com/cloudhelp/ENU/SG-Tutorials/files/SG_Tutorials_tu_client_side_html.html) | Describes spreadsheet import, Shot/Version records and Deliveries; use the studio's configured workflow when available. |
| Track a manual list of delivery requirements | [Mooiev's free delivery checklist](https://mooiev.com/tools/delivery-checklist) or your spreadsheet | The checklist supports manual tracking and PDF/CSV export. |
| Compare two small **already prepared** expected-vs-delivered shot manifests, without reading timeline or media files | [Moruneva Shot Handoff Preflight](https://moruneva.itch.io/shot-handoff-preflight-moruneva#download) | A free offline HTML experiment for matching shot codes, recorded revisions, frame rate, dimensions, frame count and stated review status. Independent time savings have not been established. |

**Important:** No tool in this table is an authenticated sign-off or complete QC process simply because it displays a clean row. Moruneva does not parse EDL, XML, FCPXML, AAF, video or image sequences, and cannot tell whether an actual file was delivered or accepted.

## An identical fictional handoff for both methods

**Prepared fictional CSV files:** [Expected manifest](../examples/shot-handoff-expected.csv) and [Delivered manifest](../examples/shot-handoff-delivered.csv). Open or save the two files, then import them into separate spreadsheet tabs or paste their text into the corresponding fields of Moruneva's offline file. The same exact CSV rows are printed below for auditability. If your browser displays the CSV as text, save it with the `.csv` extension. The headers must match exactly. These invented shot codes refer to no person, project or real footage.

**Expected manifest — five rows**

```csv
shot_id,revision,fps,width,height,frames
A010,2,24,1920,1080,96
A020,3,24,1920,1080,120
A030,1,24,1920,1080,72
A040,1,24,1920,1080,48
A050,2,24,1920,1080,60
```

**Delivered manifest — five rows**

```csv
shot_id,revision,fps,width,height,frames,review_status
A010,2,24,1920,1080,96,approved
A020,2,24,1920,1080,118,pending
A040,1,24,1920,1080,48,approved
A050,3,25,2048,1080,60,approved
A060,1,24,1920,1080,30,unknown
```

### Answer key under Moruneva's current v1 comparison rules

| Shot code | What a reviewer should find | Scope of the finding |
| --- | --- | --- |
| A010 | Recorded metadata match | The file itself has not been inspected. |
| A020 | Delivered revision older; frame count differs; review status still pending | Three independent review flags on the same shot. |
| A030 | Expected shot is absent from the delivery list | Missing *record*, not independently verified missing media. |
| A040 | Recorded metadata match | The file itself has not been inspected. |
| A050 | Delivered revision newer; frame rate differs; width differs | Newer is not automatically acceptable. |
| A060 | Extra delivered row | An unplanned *record*, which may be a legitimate late addition. |

For the six distinct shot codes in these two lists, the v1 decision rules imply **2 metadata-matched rows**, **4 rows needing review**, **1 missing expected row** and **1 extra delivered row**. This is a reproducible answer key based on the published code's decision rules, not an independent editor outcome.

**Reproducible code check (18 November 2026):** The exact two CSV blocks above were executed through the published v1 parser and comparison core. A dependency-free [regression test](https://github.com/Moruneva/growth-desk/blob/main/tests/shot-handoff-comparison-guide.test.cjs) verifies the two published CSV files match the guide verbatim, then checks all six shot-flag sets, the four totals, the export and six rejected invalid-input cases. It passed locally against files with Git blob hashes identical to those on `main` at the time of the check. To repeat after cloning the repository, run `node tests/shot-handoff-comparison-guide.test.cjs`. This is software-contract evidence, **not** an independent workflow benchmark, customer acceptance or delivery certification.

## Compare the free spreadsheet fairly

1. Duplicate the fictional data into two tabs named `Expected` and `Delivered`. Start the timer **after** the data is already present; do the same in Moruneva.
2. In `Expected`, check whether each code exists in `Delivered` using a filter, lookup or an ordinary formula such as `=COUNTIF(Delivered!A$2:A$6,A2)`. Compare the revision and recorded technical columns for codes found on both sides.
3. In `Delivered`, reverse the lookup to identify codes absent from `Expected`, for example `=COUNTIF(Expected!A$2:A$6,A2)`.
4. Stop the timer when you can name the **four codes requiring review and their reasons**. Repeat with Moruneva's `Check handoff` button, starting after the same two blocks are pasted.
5. Note which method was clearer, which took less time, whether the CSV review report was useful, and whether you would actually prefer your established workflow. There is no target winning time.

A spreadsheet with reusable formulas, established templates or macros may easily win. That answer matters: the point of this experiment is to discover whether the extra utility adds real value in the user's normal workflow.

## Limits that prevent false confidence

- These inputs are fictional, deliberately tiny and omit client names, actual media, private filenames and credentials.
- The Moruneva preview accepts up to 80 codes per side and only its documented CSV/TSV/JSON fields. It does not import a native editorial timeline or authenticate anyone's approval.
- Recorded `review_status=approved` is merely supplied text, not an approval from a production system.
- A match says the **supplied metadata** matches. You must separately check the files, codecs, frame continuity, naming rules, signatures and actual delivery.
- Human-completed self-reports are exploratory evidence; this fixed example does not show that the utility is faster on real productions, and no external first use, repeat use, buyer or paid outcome has been independently verified.

## Tell us where it failed

[Return to the voluntary trial discussion](https://github.com/Moruneva/growth-desk/issues/6) or email a short **non-identifying** note to `hello@moruneva.com` with the subject `Shot Handoff Offline Trial`.

Please report (1) whether you could open the free file and export the result, (2) the same-input comparison against your usual free method, and (3) the first reason you would **not** use it on a real job. Do not send actual manifests, customer records, exports or footage.

## Primary reference pages checked

- [PostBase, Edit Change List](https://postbase.tv/tools/edit-change-list) — feature list, formats, browser/AAF processing caveat.
- [PostBase, VFX Shot Manager](https://postbase.tv/tools/vfx-shot-manager) — shot naming and cut-revision scope.
- [Autodesk, Managing Client-side Productions](https://help.autodesk.com/cloudhelp/ENU/SG-Tutorials/files/SG_Tutorials_tu_client_side_html.html) — editorial turnover, delivered files and spreadsheet workflows.
- [Mooiev, Video Delivery Checklist](https://mooiev.com/tools/delivery-checklist) — manual checklist and exports.
- [Moruneva's published offline source](https://github.com/Moruneva/growth-desk/blob/main/offline/shot-handoff-preflight-offline.html) — accepted fields, comparisons, thresholds and report contract.

*Published by Moruneva as a free, reversible research artifact. No paid purchase, media transfer or account connection is required.*
