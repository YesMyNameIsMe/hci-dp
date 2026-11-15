import { Card } from '@/components/ui/card'

export default function SummaryCard({ label, amount, detail }) {
  return (
    <Card className="gap-2 rounded-[18px] bg-secondary p-[18px] ring-primary/20">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="flex items-baseline gap-2">
        <span className="text-4xl font-medium">{amount}</span>
        <span className="text-[13px] text-muted-foreground">{detail}</span>
      </p>
    </Card>
  )
}
