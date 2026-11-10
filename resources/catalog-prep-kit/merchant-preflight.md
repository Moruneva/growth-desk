# Merchant preflight for bulk product listing

A **review checklist**, not a guaranteed Shopify/WooCommerce import validator or legal advisory.

| Gate | What to check | How to avoid false confidence |
|---|---|---|
| Product ownership | Is this your product or authorized supplier information? | Do not copy competitor images or descriptions |
| Stable identifier | Every product and variation has a unique SKU or platform-approved identifier | Duplicates need human resolution; never silently merge |
| Source facts | Title, material, dimensions, variants, care, shipping constraints and price | If unconfirmed, leave review required |
| Marketing claims | Any safety, health, sustainability, origin, certification, performance, IP/trademark claims | Never infer; need documentation |
| Image rights | Can you use each image commercially? Is it actually accessible to the target store? | "YES" is merchant authorization only; manual network test separately |
| Product image sequence | Main image and alternate views correspond to the exact SKU or variation | Do not mix variant photos |
| Data safety | No customer personal data, passwords, payment information or private client catalog in third-party tools | Use fictional or authorized redacted samples |
| Store-specific mapping | Use the destination store's current exported CSV headers and variant dependencies | This master template is **not an import file** |
| Draft visibility | Keep merchandise as drafts until approved | Import a single staging product and inspect live settings |
| Rollback | Back up data before any bulk update | Confirm how overwrite affects images, inventory and variations |

## Platform differences checked 2026-11-10

**Shopify:** new product CSV currently needs `Title`; updates generally require `URL handle` and `Title`. Variant columns have dependencies. Deleting an Option1 field in the wrong update can damage existing variants. Read [official CSV instructions](https://help.shopify.com/en/manual/products/import-export/using-csv) before mapping.

**WooCommerce:** built-in importer uses a different schema, supports SKU/ID matching and has rules for image URLs and variations. The official docs recommend a backup and small staged import. Read [official importer guide](https://woocommerce.com/document/product-csv-importer-exporter/) before mapping.

**App decision:** Only write a Shopify app or WooCommerce plugin when repeated merchant usage shows that manually copying between files is the material obstacle, existing tools cannot solve it, and a lawful installation, permissions, billing and maintenance path exists. Shopify public apps undergo review; new public apps rely on the GraphQL Admin API. Woo Marketplace requires vendor approval and product review. Platform account approval and commercial terms remain unverified for Moruneva.
