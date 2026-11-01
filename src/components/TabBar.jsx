import { ArrowRightLeft, ChartPie, House, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { path: '/', label: 'Home', icon: House },
  { path: '/subscriptions', label: 'Subscriptions', icon: ArrowRightLeft },
  { path: '/purchases', label: 'Purchases', icon: Receipt },
  { path: '/budget', label: 'Budget', icon: ChartPie },
]

// Keep parent tab active for nested routes (ex /subscriptions/spotify)
const isActive = (tabPath, path) =>
  tabPath === '/' ? path === '/' : path === tabPath || path.startsWith(tabPath + '/')

export default function TabBar({ path }) {
  return (
    <nav
      aria-label="Main"
      className="border-t bg-card pb-[env(safe-area-inset-bottom)] sm:pb-5"
    >
      <ul className="grid grid-cols-4">
        {TABS.map(({ path: tabPath, label, icon: Icon }) => {
          const active = isActive(tabPath, path)
          return (
            <li key={tabPath}>
              <a
                href={`#${tabPath}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 pt-2 pb-1 text-xs outline-none',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  active ? 'font-semibold text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-14 items-center justify-center rounded-full transition-colors',
                    active && 'bg-secondary',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
