# M Ashraf Shoes — Complete Handoff Guide for AI Tools

You are now the developer for the M Ashraf Shoes e-commerce website.
This file is your complete operating manual. Read it fully before doing ANY task.

---

## 1. WHAT THIS SITE IS

A simple, single-repo, no-build website for selling shoes in Pakistan.

- **Hosting:** GitHub Pages (repo `mashraf-shoes-website`, branch `main`, live at `mashrafshoes.store`)
- **Payments:** Cash on Delivery only (no payment gateway)
- **Cart:** Browser `localStorage` — no account needed
- **Login:** Optional — Supabase (email/password + Google). Logged-in users get their cart synced to their email across devices.
- **Orders:** WhatsApp to the shop owner (not a real backend)
- **Supabase:** only used for login + catalog merging + cart sync. NOT required for the site to work.

### ALL FILES (15 HTML pages + 5 JS + images)

| File | Purpose |
|---|---|
| `index.html` | Homepage — product grid, loads all products |
| `deals.html` | Deals page — same grid, sale items |
| `product-page.html` | Product page for **product ID 1** (Diamante Strap Sandals) |
| `product-braided-sandals.html` | Product ID 2 |
| `product-kare-embellished-sandals.html` | Product ID 3 |
| `product-perforated-cross-strap-sandals.html` | Product ID 4 |
| `product-peshawari-chappal.html` | Product ID 5 |
| `product-premium-loafers.html` | Product ID 6 |
| `product-mens-horsebit-buckle-loafers.html` | Product ID 8 |
| `product-black-horsebit-tassel-loafers.html` | Product ID 9 |
| `product-mens-brown-casual-chappal.html` | Product ID 10 |
| `product-faux-fur-slide-sandals.html` | Product ID 11 |
| `cart.html`, `checkout.html`, `order-confirmed.html` | Purchase flow |
| `account.html`, `login.html`, `signup.html`, `track-order.html` | Accounts + order tracking |
| `products.js` | **THE SOURCE OF TRUTH** for all product data |
| `cart.js` | Shared cart logic |
| `supabase.js` | Supabase client + catalog merge |
| `supabase-config.js` | Supabase URL + anon key |
| `sitemap.xml` | SEO sitemap — update when products change |
| `images/` | Product photos |

---

## 2. THE #1 RULE: `products.js` IS THE SOURCE OF TRUTH

This was a hard-won fix. A previous developer broke the site by having Supabase
REPLACE `window.products`. The correct behavior (already implemented in
`supabase.js`):

- `products.js` defines the full static catalog (currently 23 products).
- `supabase.js` `mergeProducts()` merges the database on top — the DB wins only
  for matching product `id`s, static-only products are KEPT.
- **DO NOT** change this. `products.js` entries must keep `id`, `name`,
  `category`, `price`, `oldPrice`, `rating`, `ratingCount`, `badge`, `material`,
  `whatsappNumber`, `pageUrl`, `deliveryCharge`, `description`, `seoTitle`,
  `seoDescription`, `seoKeywords`, and `variants[]`.

### How to add a NEW product (the ONLY correct way)

1. Add photos to `images/` first. **File name rules are CRITICAL — see section 3.**
2. Append a new object to the `var products = [...]` array in `products.js`.
   - Give it the next free `id` (currently 19).
   - `pageUrl` must match the product page filename exactly, minus the `.html` suffix.
3. Create the product page HTML. The EASIEST correct method:
   - Copy the newest product page (`product-faux-fur-slide-sandals.html`).
   - Search-replace the product name, images, colors, prices, and the line
     `const PRODUCT_ID = 11;` to your new id.
   - Keep the `<script>` order at the bottom:
     `supabase-config.js` → `supabase.js` → `cart.js` → `products.js`
     (in that order — DO NOT reorder, DO NOT drop any).
   - Keep the mobile swatch fix (section 4).
   - Add a FAQ section (class `faq`, `<details class="faq-item">`) before
     `</main>` with the most common buyer questions (COD, delivery time,
     colors/sizes, material, ordering via WhatsApp, exchange policy) —
     customers search these, so they help SEO.
4. Add the new page URL to `sitemap.xml`.
5. Do NOT edit Supabase to add products. products.js is enough.
### How to edit an existing product

- Change text/price/images in `products.js` only. The product page reads from
  `products.js` by `id`, so text changes flow automatically.
- If you change a product's `pageUrl` or image filenames, update the page HTML
  too (canonical/OG/JSON-LD tags) — otherwise you get dead links.

### URL convention (IMPORTANT — SEO)

- All internal links, canonicals, OG URLs, and `sitemap.xml` entries use
  **extensionless** URLs (e.g. `/product-braided-sandals`, NOT `.html`).
  Cloudflare clean-URL redirects every `.html` URL (307) to the extensionless
  form; `.html` URLs were the suspected cause of weak Google indexing.
- When adding a page, link to it WITHOUT the `.html` suffix everywhere.
- `rjdU8_relwac.html` is an admin page kept `noindex` on purpose.

### Category pages (long-tail keyword hubs)

- 6 category pages exist: `category-khussa.html`, `category-chappal.html`,
  `category-sandals.html`, `category-slippers.html`, `category-loafers.html`,
  `category-bridal-sandals.html`. Each targets a long-tail phrase like
  "Khussa Online in Pakistan" (Hush Puppies owns the head term; we win the
  niches).
- They use `CollectionPage` + `ItemList` JSON-LD, an FAQ section, and link to
  their products. Generator: `scripts/gen_categories.py`.
- Every product page has a breadcrumb back to its category page. Keep this
  bidirectional linking when adding products — it is what lets Google find
  both the product and its category.
- When adding a NEW category: create the page (copy generator pattern), add
  it to `sitemap.xml`, link it from homepage footer, `sitemap.html`, deals
  footer, and the `<noscript>` block in `index.html`.

---

## 3. IMAGE FILE NAMING — the biggest source of past bugs

Every image lives in `images/`. The filename written in code MUST match the
file on disk **exactly** — including extension.

### Naming convention

```
<product-slug>-<color>-pakistan-<number>.<ext>
```

Example for product ID 1 (Diamante Strap Sandals), black:
`images/diamante-strap-sandals-black-pakistan-1.jpeg`

### Extension rules (this bit everyone — read carefully)

- The site uses `.jpeg` for most images, `.jpg` for the premium loafers.
- **The extension in the code must equal the extension of the uploaded file.**
  If the file is `.jpeg`, code must say `.jpeg`. If `.jpg`, code must say `.jpg`.
- Do NOT mix them. A mismatch = broken image with no error message.
- The owner uploads photos manually. After they upload, VERIFY each referenced
  image exists with the exact name. (See section 7 for the check script.)

### Known historical mistakes — DO NOT repeat

1. Image extensions wrong in code vs actual files (`.jpg` vs `.jpeg`) — fixed
   for product 7 by switching code to `.jpeg`.
2. A filename containing a space: `images/diamante-strap-sandals-maroon-pakistan 2.jpeg`
   — already referenced correctly in `product-page.html`; preserve the space
   exactly.
3. Broken image refs: `product-premium-loafers.html` used `.jpeg` when files
   were `.jpg` — fixed.
4. HEIC files: the Supabase DB had `image.jpeg.heic` suffixes (unrenderable in
   browsers). `supabase.js` `rowToProduct()` strips a `.heic` suffix as a safety
   net. Never upload `.heic` — convert to `.jpeg`/`.jpg` first.
5. Adding products to `products.js` WITHOUT creating the page or uploading
   images — this created a 404 product. ALWAYS do images → products.js → page →
   sitemap in order.
6. Orphan pages: `product-black-horsebit-tassel-loafers.html` was dead (wrong
   id, no products.js entry). Now fixed as product ID 9.
7. Duplicate products: product ID 7 "Men's Horsebit Loafers" was the SAME
   product as ID 8 "Men's Horsebit Buckle Loafers" — ID 7 was removed entirely
   (page deleted, sitemap entry removed). Never create duplicate products.
    **2026-09-02: ID 7 was reused for a NEW product "Colorful Embroidered Kids
    Khussa for Girls" (kids khussa, page
    `product-colorful-embroidered-kids-khussa-for-girls.html`). DEPLOYED LIVE
    2026-09-03. Owner uploaded the real photos (photos `...-1.jpeg`,
    `...-2.jpeg` and `...-anatomy.png` — note the anatomy image is `.png`, not
    `.jpeg`); product page + products.js both reference the `.png`. Verify all 3
    images return 200 after any future re-upload. `...-anatomy.png` is 1.9 MB —
    compress it (ideally <300 KB) for LCP. Site ID-7 numbering note: never reuse
    a freed ID for a different product without documenting it like this.
8. Product cards linking to `/undefined?color=...`: caused when the Supabase DB
   row for a matching product id had a NULL `page_url`, which wiped out the
   static pageUrl in `mergeProducts()`. Fixed in `supabase.js` — the merge now
   overlays DB fields but PRESERVES the static `pageUrl`. Never let a DB row
   delete the static pageUrl.

---

## 4. MOBILE SWATCH FIX (mandatory on every product page)

On mobile, color swatches must appear directly BELOW the product photo.

Every product page's `<style>` must contain this inside its
`@media (max-width:760px)` block:

```css
.info {
  display: flex;
  flex-direction: column;
}
.info .swatch-section {
  order: -1;
}
```

Note: whitespace can vary (some pages use `max-width:760px`, the peshawari page
uses `max-width: 760px`). The `.info .swatch-section { order: -1; }` line is the
part that matters. All 9 product pages currently have it. Keep it on any new page.

---

## 5. JS SCRIPT ORDER (mandatory on every page that uses cart/login)

At the bottom of the body, scripts must load in EXACTLY this order:

```html
<script src="supabase-config.js"></script>
<script src="supabase.js"></script>
<script src="cart.js"></script>
<script src="products.js"></script>
```

- `supabase.js` exposes `window.SupabaseStore`. Its `getClient()` is ASYNC —
  always `await getClient()` or `.then()`, never use it synchronously.
- `cart.js`'s `currentUserEmail()` is now async (returns a Promise) — callers
  must await it.
- Every product page MUST load `supabase.js` so logged-in carts sync from that
  page. (This was missing before — product pages originally only loaded
  `cart.js` + `products.js`.)
- `order-confirmed.html` needs no scripts. `track-order.html` needs no Supabase.

---

## 6. DESIGN SYSTEM (match this exactly on every page)

- Warm paper background: `#FBFAF7`
- Emerald accent: `#1B5E43`, dark variant `#14432F`
- Ink text: `#1A1A18`
- Headings: Georgia serif (class `.tag-font`)
- Body: system sans-serif stack
- Pill buttons, glass sticky headers (`backdrop-filter: blur(12px)`)
- Mobile-first grids; product cards: 2-col mobile / 3-col tablet / 4-col desktop
- All buttons/tap targets >= 44px
- Do NOT add emojis, do NOT add laces/scroll-tie animations (removed on purpose)

---

## 7. VERIFICATION — ALWAYS RUN THESE BEFORE PUSHING

Run every time you change products, pages, or images:

```bash
# 1. All products.js page files exist
python3 -c "
import re, os
t = open('products.js', encoding='utf-8').read()
for u in re.findall(r'pageUrl:\s*\"([^\"]+)\"', t):
    print(('OK  ' if os.path.exists(u) else 'MISSING ') + u)
"

# 2. All image references resolve on disk
python3 -c "
import re, os, glob
refs = set()
for f in glob.glob('*.html') + glob.glob('*.js'):
    t = open(f, encoding='utf-8', errors='ignore').read()
    refs.update(re.findall(r'[\"\'](images/[^\"\']+\.(?:jpeg|jpg|png|webp))', t))
    refs.update(re.findall(r'src=\"(images/[^\"\']+\.(?:jpeg|jpg|png|webp))', t))
missing = sorted([r for r in refs if not os.path.exists(r)])
print('Unique refs:', len(refs))
print('MISSING:', missing if missing else 'NONE')
"

# 3. All internal HTML links resolve
python3 -c "
import re, os
for f in sorted(x for x in os.listdir('.') if x.endswith('.html')):
    t = open(f, encoding='utf-8', errors='ignore').read()
    broken = [l for l in set(re.findall(r'href=\"([a-zA-Z0-9\-_\.]+\.html)', t)) if not os.path.exists(l)]
    if broken: print(f, 'BROKEN:', broken)
print('done')
"

# 4. JS syntax (external files + inline blocks)
for f in *.js; do node --check "$f" || echo "SYNTAX FAIL: $f"; done

# 5. Sitemap URLs all have pages
grep -o '<loc>[^<]*</loc>' sitemap.xml | sed 's/.*store\///;s/<\/loc>//;s/<loc>//' | while read u; do
  [ -z "$u" ] && continue
  [ -f "$u" ] || echo "SITEMAP MISSING: $u"
done
echo "sitemap check done"
```

Commit with a clear message (past style examples):

```
feat: add product X
fix: broken image link
perf: compress images
```

---

## 8. IMAGE COMPRESSION (before finalizing a new product)

Product photos should be under ~150KB. If you receive large photos, compress
them (Python PIL available):

```python
from PIL import Image
import glob
for f in glob.glob('images/*'):
    try:
        im = Image.open(f)
        im.thumbnail((1200, 1200))
        im.convert('RGB').save(f, 'JPEG', quality=82, optimize=True, progressive=True)
        print('ok', f)
    except Exception as e:
        print('skip', f, e)
```

---

## 9. WHAT TO DO WHEN THE OWNER UPLOADS NEW PRODUCTS

### 9a. MANDATORY RULE — NEVER LOSE SEO / TRUST / INDEXING

**Products are permanent. Every addition MUST pass the full checklist below.
Speed is not an excuse. A product that is added but unindexable, un-schemed,
or with dead links costs the store trust and search visibility — treat that
as worse than not adding it at all.**

The checklist below (9b–9h) is the ONLY correct order. Run every step, then
run all of section 7 verification before pushing. Never skip, never reorder.

### 9b. GATHER & VERIFY (do not skip the verify step)

1. Ask for: product name, price, old price (if sale), badge (Sale/New), sizes,
   colors, photos.
2. **OWNER PREFERENCE: the AI handles photo uploads directly.** Do NOT ask the
   owner to upload, rename, or git-push photos. When the owner provides photos,
   the AI brings them into `images/` itself (downloads/fetches them if given a
   link, or pulls them in via git), names them correctly, and commits + pushes
   everything in one go.
3. Put photos in `images/` with correct names (section 3).
4. Compress them (section 8).
5. Add the object to `products.js` with the next free id.

### 9c. ADD THE PRODUCT OBJECT (products.js)

- Next free `id`, unique `name`, real `price`, `oldPrice` only if a real sale.
- `pageUrl` = filename **without** the `.html` suffix (see URL convention in
  section 2).
- `seoKeywords`: include Pakistan terms + a Karachi/Lahore/Islamabad geo term,
  e.g. `"shoes online Karachi"`. Match the product type (`khussa`, `chappal`,
  `sandal`, `loafer`, `slipper`).
- `image` array: names must match files on disk EXACTLY (section 3).

### 9d. CREATE THE PRODUCT PAGE

- Copy the newest product page → rename → fix `PRODUCT_ID` → fix images →
  keep script order (section 5) + mobile swatch fix (section 4).
- SEO tags on the new page MUST be unique and correct:
  - `<title>` = product + "online in Pakistan" + COD.
  - `<meta name="description">` = colors, sizes, COD, "order directly online".
  - `<meta name="keywords">` = product terms + city terms (Karachi/Lahore/
    Islamabad).
  - `<link rel="canonical">` = the extensionless URL (no `.html`).
  - `og:title`, `og:description`, `og:url` (extensionless), `og:image` =
    first product image (absolute URL).
  - JSON-LD `Product` schema: name, description, `image` array (absolute URLs),
    `offers` with PKR price + `availability`, `aggregateRating`/`review`,
    `shippingDetails`, `hasMerchantReturnPolicy`. Copy an existing page's
    schema block and edit fields — do NOT write it from scratch.
  - `areaServed`/`address` country PK where applicable.

### 9e. WIRE THE PAGE IN (so it can be FOUND — indexing depends on this)

- Add the new page URL (extensionless) to `sitemap.xml`.
- Link the new page from at least one crawlable page (homepage "All Products"
  list, `sitemap.html`, and/or the `<noscript>` block on `index.html`).
- Verify `robots.txt` allows it (it does: `Allow: /`).
- Never leave a product page as an orphan with no internal links and no
  sitemap entry — orphan pages do not get indexed.

### 9f. NOINDEX ADMIN PAGES ONLY

- `rjdU8_relwac.html` is the only intentionally-noindexed page. Never add
  `noindex` to any product page, and never remove it from the admin page.

### 9g. EXTENSIONLESS URL RULE (indexing-critical)

- ALL links, canonicals, OG URLs, sitemap entries, and `products.js` `pageUrl`
  use extensionless URLs. Cloudflare 307-redirects every `.html` URL, and
  307-redirected URLs were the suspected cause of weak Google indexing.
- After adding a page, curl-check the live extensionless URL returns 200.

### 9h. VERIFY, THEN PUSH (same as section 7)

1. `node --check products.js` — JS parse OK.
2. Validate every JSON-LD block parses (python3 json check).
3. Validate `sitemap.xml` is well-formed XML and contains the new URL.
4. Grep the new page for: correct `PRODUCT_ID`, no template leftovers, image
   filenames that actually exist in `images/`, no `noindex`, no `.html` links.
5. Confirm no `.html` suffix anywhere in links/canonicals/sitemap.
6. Push. GitHub Pages auto-deploys in ~2 min, then curl the live URL → expect
   200.

**Rule of thumb: if a step is uncertain, STOP and fix it. Never ship a product
with missing images, a broken link, a 307'd canonical, or no sitemap entry.**

---

## 10. CURRENT PRODUCTS (as of handoff)

| id | name | page | price | images | sizes |
|---|---|---|---|---|---|
| 1 | Diamante Strap Sandals | product-page.html | 1799 | 11 | 36-40 |
| 2 | Braided Toe-Ring Sandals | product-braided-sandals.html | 1899 | 12 | 36-40 |
| 3 | KARE Women's Embellished Flat Sandals | product-kare-embellished-sandals.html | 1999 | 9 | 6-9 |
| 4 | Men's Perforated Cross-Strap Casual Sandals | product-perforated-cross-strap-sandals.html | 2299 | ? | ? |
| 5 | Men's Peshawari Chappal | product-peshawari-chappal.html | 999 | ? | ? |
| 6 | Men's Premium Luxury-Style Loafers | product-premium-loafers.html | 2499 | 6 | 41-44 |
| 8 | Men's Horsebit Buckle Loafers | product-mens-horsebit-buckle-loafers.html | 2499 | 4 | 41-44 |
| 9 | Men's Black Horsebit Tassel Loafers | product-black-horsebit-tassel-loafers.html | 2499 | 2 | 41-44 |
| 10 | Men's Brown Casual Chappal | product-mens-brown-casual-chappal.html | 1499 | 2 | 7-10 |
| 11 | Faux-Fur Slide Sandals (Fur Wali Chappal) | product-faux-fur-slide-sandals.html | 1099 | 7 (one per color) | 6-10 (Baby Pink also 4) |
| 12 | Medicated Comfort Slippers for Men | product-medicated-comfort-slippers.html | ? | 2 | ? |
| 13 | Ladies Comfort Slippers with Thick PU Sole | product-ladies-comfort-slippers.html | ? | 2 | ? |
| 14 | Men's Comfort Strap Sandals with PU Sole | product-mens-comfort-strap-sandals.html | ? | 6 | ? |
| 15 | Men's Cargo Sandals | product-mens-cargo-sandals.html | 1699 | 4 | 6-10 |
| 16 | Jali Wala Khussa Floral | product-women-jali-khussa.html | 1799 | 6 | ? |
| 17 | Kids' Cargo Sandals | product-kids-cargo-sandals.html | 1399 | 4 | 11-3 |
| 18 | Men's Brown Criss-Cross Casual Sandal | product-mens-brown-criss-cross-sandal.html | 1199 | 4 (Brown 2, Black 2) | Brown 6,8,9,10 / Black 6,7,9,10 |
| 19 | Red & Golden Stone Embellished Bridal Sandal | product-red-golden-stone-bridal-sandal.html | 999 | 3 (Red) | 1-9 |
| 20 | Green & Golden Embroidered Ladies Khussa | product-green-golden-embroidered-ladies-khussa.html | 1499 | 6 (Mehndi Green 2, Red 2, Yellow 2) | 6-10 |
| 21 | Grey Kids & Teens Casual Slide Chappal | product-grey-kids-teens-casual-chappal.html | 700 | 4 (Grey 2, Green 2) | 1-12 (ages 8-16) |
| 22 | Stone & Bead Embroidered Ladies Khussa | product-stone-bead-embroidered-ladies-khussa.html | 1099 | 6 (Black 2, White 2, Golden 2) | White & Golden 37-40 / Black 37-39 |
| 23 | Green Embroidered Kids Girls Khussa | product-green-embroidered-kids-girls-khussa.html | 800 | 2 (Green) | 9-13 (kids) |

Verify prices/sizes from `products.js` — the table above is a quick reference
only.

---

## 11. BACKLINKS (why the site has zero, and how to get them)

**UPDATE 2026-08-28: the site now has 8 verified live backlinks** (all dofollow,
no nofollow/sponsored rel, all return 200 with a working link to
https://mashrafshoes.store). They are Web 2.0 / free-blog platform links with
spun/AI content — see the tracking list below. Treat them as low-to-medium
quality: they help with citation/brand signals, but the content is clearly
auto-generated and these networks can be devalued. Do NOT rely on them as the
backlink strategy; keep building real citations (OLX, Daraz, directories, GBP).

### Verified backlinks (all verified live 2026-08-28, all dofollow)

| Platform | URL | Anchor |
|---|---|---|
| pointblog.net | shoespakistan106384.pointblog.net/the-shoe-spot-96825172 | click here |
| blogdigy.com | shoespakistan272084.blogdigy.com/footwear-haven-70025823 | read more |
| blog5.net | shoespakistan309406.blog5.net/96758593/shoespakistan | click here |
| mpeblog.com | shoespakistan702650.mpeblog.com/78125024/footwear-haven | get more info |
| blog-gold.com | shoespakistan524572.blog-gold.com/1009298/shoespakistan | read more |
| blognody.com | shoespakistan133635.blognody.com/53818026/footwear-haven | website |
| veronicablog.com | shoespakistan212206.veronicablog.com/62089126/shoespakistan | website |
| newsyblog.com | shoespakistan111262.newsyblog.com/820283/the-shoe-spot | here |

### Social profiles (E-E-A-T / brand signals — added 2026-09-01)

Owner created an Instagram business page and connected it to Facebook; the
website link is in the Instagram bio. Instagram/Facebook profile links are
nofollow so they pass no direct link equity, but they build brand/E-E-A-T
signals and satisfy the "no social profiles" gap flagged by the SEOmator audit.

- Instagram: https://www.instagram.com/ashraf_shoe26/ (confirmed live)
- Facebook: owner-connected (page URL not yet added — get it from the owner and
  add to `sameAs` + footer once known)
- Pinterest: https://www.pinterest.com/ashrafshoe/ (confirmed live 2026-09-03;
  profile bio links mashrafshoes.store). Added to homepage `sameAs` +
  `Organization` JSON-LD and footer.

**UPDATE 2026-09-03:** the earlier Facebook share URL
(facebook.com/share/19RUXJtd1F/...) returns HTTP 400 and is not a stable
backlink — DROPPED from verification. Pinterest profile added to the homepage
footer and to the `OnlineStore` + `Organization` `sameAs` arrays instead.

Site integration (committed): `sameAs` array added to the homepage
`OnlineStore` JSON-LD, Instagram link added to homepage footer (rel="me") and
to the 6 category-page footers (via `scripts/gen_categories.py`). Pinterest
profile added alongside Instagram on the homepage footer and in both homepage
`schema.org` `sameAs` arrays. Keep social
links consistent across any new pages.

The site currently has **zero backlinks** — no other site links to
mashrafshoes.store. Backlinks are external links from other websites to yours;
Google treats them as votes of trust, and without them a new store stays nearly
invisible. This CANNOT be done from the repo — it needs accounts and manual
submission. These are the highest-value, free sources for Pakistan (ranked):

1. **OLX Pakistan (olx.com.pk)** — list each product as an ad with your store
   URL in the description. OLX pages rank in Google.com.pk and pass brand
   signals. Best first move.
2. **Daraz.pk** — open a seller store and list products. Daraz product pages
   rank prominently and link back to your site/brand.
3. **Local directories (NAP citations)** — Locally.pk, PakistanYellowPages.com,
   Businesslist.pk, Hamariweb.com. Register the business with IDENTICAL name,
   address, phone (+92) on each. Consistency is what makes them count.
4. **Google Business Profile** — create one with a +92 phone, Pakistan address,
   photos, and get customer reviews. Drives the local pack + website visits.
5. **Facebook/Instagram page + WhatsApp Business** — put your store link in the
   bio and posts. Social links are weak signals but free and easy.
6. **Pakistan shoe blogs / Urdu content** — guest posts or mentions on
   Hamariweb articles and local blogs (low-volume, higher effort).

Never buy link farms or spam comment sections — that can de-index the site
(trust loss is irreversible).

---

## 12. WHY THE AI CANNOT "PROCESS" IMAGES HERE

- The AI works from text: it can verify that a filename exists, check
  dimensions/extensions via shell tools, and name files correctly — but it
  **cannot view photo content**, retouch, crop, or decide which photo looks
  best. No image input channel exists in this environment.
- Image file uploads must be made by the owner (drag into chat, or provide a
  download link — then the AI fetches them into `images/` itself per rule 9b).
- Image compression (section 8) runs as a command on files already on disk,
  which the AI CAN do once the photos exist.

---

## 13. NEVER DO THIS

- Never let Supabase replace `window.products` (merge only).
- Never reference an image that isn't in `images/` with the exact same name.
- Never use `.heic` files.
- Never use `getClient()` synchronously (it's async).
- Never add a product to `products.js` without its page + images + sitemap entry.
- Never drop or reorder the script tags.
- Never add laces/scroll animations, emojis, or change the design system.
- Never commit the Google OAuth client secret or any API secret.
- Never delete files unless the owner confirms.

---

## 14. INDEXNOW (Bing/Yandex fast indexing) — setup

Google/Bing deprecated sitemap pings (Google 404, Bing 410). IndexNow is the
modern replacement — submit all URLs once and Bing/Yandex crawl within hours.

- Key file hosted at site root: `c8b561f47cdc40f89a54bd737cae3128.txt` (must
  return 200 from https://mashrafshoes.store/<key>.txt to verify).
- To re-submit after adding products:
  ```
  KEY=c8b561f47cdc40f89a54bd737cae3128
  curl -s "https://mashrafshoes.store/sitemap.xml" | grep -o '<loc>[^<]*' | sed 's|<loc>||' > /tmp/urls.txt
  python3 -c "import json; urls=[l.strip() for l in open('/tmp/urls.txt') if l.strip()]; open('/tmp/p.json','w').write(json.dumps({'host':'mashrafshoes.store','key':'$KEY','keyLocation':'https://mashrafshoes.store/'+chr(36)+'KEY.txt','urlList':urls}))"
  curl -s -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json; charset=utf-8" -d @/tmp/p.json -w "HTTP %{http_code}\n"   # expect 202
  ```
  **Do this after every product/category push.**
- **Status 2026-09-03:** after the product-ID-7 push the JSON submit started
  returning `HTTP 403 {"errorCode":"UserForbiddedToAccessSite"}` even though the
  key file still returns 200 at site root; the plain-text POST and Bing sitemap
  ping (410) also fail. The IndexNow property registration/verification appears
  to have been reset. Re-verify the property for mashrafshoes.store via
  `https://www.indexnow.org/` before relying on submissions again.
- Google does NOT use IndexNow — Google needs Search Console sitemap
  submission + ownership verification (user must do this).

## 15. WHAT THE OWNER MUST DO NEXT (GSC + real citations)

1. **Verify Search Console ownership** — go to search.google.com/search-console →
   add property → choose DNS TXT (easiest on Cloudflare). I'll handle the
   sitemap submission + data pull once verified.
2. **Google Business Profile** — create with +92 phone, address, photos; this is
   the single biggest local ranking factor.
3. **OLX Pakistan + Daraz.pk** — list products with store URL (these get crawled
   constantly and link back).
4. **Directories** — Locally.pk, PakistanYellowPages.com, Businesslist.pk with
   identical NAP.
5. **Cloudflare returns empty 404 bodies** — 2026-09-03 a `404.html` was added
   to the repo root (custom page with category links), but requests for missing
   paths on mashrafshoes.store return HTTP 404 with a 0-byte body, so the custom
   page is not being shown. Check the Cloudflare dashboard for a Custom Error
   Page / Worker/transform rule that empties 4xx responses on this zone; if
   none, raise a Pages support check. (GitHub itself serves custom 404.html for
   the repo — it may be blocked only at the edge.)
6. **Compress `images/...-anatomy.png`** (1.9 MB) — target <300 KB to protect
   mobile LCP on the Colorful Kids Khussa page.
7. **GSC "not indexed" (~33 pages)** — after Search Console verification
   (item 1), request indexing for the new product page
   `https://mashrafshoes.store/product-colorful-embroidered-kids-khussa-for-girls`
   and re-submit the sitemap; then mirror the GSC "Pages" report data here so
   the remaining "not indexed" causes can be triaged one-by-one.
8. **Backlinks** — Pinterest profile (https://www.pinterest.com/ashrafshoe/)
   is confirmed live and now linked in the homepage footer + `sameAs`. The
   earlier Facebook share URL was dropped (HTTP 400). When the Facebook *page*
   URL is known, add it to `sameAs` + footer too.
