
create table if not exists dogs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int, breed text, bio text, img text,
  contact_url text, contact_email text,
  good_with_kids boolean, good_with_dogs boolean, good_with_cats boolean,
  energy_level text
);
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  dog_id uuid references dogs(id) on delete cascade,
  created_at timestamp default now()
);
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid references dogs(id) on delete cascade,
  adopter_name text not null, adopter_email text not null,
  message text, created_at timestamp default now()
);
alter table inquiries enable row level security;
create policy if not exists inquiries_insert_public on inquiries for insert to public with check (true);
create policy if not exists inquiries_read_admin_only on inquiries for select to authenticated using ((auth.jwt() ->> 'email') = 'muttmeadoptablepets@gmail.com');
