-- EBH Training Academy Booking System
-- Run this inside Supabase SQL Editor.

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create type booking_status as enum ('pending', 'confirmed', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'cancelled');
create type payment_provider as enum ('mock', 'billplz', 'toyyibpay', 'manual');
create type payment_mode as enum ('deposit_50', 'full');

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  capacity text not null,
  description text,
  image_path text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  room_slug text not null,
  code text not null,
  name text not null,
  description text,
  package_type text not null check (package_type in ('short_term', 'long_term', 'bundle')),
  duration_hours numeric,
  price numeric(12,2) not null check (price >= 0),
  requires_hourly_input boolean not null default false,
  includes_meals boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique(room_slug, code)
);

create table if not exists add_ons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  unit text not null check (unit in ('pax', 'booking')),
  price numeric(12,2) not null check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text not null,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  customer_id uuid not null references customers(id),
  room_id uuid references rooms(id),
  package_id uuid references packages(id),
  room_slug text not null,
  package_code text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  booking_window tstzrange generated always as (tstzrange(start_at, end_at, '[)')) stored,
  pax int not null default 1 check (pax > 0),
  subtotal numeric(12,2) not null default 0,
  add_on_total numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  deposit_amount numeric(12,2) not null default 0,
  payment_mode payment_mode not null default 'deposit_50',
  status booking_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  google_event_id text,
  notes text,
  source text default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cancelled_at timestamptz,
  constraint booking_end_after_start check (end_at > start_at)
);

-- Prevent same room from being booked at overlapping times.
-- For bundle-all-rooms, the app should create/check every room calendar before confirmation.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'bookings_no_room_overlap') then
    alter table bookings
      add constraint bookings_no_room_overlap
      exclude using gist (room_id with =, booking_window with &&)
      where (status in ('pending', 'confirmed') and room_id is not null);
  end if;
end $$;

create table if not exists booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  item_type text not null default 'line_item' check (item_type in ('room', 'package', 'add_on', 'line_item')),
  label text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  provider payment_provider not null default 'mock',
  amount numeric(12,2) not null check (amount > 0),
  status payment_status not null default 'pending',
  external_ref text,
  checkout_url text,
  paid_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blocked_slots (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  reason text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  block_window tstzrange generated always as (tstzrange(start_at, end_at, '[)')) stored,
  google_event_id text,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint blocked_end_after_start check (end_at > start_at)
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'blocked_slots_no_overlap') then
    alter table blocked_slots
      add constraint blocked_slots_no_overlap
      exclude using gist (room_id with =, block_window with &&)
      where (room_id is not null);
  end if;
end $$;

create table if not exists admin_users (
  user_id uuid primary key,
  email text unique not null,
  full_name text,
  role text not null default 'admin' check (role in ('owner', 'admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_start_at on bookings(start_at);
create index if not exists idx_bookings_room_status on bookings(room_id, status);
create index if not exists idx_payments_booking_status on payments(booking_id, status);
create index if not exists idx_blocked_slots_room on blocked_slots(room_id, start_at, end_at);

-- updated_at helper
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_rooms_updated_at on rooms;
create trigger set_rooms_updated_at before update on rooms for each row execute function set_updated_at();

drop trigger if exists set_customers_updated_at on customers;
create trigger set_customers_updated_at before update on customers for each row execute function set_updated_at();

drop trigger if exists set_bookings_updated_at on bookings;
create trigger set_bookings_updated_at before update on bookings for each row execute function set_updated_at();

drop trigger if exists set_payments_updated_at on payments;
create trigger set_payments_updated_at before update on payments for each row execute function set_updated_at();

-- Seed rooms
insert into rooms (slug, name, capacity, description, image_path, sort_order) values
  ('training-room', 'Training Room', '20 pax', 'Training, seminar, workshop and course room.', '/images/training-room.jpg', 1),
  ('meeting-room', 'Meeting Room', '8 pax', 'Meeting, interview and coaching room.', '/images/meeting-room.jpg', 2),
  ('consultant-room', 'Consultant Room', 'Private', 'Private consultation and discussion room.', '/images/consultant-room.jpg', 3),
  ('bundle-all-rooms', 'Bundle Package', 'All rooms', 'Training Room + Meeting Room + Consultant Room all in one day.', '/images/hero-training.jpg', 4)
on conflict (slug) do update set
  name = excluded.name,
  capacity = excluded.capacity,
  description = excluded.description,
  image_path = excluded.image_path,
  sort_order = excluded.sort_order;

-- Seed packages
with room_map as (select id, slug from rooms)
insert into packages (room_id, room_slug, code, name, description, package_type, duration_hours, price, requires_hourly_input, includes_meals, sort_order) values
  ((select id from room_map where slug='training-room'), 'training-room', 'hourly', 'Hourly', 'RM80 / jam', 'short_term', null, 80, true, false, 1),
  ((select id from room_map where slug='training-room'), 'training-room', 'half-day', 'Half Day', '4 jam', 'short_term', 4, 300, false, false, 2),
  ((select id from room_map where slug='training-room'), 'training-room', 'full-day', 'Full Day', '8 jam tanpa makan', 'short_term', 8, 550, false, false, 3),
  ((select id from room_map where slug='training-room'), 'training-room', 'full-day-meals', 'Full Day + Meals', '20 pax, 2 tea break + lunch', 'short_term', 8, 1450, false, true, 4),
  ((select id from room_map where slug='training-room'), 'training-room', 'weekly-3', '3 Hari / Minggu', 'Long term weekly', 'long_term', null, 1350, false, false, 5),
  ((select id from room_map where slug='training-room'), 'training-room', 'weekly-5', '5 Hari / Minggu', 'Long term weekly', 'long_term', null, 2000, false, false, 6),
  ((select id from room_map where slug='training-room'), 'training-room', 'monthly-weekday', '1 Bulan Weekday', 'Isnin-Jumaat', 'long_term', null, 6500, false, false, 7),

  ((select id from room_map where slug='meeting-room'), 'meeting-room', 'hourly', 'Hourly', 'RM50 / jam', 'short_term', null, 50, true, false, 1),
  ((select id from room_map where slug='meeting-room'), 'meeting-room', 'half-day', 'Half Day', '4 jam', 'short_term', 4, 180, false, false, 2),
  ((select id from room_map where slug='meeting-room'), 'meeting-room', 'full-day', 'Full Day', '8 jam tanpa makan', 'short_term', 8, 350, false, false, 3),
  ((select id from room_map where slug='meeting-room'), 'meeting-room', 'full-day-meals', 'Full Day + Meals', '8 pax, 2 tea break + lunch', 'short_term', 8, 800, false, true, 4),
  ((select id from room_map where slug='meeting-room'), 'meeting-room', 'weekly-3', '3 Hari / Minggu', 'Long term weekly', 'long_term', null, 850, false, false, 5),
  ((select id from room_map where slug='meeting-room'), 'meeting-room', 'weekly-5', '5 Hari / Minggu', 'Long term weekly', 'long_term', null, 1250, false, false, 6),
  ((select id from room_map where slug='meeting-room'), 'meeting-room', 'monthly-weekday', '1 Bulan Weekday', 'Isnin-Jumaat', 'long_term', null, 3800, false, false, 7),

  ((select id from room_map where slug='consultant-room'), 'consultant-room', 'hourly', 'Hourly', 'RM30 / jam', 'short_term', null, 30, true, false, 1),
  ((select id from room_map where slug='consultant-room'), 'consultant-room', 'half-day', 'Half Day', '4 jam', 'short_term', 4, 100, false, false, 2),
  ((select id from room_map where slug='consultant-room'), 'consultant-room', 'full-day', 'Full Day', '8 jam', 'short_term', 8, 200, false, false, 3),
  ((select id from room_map where slug='consultant-room'), 'consultant-room', 'weekly-3', '3 Hari / Minggu', 'Long term weekly', 'long_term', null, 500, false, false, 4),
  ((select id from room_map where slug='consultant-room'), 'consultant-room', 'weekly-5', '5 Hari / Minggu', 'Long term weekly', 'long_term', null, 750, false, false, 5),
  ((select id from room_map where slug='consultant-room'), 'consultant-room', 'monthly-weekday', '1 Bulan Weekday', 'Isnin-Jumaat', 'long_term', null, 2000, false, false, 6),

  ((select id from room_map where slug='bundle-all-rooms'), 'bundle-all-rooms', 'bundle-day', 'All In 1 Day', 'Promo launch without meals', 'bundle', 8, 999, false, false, 1),
  ((select id from room_map where slug='bundle-all-rooms'), 'bundle-all-rooms', 'bundle-weekly-3', 'Weekly 3 Hari', 'All rooms', 'bundle', null, 2800, false, false, 2),
  ((select id from room_map where slug='bundle-all-rooms'), 'bundle-all-rooms', 'bundle-weekly-5', 'Weekly 5 Hari', 'All rooms', 'bundle', null, 4500, false, false, 3),
  ((select id from room_map where slug='bundle-all-rooms'), 'bundle-all-rooms', 'bundle-monthly', 'Monthly Corporate Rate', 'Full weekday access', 'bundle', null, 9800, false, false, 4)
on conflict (room_slug, code) do update set
  name = excluded.name,
  description = excluded.description,
  package_type = excluded.package_type,
  duration_hours = excluded.duration_hours,
  price = excluded.price,
  requires_hourly_input = excluded.requires_hourly_input,
  includes_meals = excluded.includes_meals,
  sort_order = excluded.sort_order;

insert into add_ons (code, name, unit, price) values
  ('coffee-tea', 'Coffee / Tea', 'pax', 8),
  ('tea-break', 'Tea Break', 'pax', 12),
  ('lunch', 'Lunch Packed/Food', 'pax', 25),
  ('full-day-meal', 'Full Day Meal Package', 'pax', 45)
on conflict (code) do update set name = excluded.name, unit = excluded.unit, price = excluded.price;

-- Basic Row Level Security. Keep service-role API for server mutations.
alter table rooms enable row level security;
alter table packages enable row level security;
alter table add_ons enable row level security;
alter table customers enable row level security;
alter table bookings enable row level security;
alter table booking_items enable row level security;
alter table payments enable row level security;
alter table blocked_slots enable row level security;
alter table admin_users enable row level security;

-- Public read for catalog data.
drop policy if exists "Public can read active rooms" on rooms;
create policy "Public can read active rooms" on rooms for select using (active = true);

drop policy if exists "Public can read active packages" on packages;
create policy "Public can read active packages" on packages for select using (active = true);

drop policy if exists "Public can read active add ons" on add_ons;
create policy "Public can read active add ons" on add_ons for select using (active = true);

-- Admin policy template. Create Supabase Auth users and insert them into admin_users.
drop policy if exists "Admins full access rooms" on rooms;
create policy "Admins full access rooms" on rooms for all using (exists (select 1 from admin_users where user_id = auth.uid() and active = true));

drop policy if exists "Admins full access packages" on packages;
create policy "Admins full access packages" on packages for all using (exists (select 1 from admin_users where user_id = auth.uid() and active = true));

drop policy if exists "Admins full access bookings" on bookings;
create policy "Admins full access bookings" on bookings for all using (exists (select 1 from admin_users where user_id = auth.uid() and active = true));
