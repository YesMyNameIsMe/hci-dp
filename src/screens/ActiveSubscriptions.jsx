import { useState } from 'react'
import { ChevronRight, Filter, Flag, Search } from 'lucide-react'
import ScreenHeader from '@/components/ScreenHeader'
import SubscriptionRow from '@/components/subscriptions/SubscriptionRow'
import SummaryCard from '@/components/subscriptions/SummaryCard'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { flagged } from '@/lib/flagged'
import { money, useSubscriptions } from '@/lib/subscriptions'
import { cn } from '@/lib/utils'

export default function ActiveSubscriptions() {
  const subs = useSubscriptions()
  const [query, setQuery] = useState('')
  const [flaggedOnly, setFlaggedOnly] = useState(false)

  const active = subs
    .filter((s) => s.status === 'active')
    .sort((a, b) => a.renews.localeCompare(b.renews))
  const needsReview = active.filter((s) => s.flagged)
  const total = active.reduce((sum, s) => sum + s.price, 0)

  const q = query.trim().toLowerCase()
  const visible = active.filter(
    (s) => (!flaggedOnly || s.flagged) && s.name.toLowerCase().includes(q),
  )
  const first = needsReview[0]

  return (
    <>
      <ScreenHeader title="Active Subscriptions" />

      <div className="flex flex-col gap-5 px-4 pt-5 pb-6">
        {first && (
          <a
            href={`#/subscriptions/${first.id}`}
            className={cn(
              'flex items-center gap-2.5 rounded-[14px] border py-2.5 pr-3 pl-3.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              flagged.border,
            )}
          >
            <Flag className={cn('size-5 shrink-0', flagged.title)} aria-hidden="true" />
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className={cn('text-sm font-semibold', flagged.title)}>
                {needsReview.length} flagged subscription{needsReview.length > 1 ? 's need' : ' needs'} review
              </span>
              <span className={cn('truncate text-xs', flagged.body)}>
                {first.name} · not used in {first.unusedDays} days
              </span>
            </span>
            <ChevronRight className={cn('size-5 shrink-0', flagged.title)} aria-hidden="true" />
          </a>
        )}

        <SummaryCard label="Monthly subscription total" amount={money(total)} detail="/ month" />

        <div className="flex gap-2.5">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-[19px] -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Search subscriptions"
              placeholder="Search subscriptions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-[46px] rounded-xl bg-card pl-10 text-sm dark:bg-card"
            />
          </div>
          <Toggle
            variant="outline"
            aria-label="Show flagged only"
            pressed={flaggedOnly}
            onPressedChange={setFlaggedOnly}
            className="h-[46px] min-w-[46px] rounded-xl bg-card data-[state=on]:border-primary data-[state=on]:bg-secondary"
          >
            <Filter className="size-[22px]" />
          </Toggle>
        </div>

        <section className="flex flex-col gap-2.5" aria-labelledby="renewals-heading">
          <div className="flex items-center justify-between pb-0.5">
            <h2 id="renewals-heading" className="text-[17px] font-semibold">
              Upcoming renewals
            </h2>
            <p className="text-xs text-muted-foreground">
              {active.length} subscription{active.length === 1 ? '' : 's'}
            </p>
          </div>

          {visible.map((sub) => (
            <SubscriptionRow key={sub.id} sub={sub} />
          ))}

          {visible.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {active.length === 0 ? 'You have no active subscriptions.' : 'No subscriptions match.'}
            </p>
          )}
        </section>
      </div>
    </>
  )
}
