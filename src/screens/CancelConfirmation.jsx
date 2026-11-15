import ConfirmationScreen from '@/components/subscriptions/ConfirmationScreen'
import { useRedirectIf } from '@/lib/navigate'
import { useSubscriptions } from '@/lib/subscriptions'

export default function CancelConfirmation({ id }) {
  const sub = useSubscriptions().find((s) => s.id === id)
  // Only reachable after finishing the guided cancel flow
  useRedirectIf(!sub || sub.status !== 'canceled', sub ? `/subscriptions/${id}` : '/subscriptions')
  if (!sub || sub.status !== 'canceled') return null

  return (
    <ConfirmationScreen
      sub={sub}
      title="Subscription Canceled"
      message={`By canceling ${sub.name}, you saved:`}
    />
  )
}
