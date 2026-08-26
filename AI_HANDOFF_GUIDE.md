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

- `products.js` defines the full static catalog (currently 17 products).
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
   - `pageUrl` must match the product page filename exactly.
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
6. Clone a product page → rename → fix `PRODUCT_ID` → fix images → keep script
   order + mobile swatch fix.
7. Update `sitemap.xml`.
8. Run ALL checks in section 7.
9. Push. GitHub Pages auto-deploys in ~2 min.

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
| 20 | Green & Golden Embroidered Ladies Khussa | product-green-golden-embroidered-ladies-khussa.html | 1499 | 2 (Mehndi Green) | 6-10 |
| 21 | Grey Kids & Teens Casual Slide Chappal | product-grey-kids-teens-casual-chappal.html | 700 | 4 (Grey 2, Green 2) | 1-12 (ages 8-16) |

Verify prices/sizes from `products.js` — the table above is a quick reference
only.

---

## 11. NEVER DO THIS

- Never let Supabase replace `window.products` (merge only).
- Never reference an image that isn't in `images/` with the exact same name.
- Never use `.heic` files.
- Never use `getClient()` synchronously (it's async).
- Never add a product to `products.js` without its page + images + sitemap entry.
- Never drop or reorder the script tags.
- Never add laces/scroll animations, emojis, or change the design system.
- Never commit the Google OAuth client secret or any API secret.
- Never delete files unless the owner confirms.
