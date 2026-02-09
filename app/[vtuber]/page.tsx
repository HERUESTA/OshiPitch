import { notFound } from 'next/navigation'
import { generateVtuberPitch } from '@/lib/gemini/generate'
import { VtuberProfileCard } from '@/components/vtuber-profile-card'
import { RecommendedVideoCard } from '@/components/recommended-video-card'
import { QuoteSection } from '@/components/quote-section'
import { GroundingSources } from '@/components/grounding-sources'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ vtuber: string }>
}

export default async function VtuberPage({ params }: PageProps) {
  const resolvedParams = await params
  const vtuberName = decodeURIComponent(resolvedParams.vtuber)

  try {
    const pitch = await generateVtuberPitch(vtuberName)

    return (
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              URLをコピー
            </Button>
          </div>

          {/* プロフィールカード */}
          <VtuberProfileCard profile={pitch.profile} catchphrase={pitch.catchphrase} />

          <Separator />

          {/* こんな人におすすめ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">こんな人におすすめ</h2>
            <ul className="space-y-2">
              {pitch.recommendedFor.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">✨</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* おすすめ動画 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">おすすめ動画</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pitch.recommendedVideos.map((video, index) => (
                <RecommendedVideoCard key={index} video={video} />
              ))}
            </div>
          </section>

          <Separator />

          {/* 名言・エピソード */}
          <QuoteSection quotes={pitch.quotes} />

          {/* 情報源 */}
          {pitch.sources && pitch.sources.length > 0 && (
            <>
              <Separator />
              <GroundingSources sources={pitch.sources} />
            </>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('Failed to generate pitch:', error)
    notFound()
  }
}
