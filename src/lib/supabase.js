import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const browserKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

function normalizeProjectUrl(value) {
  return String(value || '')
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '')
}

export const supabaseUrl = normalizeProjectUrl(rawUrl)
export const configIssue = !rawUrl || !browserKey
  ? 'Supabase belum dikonfigurasi.'
  : !/^https?:\/\//i.test(supabaseUrl)
    ? 'URL Supabase harus diawali http:// atau https://.'
    : ''

export const isSupabaseConfigured = !configIssue

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, browserKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function normalizeLoginId(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
}

export function loginIdToInternalEmail(loginId) {
  return `${normalizeLoginId(loginId)}@auth.teman-cerita.internal`
}

async function getFunctionSession(forceRefresh = false) {
  if (!supabase) throw new Error(configIssue || 'Supabase belum dikonfigurasi.')

  let result = forceRefresh
    ? await supabase.auth.refreshSession()
    : await supabase.auth.getSession()
  let session = result.data?.session

  const expiresSoon = session?.expires_at && session.expires_at * 1000 <= Date.now() + 60_000
  if (!forceRefresh && expiresSoon) {
    result = await supabase.auth.refreshSession()
    session = result.data?.session
  }

  if (result.error || !session?.access_token) {
    throw new Error('Sesi Anda telah berakhir. Silakan masuk kembali.')
  }

  return session
}

async function functionErrorMessage(error) {
  try {
    const detail = await error?.context?.clone?.().json()
    if (detail?.error) return String(detail.error)
  } catch {
    // Respons non-JSON akan menggunakan pesan bawaan SDK.
  }
  return error?.message || 'Operasi gagal.'
}

export async function invokeAuthenticatedFunction(name, body) {
  let session = await getFunctionSession()

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { data, error } = await supabase.functions.invoke(name, {
      body,
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    if (!error && !data?.error) return data

    const message = data?.error || await functionErrorMessage(error)
    const invalidSession = /sesi (tidak valid|tidak ditemukan|telah berakhir)/i.test(message)
    if (attempt === 0 && invalidSession) {
      session = await getFunctionSession(true)
      continue
    }

    throw new Error(invalidSession ? 'Sesi Anda telah berakhir. Silakan masuk kembali.' : message)
  }

  throw new Error('Operasi gagal.')
}
