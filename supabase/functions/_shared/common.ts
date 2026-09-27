import { createClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-bootstrap-secret',
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}

export function serviceClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
}

export class RequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function errorStatus(error: unknown) {
  return error instanceof RequestError ? error.status : 400
}

export async function authenticate(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) throw new RequestError('Sesi tidak ditemukan.', 401)
  const client = serviceClient()
  const { data, error } = await client.auth.getUser(token)
  if (error || !data.user) throw new RequestError('Sesi tidak valid.', 401)
  const { data: profile } = await client.from('profiles').select('id, school_id, role_id, status, must_change_password').eq('id', data.user.id).single()
  if (!profile || profile.status !== 'active') throw new RequestError('Akun tidak aktif.', 403)
  return { client, user: data.user, profile }
}

export async function requirePermission(client: ReturnType<typeof serviceClient>, roleId: string, permission: string) {
  const { data } = await client.from('role_permissions').select('permissions!inner(key)').eq('role_id', roleId).eq('permissions.key', permission).maybeSingle()
  if (!data) throw new RequestError('Anda tidak memiliki izin untuk operasi ini.', 403)
}

export function normalizeLoginId(value: unknown) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')
}

export function internalEmail(loginId: string) {
  return `${normalizeLoginId(loginId)}@auth.teman-cerita.internal`
}

export function temporaryPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(12))
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  return `Tc!${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}
