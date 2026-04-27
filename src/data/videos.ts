export type Phase = 1 | 2 | 3
export type SessionType =
  | 'hatha'
  | 'vinyasa'
  | 'power'
  | 'restaurativo'
  | 'movilidad'
  | 'descanso'

export interface Video {
  id: string
  title: string
  youtubeId: string
  phase: Phase
  tag: SessionType | 'saludoSol' | 'core'
  durationMin?: number
}

export const VIDEOS: Video[] = [
  {
    id: 'hatha-principiantes',
    title: 'Hatha Yoga para principiantes',
    youtubeId: '5493DXBWq8M',
    phase: 1,
    tag: 'hatha',
  },
  {
    id: 'vinyasa-principiantes',
    title: 'Mi Primera Clase de Yoga Dinámico — Vinyasa para Principiantes',
    youtubeId: '7bGma50aUlI',
    phase: 1,
    tag: 'vinyasa',
  },
  {
    id: 'saludo-sol-principiantes',
    title: 'Saludo al sol paso a paso para principiantes',
    youtubeId: 'Pw8PYdZUlnI',
    phase: 1,
    tag: 'saludoSol',
  },
  {
    id: 'saludo-sol-dinamico',
    title: 'Variedades de saludo al sol dinámico',
    youtubeId: 'xOTzeh5K5uo',
    phase: 2,
    tag: 'saludoSol',
  },
  {
    id: 'fit-vinyasa-calorias',
    title: 'FIT Vinyasa — Clase para quemar calorías',
    youtubeId: 'uD_7Rj-I88M',
    phase: 2,
    tag: 'power',
  },
  {
    id: 'vinyasa-tonificar-45',
    title: 'Vinyasa Yoga para tonificar el cuerpo (45 min)',
    youtubeId: 'J2W_A7l3SMQ',
    phase: 2,
    tag: 'vinyasa',
    durationMin: 45,
  },
  {
    id: 'core-barco',
    title: 'Abdominales con yoga — Barco (Navasana)',
    youtubeId: 'UKV3fhN1G9g',
    phase: 2,
    tag: 'core',
  },
  {
    id: 'fit-planchas',
    title: 'FIT + Yoga con planchas — Tonificar abdominales',
    youtubeId: 'y5F5hkEbTGs',
    phase: 2,
    tag: 'core',
  },
  {
    id: 'fit-adelgazar',
    title: 'FIT + Yoga para Adelgazar',
    youtubeId: 'yhfFvzjKnj0',
    phase: 3,
    tag: 'power',
  },
  {
    id: 'yoga-tranquilo',
    title: 'Yoga tranquilo para reconectar con tu cuerpo',
    youtubeId: 'nUUn1C0L7RY',
    phase: 3,
    tag: 'movilidad',
  },
  {
    id: 'restaurativo-30',
    title: 'Yoga Restaurativo Suave & Relajante (30 min)',
    youtubeId: '2jqyPWn99E4',
    phase: 3,
    tag: 'restaurativo',
    durationMin: 30,
  },
]

export const videoById = (id?: string) =>
  id ? VIDEOS.find((v) => v.id === id) : undefined
