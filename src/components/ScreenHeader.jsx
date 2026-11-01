import { ChevronLeft } from 'lucide-react'

export default function ScreenHeader({ title, backHref = '#/' }) {
  return (
    <header className="sticky top-0 z-10 bg-background px-4 pt-3">
      <div className="flex items-center gap-1 border-b pb-3">
        <a
          href={backHref}
          aria-label="Back"
          className="-ml-2 flex size-11 items-center justify-center rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </a>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
    </header>
  )
}
