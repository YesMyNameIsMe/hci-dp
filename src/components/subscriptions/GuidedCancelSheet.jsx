import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { navigate } from '@/lib/navigate'
import { cancelSubscription } from '@/lib/subscriptions'
import { cn } from '@/lib/utils'
import { SHEET_ACTION_CLASS, SHEET_CLASS } from './sheet'

// Steps 1–2 are from the Figma screens. Steps 3–4 follow the same pattern
// (the design lists their titles but only shows 1 and 2 expanded).
const STEPS = [
  { title: 'Open Account Page', detail: 'In the app, click the profile icon to open the account page' },
  { title: 'Select Membership', detail: 'Click the “Membership” option underneath the Subscriptions section.' },
  { title: 'Decline Offers', detail: 'If you’re offered a discount or a pause, decline it so the cancellation goes through.' },
  { title: 'Confirm', detail: 'Confirm the cancellation, then look for a confirmation email from the service.' },
]

export default function GuidedCancelSheet({ sub, open, onOpenChange }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1

  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  function next() {
    if (!last) return setStep(step + 1)
    onOpenChange(false)
    setTimeout(() => {
      cancelSubscription(sub.id)
      navigate(`/subscriptions/${sub.id}/canceled`)
    }, 200)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={SHEET_CLASS}>
        <DrawerHeader className="px-4 pt-6 text-center md:text-center">
          <DrawerTitle className="text-2xl leading-6 font-normal">
            Cancel Subscription: Guided Process
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Follow these four steps to cancel {sub.name}.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-3">
            <p className="text-2xl leading-10">
              Step {step + 1} of {STEPS.length}
            </p>
            <div className="flex gap-2.5" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span
                  key={s.title}
                  className={cn('h-[13px] flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-border')}
                />
              ))}
            </div>
          </div>

          <ol className="flex flex-col gap-6">
            {STEPS.map((s, i) => {
              const active = i === step
              return (
                <li
                  key={s.title}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'min-h-16 rounded-[18px] border border-[#5e5e5e] bg-card p-3 text-xl',
                    !active && 'opacity-50',
                  )}
                >
                  <p className="leading-[35px] font-semibold">
                    {i + 1}. {s.title}
                  </p>
                  {active && <p className="leading-6 text-muted-foreground">{s.detail}</p>}
                </li>
              )
            })}
          </ol>
        </div>

        <DrawerFooter className="px-[19px] pb-5">
          <Button onClick={next} className={SHEET_ACTION_CLASS}>
            {last ? 'I’ve canceled it' : 'Move on to next step →'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
