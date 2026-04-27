const KEYS = ['yoga.sessions', 'yoga.weights', 'yoga.meals', 'yoga.startDate']

export function exportBackup() {
  const data: Record<string, unknown> = {}
  KEYS.forEach((k) => {
    const raw = localStorage.getItem(k)
    if (raw) data[k] = JSON.parse(raw)
  })
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `yoga-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text()
  const parsed = JSON.parse(text) as Record<string, unknown>
  KEYS.forEach((k) => {
    if (k in parsed) localStorage.setItem(k, JSON.stringify(parsed[k]))
  })
  window.location.reload()
}

export function clearAll() {
  KEYS.forEach((k) => localStorage.removeItem(k))
  window.location.reload()
}
