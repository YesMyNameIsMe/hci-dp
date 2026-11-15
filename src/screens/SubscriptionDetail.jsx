import { Fragment, useState } from 'react'
import { Bell } from 'lucide-react'
import ScreenHeader from '@/components/ScreenHeader'
import GuidedCancelSheet from '@/components/subscriptions/GuidedCancelSheet'
import SetReminderSheet from '@/components/subscriptions/SetReminderSheet'
import SubscriptionSymbol from '@/components/subscriptions/SubscriptionSymbol'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRedirectIf } from '@/lib/navigate'
import { formatDate, keepSubscription, money, useSubscriptions } from '@/lib/subscriptions'
import { cn } from '@/lib/utils'

// 69px two-line action: label (20px medium) + helper (12px)
const ACTION = 'h-auto min-h-[69px] w-full flex-col gap-[3px] rounded-xl px-4 py-3 text-xl font-medium'
const HELPER = 'text-xs font-normal'

export default function SubscriptionDetail({ id }) {
  const sub = useSubscriptions().find((s) => s.id === id)
  const [sheet, setSheet] = useState(null) // 'cancel' | 'remind' | null
  useRedirectIf(!sub, '/subscriptions')
  if (!sub) return null

  const rows = [
    ['Renews', formatDate(sub.renews)],
    ['Last Charge', formatDate(sub.lastCharge)],
    ['Since', sub.since],
  ]
  const closeSheet = (open) => !open && setSheet(null)

  return (
    <>
      <ScreenHeader title="Active Subscriptions" backHref="#/subscriptions" />

      <div className="flex flex-col gap-3 px-[19px] pt-2.5 pb-6">
        <p className="text-[15px] leading-normal text-muted-foreground">
          View and choose what you would like to do with this {sub.flagged ? 'flagged ' : ''}subscription.
        </p>

        <h2 className="text-[17px] font-semibold">Active Subscription Details</h2>

        {/* Identity card: logo + name, with the flagged note underneath */}
        <Card className="gap-0 rounded-[18px] py-2.5">
          <div className="flex items-center gap-3 px-4">
            <SubscriptionSymbol icon={sub.icon} large />
            <h3 className="min-w-0 flex-1 text-[32px] leading-8 tracking-[0.5px]">{sub.name}</h3>
          </div>
          {sub.flagged && (
            <p className="mt-2.5 px-4 text-base leading-8 text-muted-foreground">
              Flagged: Not used in <strong className="font-bold">{sub.unusedDays} days.</strong>
            </p>
          )}
          {sub.reminderDays != null && (
            <p className="mt-2.5 flex items-center gap-1.5 px-4 text-sm text-primary">
              <Bell className="size-4" aria-hidden="true" />
              Reminder set · {sub.reminderDays} {sub.reminderDays === 1 ? 'day' : 'days'} before renewal
            </p>
          )}
        </Card>

        {/* Price + billing details */}
        <Card className="items-center gap-3 rounded-[18px] py-2.5">
          <p className="flex items-baseline gap-3 leading-normal">
            <span className="text-[42px] font-medium text-primary">{money(sub.price)}</span>
            <span className="text-[19px] text-muted-foreground">/ month</span>
          </p>
          <dl className="flex w-full flex-col gap-1 border-y border-border px-4 py-2.5">
            {rows.map(([label, value], i) => (
              <Fragment key={label}>
                <div
                  className={cn(
                    'flex items-center justify-between text-xl leading-8',
                    i < rows.length - 1 && 'border-b-2 border-border pb-1',
                  )}
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              </Fragment>
            ))}
          </dl>
        </Card>

        {sub.status === 'canceled' ? (
          <p className="pt-4 text-center text-muted-foreground">This subscription has been canceled.</p>
        ) : (
          <section className="flex flex-col gap-3 pt-4" aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="text-xl leading-5 font-medium">
              What would you like to do?
            </h2>

            <Button
              onClick={() => setSheet('cancel')}
              className={cn(
                ACTION,
                'bg-[#c73333] text-white hover:bg-[#c73333]/90 focus-visible:ring-[#c73333]/40',
              )}
            >
              Cancel subscription
              <span className={HELPER}>Ends your plan · guided, 4 short steps</span>
            </Button>

            <Button variant="outline" onClick={() => setSheet('remind')} className={cn(ACTION, 'bg-card')}>
              Remind me before renewal
              <span className={cn(HELPER, 'text-muted-foreground')}>Keep it for now · we’ll notify you first</span>
            </Button>

            <Button asChild className={cn(ACTION, 'border-primary')}>
              <a href="#/subscriptions" onClick={() => keepSubscription(sub.id)}>
                Keep subscription
                <span className={cn(HELPER, 'text-[#d1e5d9]')}>No changes · stays on your plan</span>
              </a>
            </Button>
          </section>
        )}
      </div>

      <GuidedCancelSheet sub={sub} open={sheet === 'cancel'} onOpenChange={closeSheet} />
      <SetReminderSheet sub={sub} open={sheet === 'remind'} onOpenChange={closeSheet} />
    </>
  )
}