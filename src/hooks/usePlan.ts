import { useMemo } from 'react'
import { buildPlan } from '../data/plan'
import { useGoals } from './useGoals'

export function usePlan() {
  const { goals } = useGoals()
  return useMemo(() => buildPlan(goals.weeks), [goals.weeks])
}
