import { useState } from 'react'
import { Bell } from 'lucide-react'
import ScreenHeader from '@/components/ScreenHeader'
import GuidedCancelSheet from '@/components/subscriptions/GuidedCancelSheet'
import SetReminderSheet from '@/components/subscriptions/SetReminderSheet'
import SubscriptionSymbol from '@/components/subscriptions/SubscriptionSymbol'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRedirectIf } from '@/lib/navigate'
import { formatDate, keepSubscription, money, useSubscriptions } from '@/lib/subscriptions'

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

      <div className="flex flex-col gap-3 px-4 pt-4 pb-6">
        <Card className="flex-row items-center gap-3 rounded-xl px-4 py-2.5">
          <SubscriptionSymbol icon={sub.icon} large />
          <h2 className="text-[32px] leading-8">{sub.name}</h2>
        </Card>

        {sub.flagged && (
          <Card className="rounded-xl px-4 py-2.5 text-center text-xl leading-8 text-muted-foreground">
            <p>
              Flagged: Not used in <strong>{sub.unusedDays} days.</strong>
            </p>
          </Card>
        )}

        <p className="pt-1">
          <span className="text-[32px]">{money(sub.price)}</span>
          <span className="text-2xl">/Month</span>
        </p>
        {sub.reminderDays != null && (
          <p className="-mt-1 flex items-center gap-1.5 text-sm text-primary">
            <Bell className="size-4" aria-hidden="true" />
            Reminder set · {sub.reminderDays} {sub.reminderDays === 1 ? 'day' : 'days'} before renewal
          </p>
        )}

        <dl className="flex flex-col">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b-2 border-foreground/25 py-0 text-xl leading-8"
            >
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {sub.status === 'canceled' ? (
          <p className="pt-4 text-center text-muted-foreground">This subscription has been canceled.</p>
        ) : (
          <section className="flex flex-col gap-3 pt-3" aria-labelledby="actions-heading">
            <h3 id="actions-heading" className="text-xl font-medium">
              What would you like to do?
            </h3>

            <Button
              variant="destructive"
              onClick={() => setSheet('cancel')}
              className={`${ACTION} border-[1.5px] border-destructive`}
            >
              Cancel subscription
              <span className={`${HELPER} text-destructive/80`}>Ends your plan · guided, 4 short steps</span>
            </Button>

            <Button variant="outline" onClick={() => setSheet('remind')} className={`${ACTION} bg-card`}>
              Remind me before renewal
              <span className={`${HELPER} text-muted-foreground`}>Keep it for now · we’ll notify you first</span>
            </Button>

            <Button asChild className={ACTION}>
              <a href="#/subscriptions" onClick={() => keepSubscription(sub.id)}>
                Keep subscription
                <span className={`${HELPER} text-primary-foreground/80`}>No changes · stays on your plan</span>
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
