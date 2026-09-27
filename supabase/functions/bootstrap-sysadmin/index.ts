import { corsHeaders, internalEmail, json, normalizeLoginId, serviceClient, temporaryPassword } from '../_shared/common.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    if (req.headers.get('x-bootstrap-secret') !== Deno.env.get('BOOTSTRAP_SECRET')) return json({ error: 'Tidak diizinkan.' }, 401)
    const client = serviceClient()
    const { count } = await client.from('profiles').select('id', { count: 'exact', head: true })
    if ((count || 0) > 0) return json({ error: 'Bootstrap hanya dapat dijalankan saat belum ada akun.' }, 409)
    const body = await req.json()
    const loginId = normalizeLoginId(body.login_id)
    if (!loginId || !body.full_name) return json({ error: 'login_id dan full_name wajib diisi.' }, 400)
    const { data: school } = await client.from('schools').select('id').limit(1).single()
    const { data: role } = await client.from('roles').select('id').eq('school_id', school.id).eq('system_key', 'sysadmin').single()
    const password = temporaryPassword()
    const { data: authData, error: authError } = await client.auth.admin.createUser({ email: internalEmail(loginId), password, email_confirm: true })
    if (authError) throw authError
    const { error } = await client.from('profiles').insert({ id: authData.user.id, school_id: school.id, login_id: loginId, full_name: String(body.full_name).trim(), class_name: null, role_id: role.id })
    if (error) { await client.auth.admin.deleteUser(authData.user.id); throw error }
    return json({ login_id: loginId, temporary_password: password })
  } catch (error) {
    return json({ error: error.message || 'Bootstrap gagal.' }, 400)
  }
})
