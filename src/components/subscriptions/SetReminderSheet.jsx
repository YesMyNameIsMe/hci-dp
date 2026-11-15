import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import PhoneDrawerContent from './PhoneDrawerContent'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { navigate } from '@/lib/navigate'
import { REMINDER_OPTIONS, formatDate, reminderDate, setReminder } from '@/lib/subscriptions'
import SubscriptionSymbol from './SubscriptionSymbol'
import { SHEET_ACTION_CLASS, SHEET_CLASS } from './sheet'

export default function SetReminderSheet({ sub, open, onOpenChange }) {
  const [days, setDays] = useState(sub.reminderDays ?? 3)

  useEffect(() => {
    if (open) setDays(sub.reminderDays ?? 3)
  }, [open, sub.reminderDays])

  const remindOn = formatDate(reminderDate(sub.renews, days))
  const renewsShort = formatDate(sub.renews)

  function confirm() {
    onOpenChange(false)
    // wait for the sheet to slide away before changing screens
    setTimeout(() => {
      setReminder(sub.id, days)
      navigate(`/subscriptions/${sub.id}/reminder-set`)
    }, 200)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <PhoneDrawerContent className={SHEET_CLASS}>
        <DrawerHeader className="items-center gap-3 px-4 pt-6 text-center md:text-center">
          <DrawerTitle className="text-2xl leading-8 font-semibold">Set Reminder</DrawerTitle>
          <DrawerDescription className="text-[15px]">
            Get a heads-up before this renews, so you can decide whether to keep it.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-3">
            <Card className="flex-row items-center gap-3 rounded-[18px] px-4 py-2.5">
              <SubscriptionSymbol icon={sub.icon} large />
              <p className="text-[30px] leading-9 font-semibold">{sub.name}</p>
            </Card>
            <p className="text-center text-[15px] text-muted-foreground">
              Renews on: {formatDate(sub.renews, 'long')}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[17px] font-semibold">Remind me:</h3>
            <ToggleGroup
              type="single"
              variant="outline"
              size="lg"
              spacing={2.5}
              value={String(days)}
              onValueChange={(v) => v && setDays(Number(v))}
              aria-label="Remind me"
              className="w-full"
            >
              {REMINDER_OPTIONS.map((o) => (
                <ToggleGroupItem
                  key={o.days}
                  value={String(o.days)}
                  className="h-14 flex-1 rounded-xl bg-card text-base text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-secondary data-[state=on]:font-semibold data-[state=on]:text-primary"
                >
                  {o.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Card className="rounded-[18px] p-4">
            <p className="text-[15px] leading-[22px] text-muted-foreground" aria-live="polite">
              We’ll remind you on {remindOn}, {days} {days === 1 ? 'day' : 'days'} before this
              renews on {renewsShort}.
            </p>
          </Card>
        </div>

        <DrawerFooter className="px-[19px] pb-5">
          <Button onClick={confirm} className={SHEET_ACTION_CLASS}>
            Set reminder
          </Button>
        </DrawerFooter>
      </PhoneDrawerContent>
    </Drawer>
  )
}