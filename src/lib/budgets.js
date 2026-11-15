import { useSyncExternalStore } from 'react'
import { ArrowRightLeft, Fuel, Package, ShoppingBasket, Utensils } from 'lucide-react'

export const CATEGORIES = [
  { id: 'food-delivery', label: 'Food delivery', icon: Utensils },
  { id: 'groceries', label: 'Groceries', icon: ShoppingBasket },
  { id: 'shopping', label: 'Shopping', icon: Package },
  { id: 'gas', label: 'Gas', icon: Fuel },
  { id: 'subscriptions', label: 'Subscriptions', icon: ArrowRightLeft },
]

export const THRESHOLDS = [50, 75, 100]

// One budget per category. Food delivery matches the Figma screen.
let state = {
  'food-delivery': { amount: 250, thresholds: [75, 100] },
  groceries: { amount: 400, thresholds: [75, 100] },
  shopping: { amount: 150, thresholds: [75, 100] },
  gas: { amount: 120, thresholds: [75, 100] },
  subscriptions: { amount: 40, thresholds: [75, 100] },
}
const listeners = new Set()

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useBudgets = () => useSyncExternalStore(subscribe, () => state)

export const saveBudget = (id, budget) => {
  state = { ...state, [id]: budget }
  listeners.forEach((l) => l())
}

export const formatBudget = (n) =>
  Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`
