/* =====================================================================
   M ASHRAF SHOES — SEED PRODUCTS INTO SUPABASE
   Pushes the catalog from products.js into the Supabase `products` table.

   Usage (from the project root):
     export SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
     export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
     node db/seed-products.js

   The service role key bypasses Row Level Security, so it can write the
   catalog even though the browser anon key is read-only. Get the service
   role key from: Supabase Dashboard → Settings → API (treat it as secret;
   never ship it to the browser).
   ===================================================================== */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.');
  process.exit(1);
}

/* Load products.js (it assigns window.products). Shim `window` for Node.
   Use indirect eval so `var products` lands in the global scope instead of
   colliding with this module's own bindings. */
global.window = {};
const src = fs.readFileSync(path.join(__dirname, '..', 'products.js'), 'utf8');
(0, eval)(src);
const products = global.window.products;

if (!Array.isArray(products) || products.length === 0) {
  console.error('No products found in products.js');
  process.exit(1);
}

async function upsertRows(rows) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': 'Bearer ' + SERVICE_ROLE_KEY,
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(rows)
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error('Upsert failed (' + res.status + '): ' + body);
  }
}

function productToRow(p) {
  return {
    id: p.id,
    brand: p.brand,
    name: p.name,
    category: p.category,
    price: p.price,
    old_price: p.oldPrice,
    rating: p.rating || 0,
    rating_count: p.ratingCount || 0,
    badge: p.badge || null,
    material: p.material || null,
    whatsapp_number: p.whatsappNumber || null,
    page_url: p.pageUrl || null,
    delivery_charge: p.deliveryCharge != null ? p.deliveryCharge : 0,
    description: p.description || null,
    seo_title: p.seoTitle || null,
    seo_description: p.seoDescription || null,
    seo_keywords: p.seoKeywords || null,
    variants: p.variants || [],
    sort_order: p.id
  };
}

(async function main() {
  const rows = products.map(productToRow);
  await upsertRows(rows);
  console.log('Seeded ' + rows.length + ' products into ' + SUPABASE_URL + '/rest/v1/products');
})().catch(function (err) {
  console.error(err);
  process.exit(1);
});
