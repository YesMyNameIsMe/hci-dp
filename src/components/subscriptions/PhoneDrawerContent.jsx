import { useLayoutEffect, useState } from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '@/lib/utils'

// Bottom-sheet content that lives INSIDE the phone frame (#phone).
// It portals into #phone and uses `absolute` (not `fixed`), so it is positioned
// against and clipped by the phone no matter how the viewport/transform behaves.
function usePhoneElement() {
  const [el, setEl] = useState(null)
  useLayoutEffect(() => {
    setEl(document.getElementById('phone'))
  }, [])
  return el
}

export default function PhoneDrawerContent({ className, children, ...props }) {
  const phone = usePhoneElement()

  return (
    <DrawerPrimitive.Portal container={phone ?? undefined}>
      <DrawerPrimitive.Overlay
        data-slot="drawer-overlay"
        className="absolute inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'absolute inset-x-0 bottom-0 z-50 flex h-auto max-h-[80%] flex-col rounded-t-xl border-t bg-popover text-sm text-popover-foreground',
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-[5px] w-[134px] shrink-0 rounded-full bg-foreground" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  )
}
