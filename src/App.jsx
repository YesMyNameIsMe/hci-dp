import StatusBar from '@/components/StatusBar'
import TabBar from '@/components/TabBar'
import { useRoute } from '@/lib/router'
import Home from '@/screens/Home'
import Placeholder from '@/screens/Placeholder'
import Purchases from '@/screens/Purchases'

const ROUTES = {
  '/': Home,
  '/subscriptions': () => <Placeholder title="Active Subscriptions" />,
  '/purchases': Purchases,
  '/budget': () => <Placeholder title="Budget & Alerts" />,
}

export default function App() {
  const path = useRoute()
  const Screen = ROUTES[path] ?? ROUTES['/']

  return (
    /* Phone styling */
    <div className="min-h-svh sm:grid sm:place-items-center sm:bg-stone-300 sm:p-8">
      {/* id + transform-gpu: drawers render in here and position against the phone, not the window */}
      <div
        id="phone"
        className="flex h-svh flex-col bg-background sm:h-[min(844px,calc(100svh-4rem))] sm:transform-gpu sm:w-[390px] sm:overflow-hidden sm:rounded-[3rem] sm:shadow-2xl sm:ring-[10px] sm:ring-neutral-900">
        <StatusBar />
        {/* Key value resets the scroll position when changing reference so it dosn't transfer between pages */}
        <main key={path} className="flex-1 overflow-y-auto pt-[env(safe-area-inset-top)] sm:pt-0 sm:[scrollbar-width:none]">
          <Screen />
        </main>
        <TabBar path={path} />
      </div>
    </div>
  )
}
