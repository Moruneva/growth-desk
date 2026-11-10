# Demand evidence & reversible decision

**Date:** 2026-11-10. **Status:** problem evidence exists; buyer willingness-to-pay is **unknown**. Moruneva has no verified paid catalog-kit customer. Never claim these public posters are our users.

## Public non-Reddit problems actually checked

| Source | Observed job | Why a lightweight pack may help | Limits |
|---|---|---|---|
| [WooCommerce / WordPress forum: importer missing multiple images](https://wordpress.org/support/topic/csv-importer-not-adding-multiple-images/) | Merchant says bulk CSV imports only the first of several images | Preflight image count/rights and human inspection in staging | The problem may be importer or host behavior; a template cannot fix server-side image imports |
| [WooCommerce / WordPress forum: images not showing](https://wordpress.org/support/topic/product-images-not-showing-24/) | Products and images do not appear after CSV import | Check remote URL and platform rules before bulk import | Cannot prove a URL works without a real HTTP test |
| [WooCommerce / WordPress forum: import stopped](https://wordpress.org/support/topic/the-import-has-stopped/) | Large product CSV with remote images causes costly downloads / failed import | Staging, batching, document causes and exclusions | Core/plugin patches may already fix this issue; no proof merchants want a separate product |

**Current built-in alternatives checked:** [Shopify official CSV and variant dependencies](https://help.shopify.com/en/manual/products/import-export/using-csv); [WooCommerce official product CSV importer](https://woocommerce.com/document/product-csv-importer-exporter/). Existing free features may fully solve needs.

## Interview questions for actual merchants (ask only where permitted)
1. How many SKU/variations and image sources do you process in a normal week?
2. What precise step last failed? Which error, cost or time loss was involved?
3. Which free importer / spreadsheet / AI product are you using? What remains unsolved?
4. Would a reusable CSV/AI skill used outside the shop solve it, or do you require a native backend button?
5. Would you pay for a specific accepted result? Who signs off on a purchase and what is the budget?
6. Could you try a fully fictional example, share only non-sensitive issue descriptions and permit a public evidence-based follow-up?

## Lean gates, not automatic development
- **G0 Demand:** at least two independent, real public problems with links (passed as problem evidence; not market demand size).
- **G1 Offer:** clear value proposition and free alternative comparison (sample kit exists).
- **G2 Trial:** a real willing merchant uses the kit on authorized data; record time, missed errors and feedback (**not yet**).
- **G3 Buying signal:** a buyer with purchase authority requests a quote / preorders or commits real funds (**not yet**).
- **G4 Native app pivot:** same workflow gap repeats after G2; merchant specifically needs a platform-native action and can pay enough to cover support, API permissions and review (**not yet**).
- **G5 Sale:** approved payment and actual confirmed settlement (**not yet**).

**Stop/pivot rule:** If the free Shopify or WooCommerce importer plus Sheets meets all genuine needs, retain this as a free resource. If merchants need reliable image downloads or variant updates, gather failure-specific test cases and only then evaluate an original WooCommerce plugin or Shopify admin extension. Do not code an app solely because forums have complaints.
