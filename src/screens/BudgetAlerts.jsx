import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import ScreenHeader from '@/components/ScreenHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import PhoneDrawerContent from '@/components/subscriptions/PhoneDrawerContent'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CATEGORIES, THRESHOLDS, formatBudget, saveBudget, useBudgets } from '@/lib/budgets'
import { cn } from '@/lib/utils'

export default function BudgetAlerts() {
  const budgets = useBudgets()
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [amountText, setAmountText] = useState(String(budgets[CATEGORIES[0].id].amount))
  const [thresholds, setThresholds] = useState(budgets[CATEGORIES[0].id].thresholds.map(String))
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const category = CATEGORIES.find((c) => c.id === categoryId)
  const CategoryIcon = category.icon
  const amount = Number(amountText)
  const valid = amount > 0

  function selectCategory(id) {
    setCategoryId(id)
    setAmountText(String(budgets[id].amount))
    setThresholds(budgets[id].thresholds.map(String))
    setSaved(false)
  }

  function save() {
    saveBudget(categoryId, {
      amount,
      thresholds: thresholds.map(Number).sort((a, b) => a - b),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader title="Budgets & Alerts" />

      <div className="flex flex-1 flex-col gap-[26px] px-4 pt-3 pb-6">
        <p className="text-[15px] leading-normal text-muted-foreground">
          Set when you’ll be notified about your spending reaching a certain threshold in your
          budget.
        </p>

        <section className="flex flex-col gap-3" aria-labelledby="budget-heading">
          <h2 id="budget-heading" className="text-[17px] font-semibold">
            Your monthly budget
          </h2>
          <Card className="gap-0 rounded-[18px] py-0">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-haspopup="dialog"
              className="flex w-full items-center gap-3 p-[18px] text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-secondary text-primary">
                <CategoryIcon className="size-[21px]" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-xs text-muted-foreground">Category</span>
                <span className="text-base font-medium">{category.label}</span>
              </span>
              <ChevronDown className="size-[18px] text-muted-foreground" aria-hidden="true" />
            </button>

            <div className="h-px bg-border" />

            <div className="flex flex-col gap-2 px-5 pt-4 pb-[18px]">
              <label htmlFor="budget-amount" className="text-xs text-muted-foreground">
                Monthly amount
              </label>
              <div className="flex items-baseline rounded-lg text-[42px] font-medium focus-within:ring-3 focus-within:ring-ring/50">
                <span aria-hidden="true">$</span>
                <Input
                  id="budget-amount"
                  inputMode="decimal"
                  value={amountText}
                  onChange={(e) => {
                    setAmountText(e.target.value.replace(/[^\d.]/g, ''))
                    setSaved(false)
                  }}
                  aria-invalid={!valid}
                  className="h-auto border-0 bg-transparent p-0 text-[42px] leading-tight font-medium focus-visible:ring-0 md:text-[42px] dark:bg-transparent"
                />
              </div>
              <p className="text-xs text-muted-foreground">Resets on the 1st of every month</p>
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-3" aria-labelledby="notify-heading">
          <div className="flex flex-col gap-1.5">
            <h2 id="notify-heading" className="text-[17px] font-semibold">
              Notify Me At
            </h2>
            <p className="text-[13px] text-muted-foreground">When my spending reaches…</p>
          </div>
          <ToggleGroup
            type="multiple"
            variant="outline"
            size="lg"
            spacing={2.5}
            value={thresholds}
            onValueChange={(v) => {
              setThresholds(v)
              setSaved(false)
            }}
            aria-label="Notify me at"
            className="w-full"
          >
            {THRESHOLDS.map((pct) => {
              const on = thresholds.includes(String(pct))
              return (
                <ToggleGroupItem
                  key={pct}
                  value={String(pct)}
                  className="h-auto flex-1 flex-col gap-[5px] rounded-xl bg-card px-2.5 py-3 text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-secondary data-[state=on]:text-primary"
                >
                  <span className="flex items-center gap-[5px] text-base font-semibold">
                    {on && <Check className="size-3.5" aria-hidden="true" />}
                    {pct}%
                  </span>
                  <span className="text-xs font-normal">{valid ? formatBudget((amount * pct) / 100) : '—'}</span>
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </section>
      </div>

      <div className="sticky bottom-0 bg-background px-[19px] pt-3 pb-4">
        <Button onClick={save} disabled={!valid} className="h-[69px] w-full rounded-xl text-xl font-medium">
          {saved ? (
            <>
              <Check className="size-5" aria-hidden="true" /> Budget saved
            </>
          ) : (
            'Save Budget'
          )}
        </Button>
      </div>

      <Drawer open={pickerOpen} onOpenChange={setPickerOpen}>
        <PhoneDrawerContent>
          <DrawerHeader>
            <DrawerTitle>Choose a category</DrawerTitle>
            <DrawerDescription>Each category has its own monthly budget.</DrawerDescription>
          </DrawerHeader>
          <ul className="flex flex-col gap-2 px-4 pb-6">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <DrawerClose asChild>
                  <button
                    type="button"
                    onClick={() => selectCategory(id)}
                    aria-pressed={id === categoryId}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                      id === categoryId && 'border-primary bg-secondary',
                    )}
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-base font-medium">{label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatBudget(budgets[id].amount)} / month
                      </span>
                    </span>
                    {id === categoryId && <Check className="size-4 text-primary" aria-hidden="true" />}
                  </button>
                </DrawerClose>
              </li>
            ))}
          </ul>
        </PhoneDrawerContent>
      </Drawer>
    </div>
  )
}