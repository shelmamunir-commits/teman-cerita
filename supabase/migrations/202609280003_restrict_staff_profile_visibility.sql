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
