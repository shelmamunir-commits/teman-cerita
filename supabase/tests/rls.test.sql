begin;
create extension if not exists pgtap with schema extensions;
select plan(10);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, created_at, updated_at)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student@test.invalid', '', now(), now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@test.invalid', '', now(), now()),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sysadmin@test.invalid', '', now(), now()),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ustadzah@test.invalid', '', now(), now());

insert into public.profiles (id, school_id, login_id, full_name, role_id, must_change_password)
select '10000000-0000-0000-0000-000000000001', s.id, 'student-test', 'Student Test', r.id, false from public.schools s join public.roles r on r.school_id = s.id and r.system_key = 'student'
union all
select '10000000-0000-0000-0000-000000000002', s.id, 'admin-test', 'Admin Test', r.id, false from public.schools s join public.roles r on r.school_id = s.id and r.system_key = 'admin'
union all
select '10000000-0000-0000-0000-000000000003', s.id, 'sysadmin-test', 'Sysadmin Test', r.id, false from public.schools s join public.roles r on r.school_id = s.id and r.system_key = 'sysadmin'
union all
select '10000000-0000-0000-0000-000000000004', s.id, 'ustadzah-test', 'Ustadzah Test', r.id, false from public.schools s join public.roles r on r.school_id = s.id and r.system_key = 'ustadzah';

update public.profiles set class_name = 'Kelas A' where id = '10000000-0000-0000-0000-000000000001';

select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
insert into public.screening_submissions (instrument, category, domain_scores) values ('Test Student', 'low', '{}');
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
insert into public.screening_submissions (instrument, category, domain_scores) values ('Test Admin Seed', 'mid', '{}');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.profiles', array[1::bigint], 'Santri hanya melihat profil sendiri');
select results_eq('select count(*)::bigint from public.screening_submissions', array[1::bigint], 'Santri hanya melihat skrining sendiri');
select lives_ok($$insert into public.screening_submissions (instrument, category) values ('Test Own Insert', 'low')$$, 'Santri dapat mengirim skrining sendiri');
select lives_ok($$update public.profiles set address = 'Alamat', birth_date = '2005-01-01', campus = 'Kampus', semester = 3, study_program = 'Program Studi', guardian_name = 'Nama Wali', guardian_relationship = 'Ibu', guardian_phone = '081234567890' where id = '10000000-0000-0000-0000-000000000001'$$, 'Santri dapat melengkapi profil sendiri');
select results_eq($$select count(*)::bigint from public.profiles where profile_completed_at is not null$$, array[1::bigint], 'Profil lengkap ditandai otomatis');

select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.profiles', array[4::bigint], 'Admin melihat profil satu Pesma');
select results_eq('select count(*)::bigint from public.screening_submissions', array[3::bigint], 'Admin melihat semua ringkasan skrining');
select throws_ok($$insert into public.screening_submissions (instrument, category) values ('Admin Forbidden', 'low')$$, '42501', null, 'Admin baca-saja tidak dapat mengirim skrining');

select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000004","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.profiles', array[1::bigint], 'Ustadzah hanya melihat profil santri');
select results_eq('select count(*)::bigint from public.screening_submissions', array[0::bigint], 'Ustadzah tanpa izin dashboard tidak melihat skrining');

select * from finish();
rollback;
