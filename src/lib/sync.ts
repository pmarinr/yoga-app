import LZString from 'lz-string'

const KEYS = [
  'yoga.sessions',
  'yoga.weights',
  'yoga.meals',
  'yoga.startDate',
  'yoga.dietSeeds',
  'yoga.dietOverrides',
  'yoga.dietDone',
  'yoga.badgesSeen',
  'yoga.reminderTime',
] as const

export interface ChunkInfo {
  id: string
  index: number
  total: number
  payload: string
}

const CHUNK_SIZE = 700 // caracteres alfanuméricos seguros para QR

export function pack(): { compressed: string; chunks: string[]; id: string } {
  const data: Record<string, unknown> = {}
  KEYS.forEach((k) => {
    const raw = localStorage.getItem(k)
    if (raw !== null) {
      try {
        data[k] = JSON.parse(raw)
      } catch {
        data[k] = raw
      }
    }
  })
  const json = JSON.stringify(data)
  const compressed = LZString.compressToBase64(json)
  const id = Math.random().toString(36).slice(2, 6).toUpperCase()
  const total = Math.ceil(compressed.length / CHUNK_SIZE)
  const chunks: string[] = []
  for (let i = 0; i < total; i++) {
    const slice = compressed.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    chunks.push(`YOGA|${id}|${i + 1}/${total}|${slice}`)
  }
  return { compressed, chunks, id }
}

export function parseChunk(text: string): ChunkInfo | null {
  if (!text.startsWith('YOGA|')) return null
  const parts = text.split('|')
  if (parts.length < 4) return null
  const [, id, ratio, ...rest] = parts
  const [iStr, nStr] = ratio.split('/')
  const index = Number(iStr)
  const total = Number(nStr)
  if (!isFinite(index) || !isFinite(total)) return null
  return { id, index, total, payload: rest.join('|') }
}

export function unpackChunks(chunks: ChunkInfo[]): Record<string, unknown> | null {
  if (chunks.length === 0) return null
  const id = chunks[0].id
  const total = chunks[0].total
  const buf = new Array<string>(total)
  for (const c of chunks) {
    if (c.id !== id) return null
    buf[c.index - 1] = c.payload
  }
  if (buf.some((s) => s === undefined)) return null
  const compressed = buf.join('')
  const json = LZString.decompressFromBase64(compressed)
  if (!json) return null
  try {
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function applyImport(data: Record<string, unknown>) {
  KEYS.forEach((k) => {
    if (k in data) localStorage.setItem(k, JSON.stringify(data[k]))
  })
  window.location.reload()
}

export function summarizeImport(data: Record<string, unknown>) {
  const sessions = data['yoga.sessions'] as Record<string, { done: boolean }> | undefined
  const weights = data['yoga.weights'] as unknown[] | undefined
  const meals = data['yoga.dietDone'] as Record<string, boolean> | undefined
  return {
    sessions: sessions ? Object.values(sessions).filter((s) => s.done).length : 0,
    weights: weights?.length ?? 0,
    meals: meals ? Object.values(meals).filter(Boolean).length : 0,
  }
}
