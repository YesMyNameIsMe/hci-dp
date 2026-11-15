import { Flag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { flagged } from '@/lib/flagged'
import { formatDate, money } from '@/lib/subscriptions'
import { cn } from '@/lib/utils'
import SubscriptionSymbol from './SubscriptionSymbol'

export default function SubscriptionRow({ sub }) {
  return (
    <a
      href={`#/subscriptions/${sub.id}`}
      className="relative block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className={cn('gap-0 rounded-[18px] py-0', sub.flagged && flagged.surface)}>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <SubscriptionSymbol icon={sub.icon} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">{sub.name}</p>
            <p className="text-xs text-muted-foreground">Renews {formatDate(sub.renews)}</p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold">{money(sub.price)}</p>
            <p className="text-xs text-muted-foreground">/ month</p>
          </div>
        </div>
        {sub.flagged && (
          <p className={cn('flex items-center gap-1.5 pr-4 pb-3 pl-[70px] text-xs font-medium', flagged.title)}>
            <Flag className="size-3" aria-hidden="true" />
            Flagged · Not used in {sub.unusedDays} days
          </p>
        )}
      </Card>
      {sub.flagged && (
        <span
          className={cn(
            'absolute right-4 bottom-3 rounded-[9px] px-2 py-[3px] text-[10px] font-semibold tracking-[0.06em]',
            flagged.solid,
          )}
        >
          FLAGGED
        </span>
      )}
    </a>
  )
}
