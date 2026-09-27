import { authenticate, corsHeaders, errorStatus, internalEmail, isValidPassword, json, normalizeLoginId, requirePermission, temporaryPassword } from '../_shared/common.ts'

const permissionForAction: Record<string, string> = {
  'create-user': 'users.create',
  'update-user': 'users.update',
  'reset-password': 'users.reset_password',
  'import-users': 'users.import',
  'create-role': 'roles.manage',
  'update-role': 'roles.manage',
}

async function audit(client, profile, action: string, targetType: string, targetId?: string, details = {}) {
  await client.from('audit_logs').insert({ school_id: profile.school_id, actor_id: profile.id, action, target_type: targetType, target_id: targetId, details })
}

async function createUser(client, actor, input) {
  const loginId = normalizeLoginId(input.login_id)
  const fullName = String(input.full_name || '').trim()
  const className = String(input.class_name || '').trim()
  if (loginId.length < 3 || loginId.length > 50) throw new Error('ID pengguna harus terdiri dari 3–50 karakter.')
  if (fullName.length < 2 || fullName.length > 120 || !input.role_id) throw new Error('Nama 2–120 karakter dan role wajib diisi.')
  if (className.length > 80) throw new Error('Kelas maksimal 80 karakter.')
  const { data: role } = await client.from('roles').select('id').eq('id', input.role_id).eq('school_id', actor.school_id).single()
  if (!role) throw new Error('Role tidak valid.')
  const { data: duplicate } = await client.from('profiles').select('id').eq('school_id', actor.school_id).eq('login_id', loginId).maybeSingle()
  if (duplicate) throw new Error(`ID ${loginId} sudah terdaftar.`)
  const customPassword = input.password_mode === 'custom'
  if (customPassword && !isValidPassword(input.password)) {
    throw new Error('Sandi custom harus terdiri dari 10–72 karakter serta mengandung huruf besar, huruf kecil, dan angka.')
  }
  const password = customPassword ? input.password : temporaryPassword()
  const mustChangePassword = !customPassword
  const { data: authData, error: authError } = await client.auth.admin.createUser({ email: internalEmail(loginId), password, email_confirm: true })
  if (authError) throw authError
  const { error: profileError } = await client.from('profiles').insert({ id: authData.user.id, school_id: actor.school_id, login_id: loginId, full_name: fullName, class_name: className || null, role_id: input.role_id, must_change_password: mustChangePassword })
  if (profileError) { await client.auth.admin.deleteUser(authData.user.id); throw profileError }
  await audit(client, actor, 'user.created', 'user', authData.user.id, { login_id: loginId, password_mode: customPassword ? 'custom' : 'generated' })
  return {
    login_id: loginId,
    temporary_password: customPassword ? undefined : password,
    must_change_password: mustChangePassword,
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { client, profile: actor } = await authenticate(req)
    if (actor.must_change_password) throw new Error('Ganti sandi sementara terlebih dahulu.')
    const body = await req.json()
    const permission = permissionForAction[body.action]
    if (!permission) return json({ error: 'Aksi tidak dikenal.' }, 400)
    await requirePermission(client, actor.role_id, permission)

    if (body.action === 'create-user') {
      await requirePermission(client, actor.role_id, 'roles.assign')
      return json(await createUser(client, actor, body.profile || {}))
    }

    if (body.action === 'update-user') {
      const input = body.profile || {}
      const { data: target } = await client.from('profiles').select('id, full_name, class_name, role_id, status, roles(system_key)').eq('id', body.user_id).eq('school_id', actor.school_id).single()
      if (!target) throw new Error('Pengguna tidak ditemukan.')
      const nextRole = input.role_id || target.role_id
      const nextStatus = input.status || target.status
      const nextName = String(input.full_name || '').trim()
      const nextClass = String(input.class_name || '').trim()
      if (nextName.length < 2 || nextName.length > 120) throw new Error('Nama harus terdiri dari 2–120 karakter.')
      if (nextClass.length > 80) throw new Error('Kelas maksimal 80 karakter.')
      if (nextRole !== target.role_id) await requirePermission(client, actor.role_id, 'roles.assign')
      if (nextStatus !== target.status) await requirePermission(client, actor.role_id, 'users.deactivate')
      if (target.id === actor.id && (nextRole !== target.role_id || nextStatus !== target.status)) {
        throw new Error('Role atau status akun yang sedang digunakan harus diubah oleh Sysadmin lain.')
      }
      if (target.roles?.system_key === 'sysadmin' && (nextRole !== target.role_id || nextStatus !== 'active')) {
        const { count } = await client.from('profiles').select('id, roles!inner(system_key)', { count: 'exact', head: true }).eq('school_id', actor.school_id).eq('status', 'active').eq('roles.system_key', 'sysadmin')
        if ((count || 0) <= 1) throw new Error('Sysadmin aktif terakhir tidak boleh dinonaktifkan atau diganti role.')
      }
      const patch = { full_name: nextName, class_name: nextClass || null, role_id: nextRole, status: nextStatus, updated_at: new Date().toISOString() }
      const { error } = await client.from('profiles').update(patch).eq('id', target.id).eq('school_id', actor.school_id)
      if (error) throw error
      if (nextStatus !== target.status) {
        const { error: authError } = await client.auth.admin.updateUserById(target.id, { ban_duration: nextStatus === 'active' ? 'none' : '876000h' })
        if (authError) {
          await client.from('profiles').update({ full_name: target.full_name, class_name: target.class_name, role_id: target.role_id, status: target.status, updated_at: new Date().toISOString() }).eq('id', target.id)
          throw authError
        }
      }
      await audit(client, actor, 'user.updated', 'user', target.id, { role_id: nextRole, status: nextStatus })
      return json({ ok: true })
    }

    if (body.action === 'reset-password') {
      const { data: target } = await client.from('profiles').select('id, login_id, must_change_password').eq('id', body.user_id).eq('school_id', actor.school_id).single()
      if (!target) throw new Error('Pengguna tidak ditemukan.')
      if (target.id === actor.id) throw new Error('Gunakan menu Profil Saya untuk mengganti sandi akun yang sedang digunakan.')
      const password = temporaryPassword()
      const { error: profileError } = await client.from('profiles').update({ must_change_password: true, updated_at: new Date().toISOString() }).eq('id', target.id)
      if (profileError) throw profileError
      const { error } = await client.auth.admin.updateUserById(target.id, { password })
      if (error) {
        await client.from('profiles').update({ must_change_password: target.must_change_password, updated_at: new Date().toISOString() }).eq('id', target.id)
        throw error
      }
      await audit(client, actor, 'user.password_reset', 'user', target.id)
      return json({ login_id: target.login_id, temporary_password: password })
    }

    if (body.action === 'import-users') {
      await requirePermission(client, actor.role_id, 'roles.assign')
      if (!Array.isArray(body.rows)) throw new Error('Data impor tidak valid.')
      const { data: roles } = await client.from('roles').select('id, name, system_key').eq('school_id', actor.school_id)
      const byName = new Map((roles || []).map((role) => [role.name.toLowerCase(), role]))
      const studentRole = (roles || []).find((role) => role.system_key === 'student')
      const credentials = []; const results = []
      for (const row of (body.rows || []).slice(0, 1000)) {
        try {
          const role = row.role ? byName.get(String(row.role).toLowerCase()) : studentRole
          if (!role) throw new Error('Role tidak ditemukan.')
          const credential = await createUser(client, actor, { login_id: row.id_santri, full_name: row.nama_lengkap, class_name: row.kelas, role_id: role.id })
          credentials.push(credential); results.push({ row: row._row, status: 'created' })
        } catch (error) { results.push({ row: row._row, status: 'failed', error: error.message }) }
      }
      await audit(client, actor, 'users.imported', 'user_batch', undefined, { created: credentials.length, total: body.rows?.length || 0 })
      return json({ credentials, results })
    }

    if (body.action === 'create-role') {
      const name = String(body.role?.name || '').trim()
      if (name.length < 2 || name.length > 80) throw new Error('Nama role harus terdiri dari 2–80 karakter.')
      const permissionIds = Array.isArray(body.role?.permission_ids) ? body.role.permission_ids : []
      const { data: role, error } = await client.from('roles').insert({ school_id: actor.school_id, name }).select('id').single()
      if (error) throw error
      if (permissionIds.length) {
        const { error: grantError } = await client.from('role_permissions').insert(permissionIds.map((permission_id) => ({ role_id: role.id, permission_id })))
        if (grantError) { await client.from('roles').delete().eq('id', role.id); throw grantError }
      }
      await audit(client, actor, 'role.created', 'role', role.id, { name })
      return json({ id: role.id })
    }

    if (body.action === 'update-role') {
      const { data: role } = await client.from('roles').select('id, is_system').eq('id', body.role_id).eq('school_id', actor.school_id).single()
      if (!role) throw new Error('Role tidak ditemukan.')
      if (role.is_system) throw new Error('Role bawaan tidak dapat diubah.')
      const name = String(body.role?.name || '').trim()
      if (name.length < 2 || name.length > 80) throw new Error('Nama role harus terdiri dari 2–80 karakter.')
      const permissionIds = Array.isArray(body.role?.permission_ids) ? body.role.permission_ids : []
      const { error } = await client.rpc('replace_custom_role_permissions', { target_role: role.id, new_name: name, permission_ids: permissionIds })
      if (error) throw error
      await audit(client, actor, 'role.updated', 'role', role.id)
      return json({ ok: true })
    }
  } catch (error) {
    return json({ error: error.message || 'Operasi gagal.' }, errorStatus(error))
  }
})
