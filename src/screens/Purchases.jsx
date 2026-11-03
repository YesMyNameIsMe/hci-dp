import { useState } from 'react'
import { Car, Repeat, Search, ShoppingBag, ShoppingCart, SlidersHorizontal, Utensils } from 'lucide-react'
import ScreenHeader from '@/components/ScreenHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { getMonthSpending, getPurchases, groupByDay } from '@/data'
import { formatMoney } from '@/lib/format'

const CATEGORY_ICONS = {
  Groceries: ShoppingCart,
  'Food & drink': Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Subscription: Repeat,
}

// "Nov 1–3, 2026", or "Nov 1, 2026" on the first of the month
function monthRange(now) {
  const month = now.toLocaleString('en-US', { month: 'short' })
  const days = now.getDate() === 1 ? '1' : `1–${now.getDate()}`
  return `${month} ${days}, ${now.getFullYear()}`
}

function PurchaseRow({ purchase }) {
  const Icon = CATEGORY_ICONS[purchase.category]
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium">{purchase.merchant}</p>
        <p className="text-sm text-muted-foreground">{purchase.category}</p>
      </div>
      <p className="text-base font-medium tabular-nums">{formatMoney(purchase.amount)}</p>
    </li>
  )
}

export default function Purchases() {
  const [now] = useState(() => new Date())
  const { total } = getMonthSpending(now)
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)

  const q = query.trim().toLowerCase()
  const matches = getPurchases(now).filter(
    (p) =>
      (categories.length === 0 || categories.includes(p.category)) &&
      (p.merchant.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
  )
  const days = groupByDay(matches, now)
  const clearAll = () => {
    setQuery('')
    setCategories([])
  }

  return (
    <>
      <ScreenHeader title="All Purchases" />

      <div className="px-4 pt-4 pb-6">
        {/* Total Spent */}
        <Card className="gap-1 bg-primary px-5 py-6 text-primary-foreground ring-0">
          <p className="text-sm opacity-80">
            Spent in {now.toLocaleString('en-US', { month: 'long' })}
          </p>
          <p className="text-4xl font-medium tracking-tight tabular-nums">{formatMoney(total)}</p>
          <p className="text-sm opacity-80">{monthRange(now)}</p>
        </Card>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            {/* Search Bar*/}
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search merchant or category"
              aria-label="Search purchases"
              className="h-11 rounded-xl bg-card pl-11 text-base md:text-base"
            />
          </div>

          {/* Filter button pop up screen*/}
          <Drawer
            open={filterOpen}
            onOpenChange={setFilterOpen}
            container={document.getElementById('phone')}
          >
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="relative size-11 rounded-xl bg-card"
                aria-label={
                  categories.length ? `Filter by category, ${categories.length} on` : 'Filter by category'
                }
              >
                <SlidersHorizontal className="size-5" aria-hidden="true" />
                {categories.length > 0 && (
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-lg font-semibold">Choose your Categories</DrawerTitle>
                <DrawerDescription>Show only purchases in the categories you pick.</DrawerDescription>
              </DrawerHeader>
              <ToggleGroup
                type="multiple"
                value={categories}
                onValueChange={setCategories}
                className="w-full flex-wrap justify-center px-4"
              >
                {Object.entries(CATEGORY_ICONS).map(([category, Icon]) => (
                  <ToggleGroupItem
                    key={category}
                    value={category}
                    variant="outline"
                    className="h-11 gap-2 rounded-full px-4 data-[state=on]:border-primary data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {category}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <DrawerFooter className="flex-row pb-6">
                <Button
                  variant="outline"
                  className="h-11 flex-1"
                  disabled={categories.length === 0}
                  onClick={() => setCategories([])}
                >
                  Clear
                </Button>
                <DrawerClose asChild>
                  <Button className="h-11 flex-1">Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        

        {/* Purchases list */}
        <p className="sr-only" aria-live="polite">
          {matches.length} purchases shown
        </p>

        {days.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-base font-medium">
              No purchases match{q ? ` “${query.trim()}”` : ' these filters'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
            <Button variant="outline" className="mt-5 h-11 px-5" onClick={clearAll}>
              Clear search and filters
            </Button>
          </div>
        ) : (
          days.map((day) => (
            <section key={day.date.getTime()} aria-label={day.label}>
              <h2 className="flex justify-between px-1 pt-6 pb-2 text-sm font-semibold text-muted-foreground">
                <span>{day.label}</span>
                <span className="tabular-nums">{formatMoney(day.total)}</span>
              </h2>
              <Card className="py-0">
                <ul className="divide-y">
                  {day.purchases.map((p) => (
                    <PurchaseRow key={p.id} purchase={p} />
                  ))}
                </ul>
              </Card>
            </section>
          ))
        )}
      </div>
    </>
  )
}
