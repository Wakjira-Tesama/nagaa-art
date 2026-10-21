-- Nagaa Art: portfolio, categories, inquiries, admin profile + storage

create extension if not exists "pgcrypto";

-- Categories (built-in + custom)
create table if not exists public.categories (
  id text primary key,
  label text not null,
  is_builtin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Artworks (seed assets via image_key, uploads via image_url)
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer unique,
  title text not null,
  description text not null default '',
  medium text not null check (medium in ('leather', 'canvas')),
  category text not null references public.categories (id) on update cascade,
  dimensions text not null default '60 × 80 cm',
  year text not null default extract(year from now())::text,
  image_url text,
  image_key text,
  sort_order integer not null default 0,
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artworks_image_present check (
    coalesce(nullif(image_url, ''), nullif(image_key, '')) is not null
  )
);

create index if not exists artworks_category_idx on public.artworks (category);
create index if not exists artworks_sort_idx on public.artworks (sort_order, created_at desc);

-- Client commission inquiries
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  category text not null references public.categories (id) on update cascade,
  medium text not null check (medium in ('leather', 'canvas', 'both')),
  message text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

-- Single-row studio admin profile
create table if not exists public.admin_profile (
  id integer primary key default 1 check (id = 1),
  name text not null default 'Nagaa Abboomaa',
  role text not null default 'Master Artist',
  email text not null default 'admin@nagaa.art',
  phone text not null default '',
  avatar_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.admin_profile (id) values (1)
on conflict (id) do nothing;

-- Built-in categories
insert into public.categories (id, label, is_builtin) values
  ('personal', 'Personal & Family', true),
  ('hotel', 'Hotel & Lounge', true),
  ('school', 'School & Heritage', true),
  ('hospital', 'Hospital & Clinic', true),
  ('other', 'Other / Custom', true)
on conflict (id) do nothing;

-- Seed artworks (resolved in frontend via image_key → local asset)
insert into public.artworks (
  legacy_id, title, description, medium, category, dimensions, year, image_key, sort_order, is_seed
) values
  (0, 'Cultural Leather Portrait - Dr. Ali Birra', '', 'leather', 'personal', '60 × 85 cm', '2024', 'real_art_ali_birra_leather', 0, true),
  (1, 'Cultural Leather Portrait - Hachalu Hundessa', '', 'leather', 'personal', '55 × 75 cm', '2024', 'real_art_leather_hachalu', 1, true),
  (2, 'Leadership & Honor Leather Portrait', '', 'leather', 'other', '50 × 70 cm', '2024', 'real_art_leader_leather', 2, true),
  (3, 'Modern School Mural', '', 'canvas', 'school', '12 × 4 m', '2024', 'real_art_school_mural', 3, true),
  (4, 'Irreecha & Great Odaa Tree Mural', '', 'canvas', 'hotel', '8 × 3.5 m', '2024', 'real_art_irreecha_mural', 4, true),
  (5, 'Elora Coffee Hall Mural', '', 'canvas', 'hotel', '5 × 2.6 m', '2025', 'real_art_elora_coffee', 5, true),
  (6, 'Grand Renaissance Dam Landscape Mural', '', 'canvas', 'hospital', '6 × 2.8 m', '2025', 'real_art_dam_landscape', 6, true),
  (7, 'Contemporary Cafe Mural', '', 'canvas', 'hotel', '4 × 3 m', '2025', 'real_art_cafe_mural', 7, true),
  (8, 'Live Canvas Portrait - Hachalu Hundessa', '', 'canvas', 'personal', '70 × 90 cm', '2025', 'real_art_live_canvas', 8, true),
  (9, 'Oromo Girl & Iliili Flower Mural', '', 'canvas', 'school', '3 × 1.2 m', '2025', 'real_art_oromo_girl_mural', 9, true),
  (10, 'Honored Elder Portrait', '', 'canvas', 'hospital', '50 × 65 cm', '2025', 'real_art_elder_framed', 10, true),
  (11, 'Color Portrait Study', '', 'canvas', 'personal', '40 × 60 cm', '2025', 'real_art_portrait_color', 11, true),
  (12, 'School Evolution Mural', '', 'canvas', 'school', '8 × 2.5 m', '2025', 'real_art_evolution_school_mural', 12, true),
  (13, 'Olii Salon Business Mural', '', 'canvas', 'hotel', '4 × 3 m', '2025', 'real_art_olii_salon_mural', 13, true),
  (14, 'Wildlife Safari Painting', '', 'canvas', 'hospital', '120 × 90 cm', '2025', 'real_art_wildlife_safari', 14, true)
on conflict (legacy_id) do nothing;

-- Demo inquiries
insert into public.inquiries (name, phone, category, medium, message, status, created_at)
select * from (values
  (
    'Tolosa Bekele',
    '+251 911 234 567',
    'school',
    'leather',
    'Mana barumsaa keenyaaf suuraa Abbaa Gadaa gogaa loonii fi muka dhiheetiin qophaa''e hojjechiisuu barbaanna.',
    'pending',
    '2026-10-16 14:30:00+00'::timestamptz
  ),
  (
    'Aster Dibaba',
    '+251 922 876 543',
    'hotel',
    'canvas',
    'Hoteela keenyaaf galma keessummootaa miidhagsuuf suuraa callee fi aadaa Oromoo bal''ina 80x120cm barbaanna.',
    'in_progress',
    '2026-10-15 10:15:00+00'::timestamptz
  ),
  (
    'Dr. Fayisaa Hundee',
    '+251 933 456 789',
    'hospital',
    'canvas',
    'Kutaa da''umsaa hospitaala keenyaaf suuraa nagaa fi jaalala haadhaa fi daa''imaa calaqqisiisu.',
    'completed',
    '2026-10-14 09:00:00+00'::timestamptz
  ),
  (
    'Obsaa & Caaltuu',
    '+251 944 112 233',
    'personal',
    'leather',
    'Ayyaana gaa''ela keenyaaf suuraa maatii gogaa irratti muka aadaatiin qophaa''e nuuf hojjedhaa.',
    'pending',
    '2026-10-17 11:20:00+00'::timestamptz
  )
) as seed(name, phone, category, medium, message, status, created_at)
where not exists (select 1 from public.inquiries limit 1);

-- Storage bucket for uploaded artwork / avatar images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artworks',
  'artworks',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS
alter table public.categories enable row level security;
alter table public.artworks enable row level security;
alter table public.inquiries enable row level security;
alter table public.admin_profile enable row level security;

-- Public read for gallery content
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read artworks" on public.artworks;
create policy "Public read artworks"
  on public.artworks for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read admin profile" on public.admin_profile;
create policy "Public read admin profile"
  on public.admin_profile for select
  to anon, authenticated
  using (true);

-- Inquiries: anyone can submit; only authenticated admins manage
drop policy if exists "Public insert inquiries" on public.inquiries;
create policy "Public insert inquiries"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Auth read inquiries" on public.inquiries;
create policy "Auth read inquiries"
  on public.inquiries for select
  to authenticated
  using (true);

drop policy if exists "Auth update inquiries" on public.inquiries;
create policy "Auth update inquiries"
  on public.inquiries for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth delete inquiries" on public.inquiries;
create policy "Auth delete inquiries"
  on public.inquiries for delete
  to authenticated
  using (true);

-- Authenticated admin write access for gallery management
drop policy if exists "Auth write categories" on public.categories;
create policy "Auth write categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth write artworks" on public.artworks;
create policy "Auth write artworks"
  on public.artworks for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth update admin profile" on public.admin_profile;
create policy "Auth update admin profile"
  on public.admin_profile for update
  to authenticated
  using (true)
  with check (true);

-- Storage policies
drop policy if exists "Public read artwork files" on storage.objects;
create policy "Public read artwork files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'artworks');

drop policy if exists "Auth upload artwork files" on storage.objects;
create policy "Auth upload artwork files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'artworks');

drop policy if exists "Auth update artwork files" on storage.objects;
create policy "Auth update artwork files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'artworks')
  with check (bucket_id = 'artworks');

drop policy if exists "Auth delete artwork files" on storage.objects;
create policy "Auth delete artwork files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'artworks');

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists artworks_set_updated_at on public.artworks;
create trigger artworks_set_updated_at
  before update on public.artworks
  for each row execute function public.set_updated_at();

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

drop trigger if exists admin_profile_set_updated_at on public.admin_profile;
create trigger admin_profile_set_updated_at
  before update on public.admin_profile
  for each row execute function public.set_updated_at();
