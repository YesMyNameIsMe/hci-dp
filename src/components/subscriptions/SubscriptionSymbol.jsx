import { Camera, Cloud, Tv } from 'lucide-react'
import SpotifyMark from '@/components/icons/SpotifyMark'
import { cn } from '@/lib/utils'

const ICONS = { tv: Tv, cloud: Cloud, camera: Camera, spotify: SpotifyMark }

// Tinted merchant tile. `large` is the 76px version used on detail / sheet screens.
export default function SubscriptionSymbol({ icon, large = false, className }) {
  const Icon = ICONS[icon] ?? Tv
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center bg-secondary text-primary',
        large ? 'size-19 rounded-xl' : 'size-[42px] rounded-xl',
        className,
      )}
    >
      <Icon className={large ? 'size-14' : 'size-6'} />
    </span>
  )
}
