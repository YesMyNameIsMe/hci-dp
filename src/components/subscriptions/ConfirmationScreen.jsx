import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CheckCircleFill from '@/components/icons/CheckCircleFill'
import ScreenHeader from '@/components/ScreenHeader'
import { money, useSubscriptions } from '@/lib/subscriptions'

const ACTION = 'h-[69px] w-full rounded-xl text-xl font-medium'

// Shared layout for "Subscription Canceled" and "Reminder Set".
export default function ConfirmationScreen({ sub, title, message, emphasizeAmount = false }) {
  const subs = useSubscriptions()
  const next = subs.find((s) => s.status === 'active' && s.flagged && s.id !== sub.id)
  const yearly = money(sub.price * 12)

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader title="Active Subscriptions" backHref="#/subscriptions" />

      <div className="flex flex-1 flex-col justify-center px-4 py-6">
        <Card className="items-center gap-2 rounded-3xl p-6 text-center" role="status">
          <CheckCircleFill className="size-[122px] text-primary" />
          <h2 className="text-[30px] leading-9 font-semibold">{title}</h2>
          <p className="text-[15px] leading-[22px] text-muted-foreground">{message}</p>
          <p className="text-[32px] leading-[48px] font-medium">
            <span className={emphasizeAmount ? 'text-[42px]' : undefined}>{yearly}</span>/year
          </p>
        </Card>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 bg-background px-[19px] pt-3 pb-4">
        <Button
          asChild
          variant="outline"
          className={`${ACTION} border-[1.5px] border-primary bg-card text-primary hover:bg-secondary hover:text-primary dark:border-primary`}
        >
          <a href={next ? `#/subscriptions/${next.id}` : '#/subscriptions'}>
            {next ? 'Review Next Flagged →' : 'Back to Subscriptions →'}
          </a>
        </Button>
        <Button asChild className={ACTION}>
          <a href="#/">Back to Home</a>
        </Button>
      </div>
    </div>
  )
}
