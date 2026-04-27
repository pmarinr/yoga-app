import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { pack } from '../lib/sync'

interface Props {
  onClose: () => void
}

export function QrShare({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chunks, setChunks] = useState<string[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const { chunks: cs } = pack()
    setChunks(cs)
  }, [])

  useEffect(() => {
    if (chunks.length === 0) return
    QRCode.toCanvas(canvasRef.current, chunks[idx], {
      width: 280,
      margin: 1,
      errorCorrectionLevel: 'M',
    }).catch(() => {})
  }, [chunks, idx])

  useEffect(() => {
    if (chunks.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % chunks.length), 1500)
    return () => clearInterval(t)
  }, [chunks.length])

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 rounded-3xl max-w-sm w-full p-5 space-y-3 text-center shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Compartir por QR</h3>
          <button onClick={onClose} className="text-2xl leading-none px-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">×</button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Escanea con el otro dispositivo desde Ajustes → Importar por QR.
        </p>
        <canvas ref={canvasRef} className="mx-auto rounded-lg bg-white p-2" />
        {chunks.length > 1 && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Parte {idx + 1} de {chunks.length} · mantén el otro dispositivo apuntando hasta completar.
          </div>
        )}
        {chunks.length <= 1 && <div className="text-xs text-emerald-600 dark:text-emerald-400">Solo 1 código, listo en un escaneo.</div>}
      </div>
    </div>
  )
}
