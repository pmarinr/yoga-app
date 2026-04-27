import confetti from 'canvas-confetti'

export function fireConfetti(opts?: { particleCount?: number; spread?: number }) {
  const count = opts?.particleCount ?? 100
  confetti({
    particleCount: count,
    spread: opts?.spread ?? 70,
    origin: { y: 0.7 },
    zIndex: 1000,
  })
}

export function fireMilestoneConfetti() {
  const end = Date.now() + 800
  const colors = ['#0d9488', '#fbbf24', '#10b981', '#fb923c']
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors, zIndex: 1000 })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors, zIndex: 1000 })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
