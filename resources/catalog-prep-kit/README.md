# Catalog Prep Kit — a demand-led merchant trial

**Status (2026-11-10):** Original trial-grade digital product sample. Source, CSV templates, reusable AI skill and offline checks are available. **No paying merchant, sale, supported production integration, live store install, Shopify App Store listing or Woo Marketplace approval has been verified.**

### Who it is for

A solo or small online merchant who already has authoritative product specifications but repeatedly cleans supplier information, writes product copy and checks image references before publishing. The merchant controls final approval and any import.

**One narrow job:** turn already-verified product facts into a *review sheet* for listing preparation, while flagging missing photos, possible unsupported claims and missing product identifiers. This kit does **not** generate true product measurements, create images, check remote image HTTP status, push catalog changes, or synchronize Shopify/WooCommerce.

### What is included

| File | Purpose |
| --- | --- |
| `SKILL.md` | Human/agent-readable reusable workflow: proof-preserving product-copy drafts and import readiness review |
| `product-master-template.csv` | Spreadsheet template; intentionally **not a Shopify/WooCommerce import CSV** |
| `fictional-input.csv` | Two small completely invented shop items to rehearse the workflow |
| `fictional-review-output.csv` | Worked output retaining uncertainty and human review gates |
| `merchant-preflight.md` | Checklist for SKU, product facts, image rights and safe staging |
| `evidence-and-pivot.md` | Original forum-demand links, free alternatives, questions for merchants and criteria for template/Skill → native app |
| `test.cjs` | Offline source/package integrity checks (not merchant, sales, or marketplace acceptance) |

### Five-minute trial

1. Open `fictional-input.csv` and `fictional-review-output.csv` side by side. Use only the sample data, not a real shop’s customer data.
2. Read `SKILL.md` and run its **REVIEW** instructions with an AI assistant; feed it the fictional input and request an output that follows the output CSV.
3. Replace one sample record in a *local copy* of the template with **merchant-approved** facts and request a **DRAFT**. Check unsupported statements and missing image rights before copying any copy into an actual store.
4. Compare with free Shopify Magic/built-in CSV export and WooCommerce native CSV importer plus your existing spreadsheet. Did this package catch a missed gap or reduce review time?
5. Tell us the outcome: [hello@moruneva.com](mailto:hello@moruneva.com?subject=Catalog%20Prep%20Kit%20merchant%20trial). A short problem description is enough; **do not send credentials, private files, or customer records**.

### Output boundaries

This is a review aid, not a finished import file. Shopify's product CSV has exact current field requirements and dependencies between variant fields. WooCommerce's native importer has a different schema and may fail to fetch remote images. To import real records: start with an official **export from the destination store**, compare the destination's current CSV specification, map only approved columns, make a backup and test one draft product in staging. Do not upload this kit's `product-master-template.csv` directly.

Official documentation:
- [Shopify product CSV columns and data dependencies](https://help.shopify.com/en/manual/products/import-export/using-csv)
- [WooCommerce product CSV importer, images, schema and staged testing](https://woocommerce.com/document/product-csv-importer-exporter/)
- [Shopify app store quality / platform requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)
- [Woo Marketplace partner requirements](https://developer.woocommerce.com/docs/woo-marketplace/submitting-your-product)

**Business gate:** make a paid version or native Shopify/WooCommerce app only after merchants describe a recurring problem and demonstrate the provided free method is insufficient. No subscription/pricing or operational selling account is claimed.
