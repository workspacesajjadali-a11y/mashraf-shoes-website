# Supabase Setup Guide — M Ashraf Shoes

This guide wires the store to a **free Supabase** database. Products, orders and
contact inquiries are stored in Supabase while the site stays 100% static
(no backend server needed).

## What got added

| File | Purpose |
|------|---------|
| `supabase-config.js` | Your Project URL + anon key (fill in) |
| `supabase.js` | Client library: `loadProducts()`, `saveOrder()`, `saveInquiry()` + Auth (`signUp`, `signIn`, Google, cart sync, `getMyOrders`) |
| `supabase-schema.sql` | Tables + Row Level Security policies (run in SQL Editor) |
| `db/seed-products.js` | One-time script to push `products.js` into the database |
| `checkout.html` | Now also saves every order to Supabase |
| `index.html` | Now loads the catalog from Supabase when configured |
| `index.html` | Contact inquiries also saved to Supabase |
| `login.html`, `signup.html` | Customer accounts: email/password + Google button |
| `account.html` | Profile, saved cart (per email) and order history |

## Step 1 — Create the free project

1. Go to https://supabase.com and sign up (free tier).
2. Create a **new project** — pick a name (e.g. `mashraf-shoes`), a strong
   database password, and the region closest to you.
3. Wait for the project to provision (~1–2 minutes).

## Step 2 — Run the schema (tables + security)

1. In your project dashboard open **SQL Editor → New query**.
2. Copy everything from `supabase-schema.sql` into the editor.
3. Click **Run**. You should see four tables: `products`, `orders`, `inquiries`,
   `user_carts`, plus the RPC functions (`place_order`, `place_inquiry`,
   `save_cart`, `load_cart`, `get_my_orders`).

> If you already ran an older version of the schema, re-running the current
> `supabase-schema.sql` is safe — it uses `create table if not exists` and
> `create or replace function`, so it simply adds what's missing.

## Step 3 — Fill in your keys

1. Open **Project Settings → API** (gear icon → API).
2. Copy the **Project URL** and the **anon / public** key.
3. Open `supabase-config.js` and paste both values in place of the placeholders.

```js
window.SUPABASE_URL = 'https://abcdefghijklm.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOi...';  // your anon/public key
```

The anon key is safe in the browser — RLS only lets it read products and write
orders/inquiries, never read other people's data.

## Step 4 — Seed the product catalog (one time)

The browser can read products but must not write them, so seeding uses the
**service role key** (secret — keep it out of the website).

1. Open **Project Settings → API** and copy the **service_role** key.
2. From the project folder run:

```bash
export SUPABASE_URL="https://abcdefghijklm.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
node db/seed-products.js
```

You should see: `Seeded 6 products into ...`

> The seed uses upsert (`merge-duplicates`), so re-running it is safe and
> updates any changed product data.

## Step 5 — Verify

1. Reopen `index.html`. Products now load from Supabase (check Network tab —
   a request to `/rest/v1/products` should appear).
2. Place a test order via `checkout.html`.
3. In the dashboard open **Table Editor → orders** — your test order is there.
4. Send a test inquiry from the homepage — it lands in `inquiries`.

## Step 6 — Turn on customer accounts (login/signup)

The login, signup and account pages are built and ready. They work out of the
box for email + password. To enable the **Continue with Google** button,
follow `GOOGLE-LOGIN-SETUP.md` (about 10 minutes).

- Customer carts are saved per email in `user_carts` (any device).
- Order history is looked up by the email entered at checkout.

## Managing orders

Orders never come to your website — you read them in the Supabase dashboard
(**Table Editor → orders**) sorted newest first, or by connecting a free BI
tool / Supabase Studio dashboard. The `Status` column is yours to update
(Processing / Shipped / Delivered / Cancelled).

## Still on old services?

SheetDB, Formspree and EmailJS keep working exactly as before — Supabase is an
*additional* always-on database. Once you're happy with Supabase, you can
remove the old calls from `checkout.html` if you like.

## Troubleshooting

- **Nothing shows on the homepage** → the anon key in `supabase-config.js` is
  missing or wrong; the site silently falls back to `products.js`.
- **Order not in the table** → check the browser console for
  `Supabase order save failed`; usually the SQL in Step 2 wasn't run.
- **Product changes not visible** → re-run the seed script (Step 4).
