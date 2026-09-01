#!/usr/bin/env python3
import html as h

BASE = "https://mashrafshoes.store"

CATS = [
    {
        "slug": "khussa",
        "title": "Khussa Online in Pakistan – Handcrafted Pakistani Khussa | M Ashraf Shoes",
        "meta_desc": "Buy handcrafted khussa online in Pakistan. Embroidered ladies khussa, jali wala khussa, stone & bead khussa and kids girls khussa with nationwide Cash on Delivery.",
        "h1": "Khussa Online in Pakistan",
        "intro": "Shop handcrafted Pakistani khussa online at M Ashraf Shoes. Our embroidered ladies khussa, jali wala khussa, stone & bead khussa and kids girls khussa are made with traditional craft. Cash on Delivery to Karachi, Lahore, Islamabad and all Pakistan.",
        "faq": [
            ("What is khussa?", "Khussa is a traditional Pakistani hand-embroidered shoe, worn by women and children for weddings, eid and everyday wear."),
            ("Is khussa available in kids sizes?", "Yes, we stock embroidered kids girls khussa in small sizes with Cash on Delivery across Pakistan."),
            ("Do you deliver khussa to Karachi, Lahore and Islamabad?", "Yes, we ship nationwide across all Pakistan with Cash on Delivery."),
        ],
        "products": [
            ("product-women-jali-khussa", "Jali Wala Khussa Floral – Ladies Embroidered Khussa"),
            ("product-green-golden-embroidered-ladies-khussa", "Green & Golden Embroidered Ladies Khussa"),
            ("product-stone-bead-embroidered-ladies-khussa", "Stone & Bead Embroidered Ladies Khussa"),
            ("product-green-embroidered-kids-girls-khussa", "Green Embroidered Kids Girls Khussa"),
        ],
    },
    {
        "slug": "chappal",
        "title": "Chappal Online in Pakistan – Leather Chappal & Casual Chappal | M Ashraf Shoes",
        "meta_desc": "Buy chappal online in Pakistan. Men's peshawari chappal, brown casual chappal and kids teens slide chappal with Cash on Delivery and nationwide shipping.",
        "h1": "Chappal Online in Pakistan",
        "intro": "Find quality chappal online in Pakistan at M Ashraf Shoes. From traditional peshawari chappal to casual leather chappal and kids slide chappal, we deliver nationwide with Cash on Delivery.",
        "faq": [
            ("What is peshawari chappal?", "Peshawari chappal is a classic Pakistani hand-stitched leather sandal from Peshawar, worn for both casual and formal occasions."),
            ("Do you sell chappal for men and kids?", "Yes, we stock men's leather chappal, casual chappal and kids & teens slide chappal."),
            ("Is Cash on Delivery available for chappal orders?", "Yes, we deliver chappal across Pakistan with Cash on Delivery."),
        ],
        "products": [
            ("product-peshawari-chappal", "Men's Peshawari Chappal – Traditional Pakistani Sandal"),
            ("product-mens-brown-casual-chappal", "Men's Brown Casual Chappal"),
            ("product-grey-kids-teens-casual-chappal", "Grey Kids & Teens Casual Slide Chappal"),
        ],
    },
    {
        "slug": "sandals",
        "title": "Sandals Online in Pakistan – Men's, Women's & Kids Sandals | M Ashraf Shoes",
        "meta_desc": "Buy sandals online in Pakistan. Men's casual sandals, women's flat sandals and kids sandals with Cash on Delivery, easy exchange and nationwide shipping.",
        "h1": "Sandals Online in Pakistan",
        "intro": "Shop sandals online in Pakistan at M Ashraf Shoes. We stock men's casual and comfort strap sandals, women's flat and toe-ring sandals, and kids cargo sandals. Nationwide Cash on Delivery.",
        "faq": [
            ("Which types of sandals do you sell?", "We sell men's casual, cargo and comfort strap sandals, women's flat, braided and embellished sandals, and kids cargo sandals."),
            ("Are the sandals available in multiple sizes?", "Yes, our sandals come in a range of sizes for men, women and kids. Check each product page for details."),
            ("Do you deliver sandals across Pakistan?", "Yes, nationwide Cash on Delivery to Karachi, Lahore, Islamabad and all cities."),
        ],
        "products": [
            ("product-page", "Diamante Strap Sandals – Women's Sandals"),
            ("product-braided-sandals", "Braided Toe-Ring Sandals"),
            ("product-kare-embellished-sandals", "Embellished Strap Flat Sandals"),
            ("product-perforated-cross-strap-sandals", "Men's Perforated Cross-Strap Casual Sandals"),
            ("product-mens-comfort-strap-sandals", "Men's Comfort Strap Sandals with PU Sole"),
            ("product-mens-cargo-sandals", "Men's Cargo Sandals"),
            ("product-kids-cargo-sandals", "Kids' Cargo Sandals"),
            ("product-mens-brown-criss-cross-sandal", "Men's Brown Criss-Cross Casual Sandal"),
        ],
    },
    {
        "slug": "slippers",
        "title": "Slippers Online in Pakistan – Comfort Slippers for Men & Women | M Ashraf Shoes",
        "meta_desc": "Buy slippers online in Pakistan. Medicated comfort slippers for men, ladies slippers with PU sole and faux-fur slide slippers with Cash on Delivery nationwide.",
        "h1": "Slippers Online in Pakistan",
        "intro": "Get comfortable slippers online in Pakistan at M Ashraf Shoes. We offer medicated comfort slippers for men, ladies comfort slippers and faux-fur slide slippers, delivered nationwide with Cash on Delivery.",
        "faq": [
            ("What are medicated comfort slippers?", "Medicated comfort slippers are cushioned sandals designed to support feet during long standing or walking."),
            ("Do you sell ladies slippers?", "Yes, we stock ladies comfort slippers with thick PU sole in multiple sizes."),
            ("Is Cash on Delivery available?", "Yes, all slippers ship nationwide with Cash on Delivery."),
        ],
        "products": [
            ("product-medicated-comfort-slippers", "Medicated Comfort Slippers for Men"),
            ("product-ladies-comfort-slippers", "Ladies Comfort Slippers with Thick PU Sole"),
            ("product-faux-fur-slide-sandals", "Faux-Fur Slide Sandals with Gold Emblem"),
        ],
    },
    {
        "slug": "loafers",
        "title": "Loafers Online in Pakistan – Men's Loafers for Men | M Ashraf Shoes",
        "meta_desc": "Buy men's loafers online in Pakistan. Luxury-style loafers, horsebit buckle loafers and black horsebit tassel loafers with Cash on Delivery nationwide.",
        "h1": "Loafers Online in Pakistan",
        "intro": "Shop men's loafers online in Pakistan at M Ashraf Shoes. From premium luxury-style loafers to horsebit buckle and tassel loafers, with Cash on Delivery across Pakistan.",
        "faq": [
            ("Are loafers formal or casual?", "Our men's loafers work for both formal and smart-casual looks, including office and weddings."),
            ("What sizes are available?", "Our men's loafers are available in larger sizes. Check each product page."),
            ("Do you deliver loafers across Pakistan?", "Yes, nationwide Cash on Delivery."),
        ],
        "products": [
            ("product-premium-loafers", "Men's Premium Luxury-Style Loafers"),
            ("product-mens-horsebit-buckle-loafers", "Men's Horsebit Buckle Loafers"),
            ("product-black-horsebit-tassel-loafers", "Men's Black Horsebit Tassel Loafers"),
        ],
    },
    {
        "slug": "bridal-sandals",
        "title": "Bridal Sandals & Wedding Khussa Online in Pakistan | M Ashraf Shoes",
        "meta_desc": "Buy bridal sandals and wedding khussa online in Pakistan. Red & golden stone bridal sandal and embroidered khussa for brides with Cash on Delivery nationwide.",
        "h1": "Bridal Sandals & Wedding Khussa Online in Pakistan",
        "intro": "Find bridal sandals and wedding khussa online in Pakistan at M Ashraf Shoes. Our red & golden stone bridal sandals and embroidered ladies khussa add elegance to your special day. Cash on Delivery nationwide.",
        "faq": [
            ("Do you sell bridal sandals?", "Yes, we stock a red & golden stone embellished bridal sandal designed for weddings and events."),
            ("Can I order wedding khussa online?", "Yes, our embroidered ladies khussa is perfect for weddings and available with Cash on Delivery."),
            ("Do you deliver for wedding orders across Pakistan?", "Yes, nationwide delivery with Cash on Delivery."),
        ],
        "products": [
            ("product-red-golden-stone-bridal-sandal", "Red & Golden Stone Embellished Bridal Sandal"),
            ("product-women-jali-khussa", "Jali Wala Khussa Floral – Ladies Embroidered Khussa"),
            ("product-green-golden-embroidered-ladies-khussa", "Green & Golden Embroidered Ladies Khussa"),
            ("product-stone-bead-embroidered-ladies-khussa", "Stone & Bead Embroidered Ladies Khussa"),
        ],
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{meta_desc}">
<meta name="keywords" content="{keywords}">
<link rel="canonical" href="{base}/{slug}">
<link rel="icon" type="image/x-icon" href="favicon.ico">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:url" content="{base}/{slug}">
<meta property="og:image" content="{base}/images/{og_image}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "{h1}",
  "url": "{base}/{slug}",
  "description": "{meta_desc}",
  "inLanguage": "en-PK",
  "mainEntity": {{
    "@type": "ItemList",
    "itemListElement": [
{itemlist}
    ]
  }}
}}
</script>
<style>
  :root{{
    --bg:#FBFAF7;
    --ink:#1A1A18;
    --ink-soft:rgba(26,26,24,0.68);
    --ink-faint:rgba(26,26,24,0.62);
    --accent:#1B5E43;
    --line:rgba(26,26,24,0.12);
    --sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    --serif:Georgia,'Times New Roman',serif;
  }}
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.55;-webkit-font-smoothing:antialiased}}
  a{{color:inherit}}
  .wrap{{max-width:960px;margin:0 auto;padding:40px 20px 60px}}
  .eyebrow{{font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:8px}}
  h1{{font-family:var(--serif);font-size:30px;line-height:1.2;margin-bottom:10px}}
  p.sub{{color:var(--ink-soft);font-size:15px;margin-bottom:22px}}
  .toplink{{display:inline-block;font-size:13px;color:var(--ink-soft);text-decoration:none;margin-bottom:26px;border-bottom:1px solid var(--ink-soft);padding-bottom:1px}}
  .crumb{{font-size:13px;color:var(--ink-faint);margin-bottom:8px}}
  .crumb a{{color:var(--ink-soft);text-decoration:none}}
  .catlinks{{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}}
  .catlinks a{{font-size:13px;color:var(--accent);text-decoration:none;border:1px solid var(--accent);border-radius:20px;padding:5px 12px}}
  .catlinks a:hover{{background:var(--accent);color:#fff}}
  h2{{font-family:var(--serif);font-size:22px;margin:10px 0 14px}}
  .prod{{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--line);border-radius:10px;margin-bottom:10px;background:#fff;text-decoration:none;transition:border-color .15s}}
  .prod:hover{{border-color:var(--accent)}}
  .prod .name{{font-size:15px;font-weight:600}}
  .prod .arrow{{color:var(--ink-faint);font-size:13px;white-space:nowrap}}
  .faq{{margin-top:34px}}
  .faq h2{{margin-bottom:10px}}
  .faq details{{border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin-bottom:8px;background:#fff}}
  .faq summary{{font-weight:600;cursor:pointer;font-size:15px}}
  .faq p{{margin-top:8px;font-size:14px;color:var(--ink-soft)}}
  footer{{margin-top:40px;padding-top:20px;border-top:1px solid var(--line);font-size:12px;color:var(--ink-faint);text-align:center}}
  footer a{{color:var(--ink-soft);text-decoration:none}}
</style>
</head>
<body>
<div class="wrap">
  <div class="eyebrow">M Ashraf Shoes Pakistan</div>
  <div class="crumb"><a href="{base}/">Home</a> &rsaquo; {h1}</div>
  <h1>{h1}</h1>
  <p class="sub">Cash on Delivery &middot; Nationwide Shipping &middot; Easy Exchange</p>
  <a class="toplink" href="{base}/">&larr; Back to Homepage</a>

  <div class="catlinks">
    <a href="{base}/khussa">Khussa</a>
    <a href="{base}/chappal">Chappal</a>
    <a href="{base}/sandals">Sandals</a>
    <a href="{base}/slippers">Slippers</a>
    <a href="{base}/loafers">Loafers</a>
    <a href="{base}/bridal-sandals">Bridal</a>
  </div>

  <p style="color:var(--ink-soft);font-size:15px;margin-bottom:24px">{intro}</p>

  <h2>Shop {h1}</h2>
{product_links}

  <div class="faq">
    <h2>Frequently Asked Questions</h2>
{faq}
  </div>

  <footer>
    &copy; M Ashraf Shoes Pakistan &middot; <a href="{base}/sitemap.xml">XML Sitemap</a> &middot; <a href="{base}/sitemap">All Products</a> &middot; <a href="https://www.instagram.com/ashraf_shoe26/" rel="me">Instagram</a>
  </footer>
</div>
</body>
</html>
"""

def og_image_for(cat):
    slugs = [p[0] for p in cat["products"]]
    return "diamante-strap-sandals-grey-pakistan.jpeg"

def build(cat):
    itemlist = []
    for i, (slug, name) in enumerate(cat["products"], start=1):
        itemlist.append(
            '      {\n'
            '        "@type": "ListItem",\n'
            '        "position": %d,\n'
            '        "name": "%s",\n'
            '        "url": "%s/%s"\n'
            '      }' % (i, h.escape(name, quote=False).replace('"', '\\"'), BASE, slug)
        )
    itemlist_str = ",\n".join(itemlist)

    product_links = "\n".join(
        '    <a class="prod" href="%s/%s"><span class="name">%s</span><span class="arrow">View &rarr;</span></a>'
        % (BASE, slug, h.escape(name)) for slug, name in cat["products"]
    )

    faq = "\n".join(
        '    <details class="faq-item"><summary>%s</summary><p>%s</p></details>'
        % (h.escape(q), h.escape(a)) for q, a in cat["faq"]
    )

    keywords = ("%s online Pakistan, buy %s online Pakistan, %s Karachi, %s Lahore, "
                "%s Islamabad, cash on delivery %s Pakistan, M Ashraf Shoes" % (
                    cat["h1"].lower(), cat["slug"], cat["slug"], cat["slug"], cat["slug"], cat["slug"]))

    page = TEMPLATE.format(
        title=cat["title"],
        meta_desc=h.escape(cat["meta_desc"]),
        keywords=h.escape(keywords),
        base=BASE,
        slug=cat["slug"],
        og_image=og_image_for(cat),
        h1=h.escape(cat["h1"]),
        intro=h.escape(cat["intro"]),
        itemlist=itemlist_str,
        product_links=product_links,
        faq=faq,
    )
    return page

for cat in CATS:
    with open("%s.html" % cat["slug"], "w") as f:
        f.write(build(cat))
    print("wrote %s.html" % cat["slug"])
