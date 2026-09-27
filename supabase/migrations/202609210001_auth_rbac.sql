create extension if not exists pgcrypto;
create schema if not exists private;

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  system_key text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  unique (school_id, name),
  unique (school_id, system_key)
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text not null
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete restrict,
  login_id text not null,
  full_name text not null,
  class_name text,
  role_id uuid not null references public.roles(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'inactive')),
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, login_id)
);

create table public.screening_submissions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  instrument text not null,
  source_code text,
  category text not null check (category in ('low', 'mid', 'high')),
  total_score numeric,
  domain_scores jsonb not null default '{}'::jsonb,
  summary text,
  submitted_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  school_id uuid not null references public.schools(id) on delete restrict,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index profiles_role_id_idx on public.profiles(role_id);
create index screening_user_submitted_idx on public.screening_submissions(user_id, submitted_at desc);
create index screening_school_category_idx on public.screening_submissions(school_id, category);
create index audit_school_created_idx on public.audit_logs(school_id, created_at desc);

insert into public.permissions (key, description) values
  ('profile.read_self', 'Lihat profil sendiri'),
  ('screening.create_self', 'Mengisi skrining sendiri'),
  ('screening.read_self', 'Lihat riwayat skrining sendiri'),
  ('wellbeing.use_self', 'Gunakan fitur pribadi di perangkat'),
  ('dashboard.read_all', 'Lihat dashboard seluruh santri'),
  ('users.read', 'Lihat daftar pengguna'),
  ('users.create', 'Tambah pengguna'),
  ('users.update', 'Ubah pengguna'),
  ('users.deactivate', 'Aktifkan atau nonaktifkan pengguna'),
  ('users.reset_password', 'Reset sandi pengguna'),
  ('users.import', 'Impor pengguna dari CSV'),
  ('roles.read', 'Lihat role'),
  ('roles.manage', 'Buat dan ubah role'),
  ('roles.assign', 'Tetapkan role pengguna'),
  ('audit.read', 'Lihat audit log');

do $$
declare
  school uuid;
  sysadmin_role uuid;
  admin_role uuid;
  student_role uuid;
begin
  insert into public.schools(name) values ('Pesma Nur Alannur') returning id into school;
  insert into public.roles(school_id, name, system_key, is_system) values
    (school, 'Sysadmin', 'sysadmin', true) returning id into sysadmin_role;
  insert into public.roles(school_id, name, system_key, is_system) values
    (school, 'Admin', 'admin', true) returning id into admin_role;
  insert into public.roles(school_id, name, system_key, is_system) values
    (school, 'Santri', 'student', true) returning id into student_role;

  insert into public.role_permissions(role_id, permission_id)
    select sysadmin_role, id from public.permissions;
  insert into public.role_permissions(role_id, permission_id)
    select admin_role, id from public.permissions where key in ('profile.read_self', 'dashboard.read_all');
  insert into public.role_permissions(role_id, permission_id)
    select student_role, id from public.permissions where key in ('profile.read_self', 'screening.create_self', 'screening.read_self', 'wellbeing.use_self');
end $$;

create or replace function private.current_profile()
returns public.profiles
language sql stable security definer
set search_path = ''
as $$ select p from public.profiles p where p.id = (select auth.uid()) $$;

create or replace function private.has_permission(requested text)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    join public.role_permissions rp on rp.role_id = p.role_id
    join public.permissions perm on perm.id = rp.permission_id
    where p.id = (select auth.uid())
      and p.status = 'active'
      and p.must_change_password = false
      and perm.key = requested
  )
$$;

create or replace function public.set_screening_school_id()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.user_id := auth.uid();
  select school_id into new.school_id from public.profiles where id = auth.uid();
  return new;
end $$;

create or replace function public.replace_custom_role_permissions(target_role uuid, new_name text, permission_ids uuid[])
returns void language plpgsql security definer set search_path = '' as $$
declare
  locked boolean;
begin
  select is_system into locked from public.roles where id = target_role for update;
  if locked is null then raise exception 'Role tidak ditemukan.'; end if;
  if locked then raise exception 'Role bawaan tidak dapat diubah.'; end if;
  update public.roles set name = trim(new_name) where id = target_role;
  delete from public.role_permissions where role_id = target_role;
  insert into public.role_permissions(role_id, permission_id)
    select target_role, p.permission_id from unnest(coalesce(permission_ids, array[]::uuid[])) as p(permission_id);
end $$;

revoke all on function public.replace_custom_role_permissions(uuid, text, uuid[]) from public, anon, authenticated;
grant execute on function public.replace_custom_role_permissions(uuid, text, uuid[]) to service_role;

create trigger screening_set_owner before insert on public.screening_submissions
for each row execute function public.set_screening_school_id();

alter table public.schools enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profiles enable row level security;
alter table public.screening_submissions enable row level security;
alter table public.audit_logs enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.schools, public.roles, public.permissions, public.role_permissions, public.profiles, public.screening_submissions, public.audit_logs to authenticated;
grant insert on public.screening_submissions to authenticated;
grant usage, select on sequence public.audit_logs_id_seq to authenticated;

create policy schools_same_school on public.schools for select to authenticated
using (id = (select (private.current_profile()).school_id));
create policy roles_same_school on public.roles for select to authenticated
using (
  school_id = (select (private.current_profile()).school_id)
  and (id = (select (private.current_profile()).role_id) or private.has_permission('roles.read') or private.has_permission('roles.manage') or private.has_permission('roles.assign'))
);
create policy permissions_authenticated on public.permissions for select to authenticated using (true);
create policy role_permissions_same_school on public.role_permissions for select to authenticated
using (
  role_id = (select (private.current_profile()).role_id)
  or (private.has_permission('roles.read') or private.has_permission('roles.manage'))
);
create policy profiles_self_or_authorized on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or (school_id = (select (private.current_profile()).school_id) and (private.has_permission('users.read') or private.has_permission('dashboard.read_all')))
);
create policy screenings_read_own_or_dashboard on public.screening_submissions for select to authenticated
using (
  (user_id = (select auth.uid()) and private.has_permission('screening.read_self'))
  or (school_id = (select (private.current_profile()).school_id) and private.has_permission('dashboard.read_all'))
);
create policy screenings_create_own on public.screening_submissions for insert to authenticated
with check (user_id = (select auth.uid()) and private.has_permission('screening.create_self'));
create policy audit_authorized on public.audit_logs for select to authenticated
using (school_id = (select (private.current_profile()).school_id) and private.has_permission('audit.read'));
