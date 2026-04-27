import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { applyImport, parseChunk, summarizeImport, unpackChunks, type ChunkInfo } from '../lib/sync'

interface Props {
  onClose: () => void
}

export function QrScan({ onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<QrScanner | null>(null)
  const [collected, setCollected] = useState<Record<number, ChunkInfo>>({})
  const [total, setTotal] = useState(0)
  const [id, setId] = useState<string>('')
  const [err, setErr] = useState<string | null>(null)
  const [done, setDone] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const sc = new QrScanner(
      v,
      (result) => {
        const c = parseChunk(result.data)
        if (!c) return
        setId((cur) => (cur ? cur : c.id))
        setTotal(c.total)
        setCollected((prev) => {
          if (Object.keys(prev).length > 0) {
            const first = Object.values(prev)[0]
            if (first.id !== c.id) return { [c.index]: c }
          }
          return { ...prev, [c.index]: c }
        })
      },
      { highlightScanRegion: true, highlightCodeOutline: true, returnDetailedScanResult: true },
    )
    scannerRef.current = sc
    sc.start().catch((e) => setErr(String(e?.message ?? e)))
    return () => {
      sc.stop()
      sc.destroy()
    }
  }, [])

  useEffect(() => {
    if (total > 0 && Object.keys(collected).length === total) {
      const arr = Object.values(collected)
      const data = unpackChunks(arr)
      if (data) {
        setDone(data)
        scannerRef.current?.stop()
      } else {
        setErr('No se pudo reconstruir los datos. Inténtalo de nuevo.')
      }
    }
  }, [collected, total])

  const summary = done ? summarizeImport(done) : null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Importar por QR</h3>
          <button onClick={onClose} className="text-2xl leading-none px-2 text-slate-400">×</button>
        </div>
        {!done ? (
          <>
            <video ref={videoRef} className="w-full rounded-lg bg-black aspect-square object-cover" />
            <div className="text-xs text-slate-500 text-center">
              {total === 0 ? 'Apunta al QR del otro dispositivo…' : `Lectura: ${Object.keys(collected).length}/${total} (id ${id})`}
            </div>
            {err && <div className="text-xs text-rose-600">{err}</div>}
          </>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-slate-700">
              ✅ Datos leídos. Esto sustituirá los datos de este dispositivo:
            </div>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• {summary!.sessions} sesiones marcadas</li>
              <li>• {summary!.weights} registros de peso</li>
              <li>• {summary!.meals} comidas marcadas</li>
            </ul>
            <div className="flex gap-2 justify-end">
              <button onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-100 text-sm">Cancelar</button>
              <button
                onClick={() => applyImport(done)}
                className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium"
              >
                Aplicar e importar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
