import { authenticate, corsHeaders, errorStatus, json } from '../_shared/common.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { client, user } = await authenticate(req)
    const { password } = await req.json()
    if (typeof password !== 'string' || password.length < 10 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      return json({ error: 'Sandi minimal 10 karakter serta harus mengandung huruf besar, huruf kecil, dan angka.' }, 400)
    }
    const { error } = await client.auth.admin.updateUserById(user.id, { password })
    if (error) throw error
    const { error: profileError } = await client.from('profiles').update({ must_change_password: false, updated_at: new Date().toISOString() }).eq('id', user.id)
    if (profileError) throw new Error('Sandi sudah diperbarui, tetapi status akun belum tersinkron. Coba simpan sekali lagi.')
    return json({ ok: true })
  } catch (error) {
    return json({ error: error.message || 'Sandi gagal diperbarui.' }, errorStatus(error))
  }
})
