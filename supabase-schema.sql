-- =====================================================================
-- M ASHRAF SHOES — SUPABASE SCHEMA + ROW LEVEL SECURITY
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) PRODUCTS
--    Public catalog. The anon key may READ these (used by the storefront),
--    but may never write. Writes go through the seed script (service role).
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id            bigint primary key,
  brand         text not null,
  name          text not null,
  category      text not null,
  price         numeric not null,
  old_price     numeric,
  rating        numeric not null default 0,
  rating_count  integer not null default 0,
  badge         text,
  material      text,
  whatsapp_number text,
  page_url      text,
  delivery_charge numeric not null default 0,
  description   text,
  seo_title     text,
  seo_description text,
  seo_keywords  jsonb,
  variants      jsonb not null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products_anon_read"
  on public.products for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 2) ORDERS
--    Customers may INSERT their own order via the anon key, but may not
--    read the orders table (privacy). The shop owner reads it in the
--    Supabase dashboard / Table Editor.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id            bigint generated always as identity primary key,
  order_id      text not null unique,
  customer_name text not null,
  phone         text not null,
  email         text,
  address       text not null,
  items         jsonb not null,
  items_text    text,
  subtotal      numeric not null,
  delivery_charge numeric not null default 250,
  total         numeric not null,
  payment_method text not null default 'COD',
  status        text not null default 'Processing',
  created_at    timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_anon_insert"
  on public.orders for insert
  to anon
  with check (true);

-- ---------------------------------------------------------------------
-- 3) INQUIRIES
--    Contact-form messages. anon may insert; owner reads in dashboard.
-- ---------------------------------------------------------------------
create table if not exists public.inquiries (
  id         bigint generated always as identity primary key,
  type       text not null default 'General',
  name       text not null,
  phone      text not null,
  message    text,
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy "inquiries_anon_insert"
  on public.inquiries for insert
  to anon
  with check (true);

-- ---------------------------------------------------------------------
-- Indexes for common lookups
-- ---------------------------------------------------------------------
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_products_category on public.products (category);

-- ---------------------------------------------------------------------
-- 4) SECURITY-DEFINER FUNCTIONS (used by the website)
--    Anon-role writes go through these functions. They run as the table
--    owner so they bypass RLS, which keeps policy/cache issues at bay and
--    gives you one place to control exactly what the public can write.
-- ---------------------------------------------------------------------

create or replace function public.place_order(
  p_order_id text,
  p_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_items jsonb,
  p_items_text text,
  p_subtotal numeric,
  p_delivery_charge numeric,
  p_total numeric,
  p_payment_method text
) returns jsonb
language sql
security definer
set search_path = public
as $$
  insert into public.orders (
    order_id, customer_name, phone, email, address, items, items_text,
    subtotal, delivery_charge, total, payment_method, status
  ) values (
    p_order_id, p_name, p_phone, p_email, p_address, p_items, p_items_text,
    p_subtotal, p_delivery_charge, p_total, p_payment_method, 'Processing'
  )
  returning to_jsonb(orders);
$$;

revoke all on function public.place_order(text,text,text,text,text,jsonb,text,numeric,numeric,numeric,text) from public;
grant execute on function public.place_order(text,text,text,text,text,jsonb,text,numeric,numeric,numeric,text) to anon;

create or replace function public.place_inquiry(
  p_type text,
  p_name text,
  p_phone text,
  p_message text
) returns jsonb
language sql
security definer
set search_path = public
as $$
  insert into public.inquiries (type, name, phone, message)
  values (p_type, p_name, p_phone, p_message)
  returning to_jsonb(inquiries);
$$;

revoke all on function public.place_inquiry(text,text,text,text) from public;
grant execute on function public.place_inquiry(text,text,text,text) to anon;

-- ---------------------------------------------------------------------
-- 5) USER CART (one cart per email address)
--    Used by the login/signup account pages so a customer's cart follows
--    them on any device. Reads/writes go through security-definer RPC
--    functions keyed on the email (matches how orders are stored).
-- ---------------------------------------------------------------------
create table if not exists public.user_carts (
  email      text primary key,
  items      jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.user_carts enable row level security;

create or replace function public.save_cart(
  p_email text,
  p_items jsonb
) returns jsonb
language sql
security definer
set search_path = public
as $$
  insert into public.user_carts (email, items, updated_at)
  values (p_email, p_items, now())
  on conflict (email)
  do update set items = excluded.items, updated_at = now()
  returning to_jsonb(user_carts);
$$;

revoke all on function public.save_cart(text, jsonb) from public;
grant execute on function public.save_cart(text, jsonb) to anon;

create or replace function public.load_cart(
  p_email text
) returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(items, '[]'::jsonb)
  from public.user_carts
  where email = p_email;
$$;

revoke all on function public.load_cart(text) from public;
grant execute on function public.load_cart(text) to anon;

-- ---------------------------------------------------------------------
-- 6) MY ORDERS (history shown on the account page)
--    A customer can look up orders placed with their email. This is a
--    narrow, security-definer read: it only returns rows that match the
--    exact email they provide (an anon caller still cannot read the
--    orders table directly).
-- ---------------------------------------------------------------------
create or replace function public.get_my_orders(
  p_email text
) returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(to_jsonb(o) order by o.created_at desc), '[]'::jsonb)
  from public.orders o
  where lower(o.email) = lower(p_email);
$$;

revoke all on function public.get_my_orders(text) from public;
grant execute on function public.get_my_orders(text) to anon;
