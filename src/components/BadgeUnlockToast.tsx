import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import type { Badge } from '../data/badges'
import { fireMilestoneConfetti } from './Confetti'

interface Props {
  badges: Badge[]
  onDismiss: () => void
}

export function BadgeUnlockToast({ badges, onDismiss }: Props) {
  useEffect(() => {
    if (badges.length > 0) fireMilestoneConfetti()
  }, [badges])

  return (
    <AnimatePresence>
      {badges.length > 0 && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.7, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 rounded-3xl p-6 max-w-sm w-full text-center space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
              {badges.length === 1 ? '¡Nueva medalla!' : `¡${badges.length} medallas nuevas!`}
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {badges.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-5xl">{b.icon}</div>
                  <div className="text-sm font-medium mt-1">{b.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{b.desc}</div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium"
            >
              ¡Genial!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
