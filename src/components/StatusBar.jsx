import { useEffect, useState } from 'react'
import { BatteryFull, SignalHigh, Wifi } from 'lucide-react'

const formatTime = (date) =>
  date
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    .replace(/\s?[AP]M$/i, '')

// Iphone status bar (top right of iphone)
export default function StatusBar() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="hidden h-11 shrink-0 items-center justify-between px-8 text-sm font-semibold sm:flex"
    >
      <span>{formatTime(now)}</span>
      <span className="flex items-center gap-1.5">
        <SignalHigh className="size-4" />
        <Wifi className="size-4" />
        <BatteryFull className="size-5" />
      </span>
    </div>
  )
}
