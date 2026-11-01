import ScreenHeader from '@/components/ScreenHeader'

//just a standin
export default function Placeholder({ title }) {
  return (
    <>
      <ScreenHeader title={title} />
      <p className="px-4 py-16 text-center text-muted-foreground">Coming soon</p>
    </>
  )
}
