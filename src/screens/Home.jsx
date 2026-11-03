import { ArrowRightLeft, ChartPie, ChevronRight, Receipt } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getMonthSpending } from '@/data'
import { formatMoney } from '@/lib/format'

const LINKS = [
  {
    href: '#/subscriptions',
    icon: ArrowRightLeft,
    title: 'Manage Subscriptions',
    description: 'Review charges, cancel, or set reminders',
  },
  {
    href: '#/purchases',
    icon: Receipt,
    title: 'All Purchases',
    description: 'See everything you’ve spent, day by day',
  },
  {
    href: '#/budget',
    icon: ChartPie,
    title: 'Budget & Alerts',
    description: 'Set spending limits and get alerts',
  },
]

function changeText(changePct) {
  if (changePct === null) return 'No spending from last month to compare yet.'
  if (changePct === 0) return 'Your spending is the same as this time last month.'
  const direction = changePct > 0 ? 'up' : 'down'
  return `Your spending is ${direction} ${Math.abs(changePct)}% from this time last month.`
}

const linkClass =
  'flex items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-muted/40 active:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'

export default function Home() {
  const { total, changePct } = getMonthSpending()

  return (
    <div className="flex min-h-full flex-col px-5 pb-6">
      <h1 className="pt-8 pb-6 text-center font-display text-6xl leading-none text-primary italic">
        Prune
      </h1>

      <Card className="items-center gap-2 bg-secondary py-14 ring-0">
        <p className="text-base text-muted-foreground">Monthly Total Spending</p>
        <p className="flex items-baseline gap-2">
          <span className="text-6xl font-medium tracking-tight text-primary tabular-nums">
            {formatMoney(total)}
          </span>
          <span className="text-lg text-muted-foreground">/ month</span>
        </p>
      </Card>
      <p className="mt-4 px-4 text-center text-muted-foreground">{changeText(changePct)}</p>

      <nav aria-label="Shortcuts" className="mt-auto pt-8">
        <Card className="gap-0 divide-y py-0">
          {LINKS.map(({ href, icon: Icon, title, description }) => (
            <a key={href} href={href} className={linkClass}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-base font-medium">{title}</span>
                <span className="block text-sm text-muted-foreground">{description}</span>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </a>
          ))}
        </Card>
      </nav>
    </div>
  )
}
