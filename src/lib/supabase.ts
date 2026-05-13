import { createClient } from '@supabase/supabase-js'

// Estos valores son públicos por diseño: la `publishable key` está pensada
// para ir embebida en el frontend. Lo que protege los datos es:
//  1) Toda la API de la app va por funciones SQL (RPC) con security definer.
//  2) La tabla `sync_buckets` está bloqueada al rol `anon`.
//  3) El acceso a un bucket exige conocer el código de 4 caracteres.
export const SUPABASE_URL = 'https://iyyboijoscgctzagjeuz.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_12b39w6BblBeliWRw-rcJw_NemrDMC_'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }, // no usamos auth de Supabase
})

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

export function generatePairingCode(): string {
  let s = ''
  const arr = new Uint8Array(4)
  crypto.getRandomValues(arr)
  for (let i = 0; i < 4; i++) s += ALPHABET[arr[i] % ALPHABET.length]
  return s
}

export function isValidCode(code: string): boolean {
  return /^[2-9A-HJ-NP-Z]{4}$/.test(code)
}

// ---------------- RPC wrappers ----------------

export async function bucketCreate(code: string): Promise<void> {
  const { error } = await supabase.rpc('bucket_create', { p_code: code })
  if (error) throw error
}

export interface BucketRow {
  payload: Record<string, unknown>
  updated_at: string // ISO timestamp
}

export async function bucketGet(code: string): Promise<BucketRow | null> {
  const { data, error } = await supabase.rpc('bucket_get', { p_code: code })
  if (error) throw error
  if (!data || (Array.isArray(data) && data.length === 0)) return null
  const row = Array.isArray(data) ? data[0] : data
  return { payload: row.payload, updated_at: row.updated_at }
}

export async function bucketSet(
  code: string,
  payload: Record<string, unknown>,
  expectedUpdatedAt?: string | null,
): Promise<string> {
  const { data, error } = await supabase.rpc('bucket_set', {
    p_code: code,
    p_payload: payload,
    p_expected_updated_at: expectedUpdatedAt ?? null,
  })
  if (error) throw error
  return data as string
}
