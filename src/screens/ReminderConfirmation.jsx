import ConfirmationScreen from '@/components/subscriptions/ConfirmationScreen'
import { useRedirectIf } from '@/lib/navigate'
import { useSubscriptions } from '@/lib/subscriptions'

export default function ReminderConfirmation({ id }) {
  const sub = useSubscriptions().find((s) => s.id === id)
  // Only reachable after setting a reminder
  useRedirectIf(!sub || sub.reminderDays == null, sub ? `/subscriptions/${id}` : '/subscriptions')
  if (!sub || sub.reminderDays == null) return null

  return (
    <ConfirmationScreen
      sub={sub}
      title="Reminder Set"
      message={`When you cancel ${sub.name}, you’ll save:`}
      emphasizeAmount
    />
  )
}
