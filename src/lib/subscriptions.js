import { useSyncExternalStore } from 'react'

/* ------------------------------------------------------------------ */
/* Tiny external store (no provider needed). Prototype data is seeded  */
/* from the Figma screens; swap SEED for an API later.                 */
/* ------------------------------------------------------------------ */

const SEED = [
  { id: 'netflix', name: 'Netflix', icon: 'tv', price: 15.49, renews: '2025-10-18', lastCharge: '2025-09-18', since: 'January 2023' },
  { id: 'icloud', name: 'iCloud+', icon: 'cloud', price: 2.99, renews: '2025-10-22', lastCharge: '2025-09-22', since: 'June 2022' },
  { id: 'lightroom', name: 'Adobe Lightroom', icon: 'camera', price: 9.99, renews: '2025-10-28', lastCharge: '2025-09-28', since: 'February 2024' },
  { id: 'spotify', name: 'Spotify Premium', icon: 'spotify', price: 6.99, renews: '2025-11-03', lastCharge: '2025-10-03', since: 'March 2025', unusedDays: 41 },
].map((s) => ({
  ...s,
  status: 'active', // 'active' | 'canceled'
  flagged: Boolean(s.unusedDays), // needs review (unused)
  reminderDays: null, // days before renewal, once a reminder is set
}))

let state = SEED
const listeners = new Set()

const emit = (next) => {
  state = next
  listeners.forEach((l) => l())
}
const update = (id, patch) =>
  emit(state.map((s) => (s.id === id ? { ...s, ...patch } : s)))

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useSubscriptions = () => useSyncExternalStore(subscribe, () => state)

export const cancelSubscription = (id) => update(id, { status: 'canceled' })
export const keepSubscription = (id) => update(id, { flagged: false }) // reviewed, keeping it
export const setReminder = (id, days) => update(id, { reminderDays: days })

/* ------------------------------ helpers ----------------------------- */

export const REMINDER_OPTIONS = [
  { days: 7, label: '1 Week' },
  { days: 3, label: '3 Days' },
  { days: 1, label: '1 Day' },
]

const toDate = (v) => (v instanceof Date ? v : new Date(`${v}T00:00:00`))

export const formatDate = (v, month = 'short') =>
  toDate(v).toLocaleDateString('en-US', { month, day: 'numeric' })

export const reminderDate = (renews, days) => {
  const d = toDate(renews)
  d.setDate(d.getDate() - days)
  return d
}

export const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
