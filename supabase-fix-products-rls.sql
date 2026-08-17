-- =====================================================================
-- FIX: products disappear when logged in
-- The old products policy only allowed the "anon" role. When a customer
-- logs in, Supabase uses the "authenticated" role, which had no policy,
-- so products were hidden. Drop the old policy and recreate it to allow
-- both roles to read the public catalog.
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

drop policy if exists "products_anon_read" on public.products;

create policy "products_anon_read"
  on public.products for select
  to anon, authenticated
  using (true);
