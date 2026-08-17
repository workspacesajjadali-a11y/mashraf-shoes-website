-- =====================================================================
-- FIX: Peshawari chappal images stored with a stray ".heic" suffix
-- Browsers cannot display .heic files, so the converted .jpeg images
-- were invisible on the homepage. Remove the ".heic" suffix from the
-- stored image paths.
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

update public.products
set variants = (
  select jsonb_agg(
    jsonb_set(
      v,
      '{images}',
      (
        select jsonb_agg(replace(img, '.heic', ''))
        from jsonb_array_elements_text(v->'images') as img
      )
    )
  )
  from jsonb_array_elements(variants) as v
)
where variants::text like '%.heic%';

select id, name, variants->0->'images' as first_variant_images
from public.products
where id = 5;
