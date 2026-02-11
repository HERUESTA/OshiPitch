import { notFound } from 'next/navigation'
import { generateVtuberPitch } from '@/lib/gemini/generate'
import { VtuberProfileCard } from '@/components/vtuber-profile-card'
import { RecommendedVideoCard } from '@/components/recommended-video-card'
import { GroundingSources } from '@/components/grounding-sources'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, Share2, ExternalLink } from 'lucide-react'
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
      <div className="min-h-screen home-glow">
        {/* トップグラデーションライン */}
        <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

        {/* トップバー */}
        <header className="border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-center gap-2">
            <Star className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-muted-foreground">OshiPitch</span>
          </div>
        </header>

        <main className="px-6 py-8 md:px-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ナビゲーション */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Link>
            </div>

            {/* プロフィールカード */}
            <VtuberProfileCard profile={pitch.profile} catchphrase={pitch.catchphrase} />

            {/* 配信スタイル */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold">配信スタイル</h2>
              <div className="flex flex-wrap gap-2">
                {pitch.streamingStyles.map((style, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-4 py-1.5 rounded-full">
                    {style}
                  </Badge>
                ))}
              </div>
            </section>

            {/* 初配信動画 */}
            {pitch.firstStreamVideo && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold">初配信</h2>
                <div className="rounded-xl overflow-hidden border border-border/50">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${new URL(pitch.firstStreamVideo.url).searchParams.get('v')}`}
                      title={pitch.firstStreamVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="px-4 py-2 flex items-center gap-1.5 text-xs text-muted-foreground bg-card/50">
                    <span>提供:</span>
                    <span className="font-medium">YouTube</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{pitch.firstStreamVideo.title}</p>
              </section>
            )}

            {/* こんな人におすすめ */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold">こんな人におすすめ</h2>
              <ul className="space-y-3">
                {pitch.recommendedFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-purple-400 mt-0.5">✨</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* おすすめ動画 */}
            {pitch.recommendedVideos.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold">おすすめ動画</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pitch.recommendedVideos.slice(0, 6).map((video, index) => (
                    <RecommendedVideoCard key={index} video={video} />
                  ))}
                </div>
              </section>
            )}

            {/* 情報源 */}
            {pitch.sources && pitch.sources.length > 0 && (
              <GroundingSources sources={pitch.sources} />
            )}
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Failed to generate pitch:', error)
    notFound()
  }
}
