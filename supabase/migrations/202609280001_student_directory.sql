alter table public.profiles
  add column if not exists address text,
  add column if not exists birth_date date,
  add column if not exists campus text,
  add column if not exists semester smallint,
  add column if not exists study_program text,
  add column if not exists guardian_name text,
  add column if not exists guardian_relationship text,
  add column if not exists guardian_phone text,
  add column if not exists profile_completed_at timestamptz;

alter table public.profiles
  add constraint profiles_address_length check (address is null or char_length(address) <= 500),
  add constraint profiles_campus_length check (campus is null or char_length(campus) <= 120),
  add constraint profiles_semester_range check (semester is null or semester between 1 and 20),
  add constraint profiles_study_program_length check (study_program is null or char_length(study_program) <= 120),
  add constraint profiles_guardian_name_length check (guardian_name is null or char_length(guardian_name) <= 120),
  add constraint profiles_guardian_relationship_length check (guardian_relationship is null or char_length(guardian_relationship) <= 50),
  add constraint profiles_guardian_phone_length check (guardian_phone is null or char_length(guardian_phone) <= 30);

insert into public.permissions (key, description)
values ('students.read', 'Lihat direktori dan profil lengkap santri')
on conflict (key) do update set description = excluded.description;

insert into public.roles (school_id, name, system_key, is_system)
select s.id, 'Ustadzah', 'ustadzah', true from public.schools s
on conflict (school_id, name) do update
set system_key = excluded.system_key, is_system = true;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key = 'students.read'
where r.system_key in ('sysadmin', 'admin', 'ustadzah')
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key = 'profile.read_self'
where r.system_key = 'ustadzah'
on conflict do nothing;

create or replace function public.set_profile_completion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  role_key text;
begin
  select r.system_key into role_key from public.roles r where r.id = new.role_id;
  if role_key = 'student'
    and nullif(trim(new.full_name), '') is not null
    and nullif(trim(coalesce(new.class_name, '')), '') is not null
    and nullif(trim(coalesce(new.address, '')), '') is not null
    and new.birth_date is not null
    and nullif(trim(coalesce(new.campus, '')), '') is not null
    and new.semester is not null
    and nullif(trim(coalesce(new.study_program, '')), '') is not null
    and nullif(trim(coalesce(new.guardian_name, '')), '') is not null
    and nullif(trim(coalesce(new.guardian_relationship, '')), '') is not null
    and nullif(trim(coalesce(new.guardian_phone, '')), '') is not null then
    new.profile_completed_at := coalesce(new.profile_completed_at, now());
  elsif role_key = 'student' then
    new.profile_completed_at := null;
  end if;
  new.updated_at := now();
  return new;
end
$$;

drop trigger if exists profiles_set_completion on public.profiles;
create trigger profiles_set_completion
before insert or update on public.profiles
for each row execute function public.set_profile_completion();

revoke update on table public.profiles from authenticated;
grant update (address, birth_date, campus, semester, study_program, guardian_name, guardian_relationship, guardian_phone)
on public.profiles to authenticated;

create policy profiles_update_own_details on public.profiles
for update to authenticated
using (id = (select auth.uid()) and status = 'active')
with check (id = (select auth.uid()) and status = 'active');

drop policy if exists profiles_self_or_authorized on public.profiles;
create policy profiles_self_or_authorized on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or (
    school_id = (select (private.current_profile()).school_id)
    and (
      private.has_permission('users.read')
      or (
        (private.has_permission('dashboard.read_all') or private.has_permission('students.read'))
        and exists (
          select 1 from public.roles target_role
          where target_role.id = profiles.role_id and target_role.system_key = 'student'
        )
      )
    )
  )
);

drop policy if exists roles_same_school on public.roles;
create policy roles_same_school on public.roles for select to authenticated
using (
  school_id = (select (private.current_profile()).school_id)
  and (
    id = (select (private.current_profile()).role_id)
    or private.has_permission('roles.read')
    or private.has_permission('roles.manage')
    or private.has_permission('roles.assign')
    or (private.has_permission('students.read') and system_key = 'student')
  )
);

update public.profiles set updated_at = updated_at;
