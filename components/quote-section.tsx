import { Card, CardContent } from '@/components/ui/card'

interface Props {
  quotes: string[]
}

export function QuoteSection({ quotes }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">名言・エピソード</h2>
      <div className="space-y-3">
        {quotes.map((quote, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <p className="text-lg italic">「{quote}」</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
