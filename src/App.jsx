import { useEffect, useState } from 'react'
import StatusBar from '@/components/StatusBar'
import TabBar from '@/components/TabBar'
import { useRoute } from '@/lib/router'
import ActiveSubscriptions from '@/screens/ActiveSubscriptions'
import BudgetAlerts from '@/screens/BudgetAlerts'
import CancelConfirmation from '@/screens/CancelConfirmation'
import Home from '@/screens/Home'
import Purchases from '@/screens/Purchases'
import ReminderConfirmation from '@/screens/ReminderConfirmation'
import SubscriptionDetail from '@/screens/SubscriptionDetail'

const ROUTES = {
  '/': Home,
  '/subscriptions': ActiveSubscriptions,
  '/purchases': Purchases,
  '/budget': BudgetAlerts,
}

// /subscriptions/:id            -> detail
// /subscriptions/:id/canceled   -> cancel confirmation
// /subscriptions/:id/reminder-set -> reminder confirmation
const SUBSCRIPTION_VIEWS = {
  detail: SubscriptionDetail,
  canceled: CancelConfirmation,
  'reminder-set': ReminderConfirmation,
}

function resolveRoute(path) {
  const match = path.match(/^\/subscriptions\/([^/]+)(?:\/(canceled|reminder-set))?$/)
  if (match) {
    const [, id, view = 'detail'] = match
    return { Screen: SUBSCRIPTION_VIEWS[view], props: { id } }
  }
  return { Screen: ROUTES[path] ?? ROUTES['/'], props: {} }
}

const PHONE_W = 390
const PHONE_H = 844
const FRAME_PAD = 80 // space above/below the device (covers bezel, rim and shadow)

// Desktop = window at least 640px wide (Tailwind's `sm`). Scales the device to fit the window height.
function useDeviceFit() {
  const calc = () => {
    const desktop = window.innerWidth >= 640
    const scale = desktop ? Math.min(1, (window.innerHeight - FRAME_PAD) / PHONE_H) : 1
    return { desktop, scale }
  }
  const [fit, setFit] = useState(calc)
  useEffect(() => {
    const onResize = () => setFit(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return fit
}

// Physical side buttons, desktop only
function SideButtons() {
  const base = 'absolute hidden w-[3px] bg-neutral-600 sm:block'
  return (
    <>
      {/* left: action button + volume up/down */}
      <span className={`${base} -left-[9px] top-[110px] h-8 rounded-l-sm`} />
      <span className={`${base} -left-[9px] top-[170px] h-14 rounded-l-sm`} />
      <span className={`${base} -left-[9px] top-[238px] h-14 rounded-l-sm`} />
      {/* right: power */}
      <span className={`${base} -right-[9px] top-[190px] h-24 rounded-r-sm`} />
    </>
  )
}

export default function App() {
  const path = useRoute()
  const { Screen, props } = resolveRoute(path)
  const { desktop, scale } = useDeviceFit()

  return (
    /* Phone styling: on desktop the page is pinned to the viewport and the device is centered in it */
    <div className="min-h-svh sm:fixed sm:inset-0 sm:flex sm:items-center sm:justify-center sm:overflow-hidden sm:bg-background">
      {/* Layout box sized to the *scaled* phone so centering and bounds are correct */}
      <div
        className="sm:shrink-0"
        style={desktop ? { width: PHONE_W * scale, height: PHONE_H * scale } : undefined}>
        {/* Unscaled 390x844 device, scaled from its top-left corner into the box above */}
        <div
          className="relative origin-top-left"
          style={desktop ? { width: PHONE_W, height: PHONE_H, transform: `scale(${scale})` } : undefined}>
          <SideButtons />

          {/* id + transform-gpu: drawers render in here and position against the phone, not the window */}
          <div
            id="phone"
            className="relative flex h-svh flex-col bg-background sm:h-full sm:transform-gpu sm:w-full sm:overflow-hidden sm:rounded-[3rem] sm:shadow-[0_0_0_5px_#0a0a0a,0_0_0_6.5px_#52525b,0_10px_30px_rgba(0,0,0,0.9)]">
            {/* Dynamic island */}
            <div className="pointer-events-none absolute left-1/2 top-[11px] z-50 hidden h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black sm:block" />

            <StatusBar />
            {/* Key value resets the scroll position when changing reference so it dosn't transfer between pages */}
            <main key={path} className="flex-1 overflow-y-auto pt-[env(safe-area-inset-top)] sm:pt-0 sm:[scrollbar-width:none]">
              <Screen {...props} />
            </main>
            <TabBar path={path} />

            {/* Home indicator */}
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-50 hidden h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black sm:block" />
          </div>
        </div>
      </div>
    </div>
  )
}