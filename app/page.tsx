'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Star, Search, Sparkles, Loader2, Pencil, Share2, Zap } from 'lucide-react'

const features = [
  { icon: Pencil, color: 'text-purple-400', bg: 'bg-purple-400/10', title: '名前を入れるだけ', desc: 'VTuber名を入力するだけで布教資料を自動生成' },
  { icon: Share2, color: 'text-pink-400', bg: 'bg-pink-400/10', title: 'そのままシェア', desc: '生成した資料をそのままシェアできる' },
  { icon: Zap, color: 'text-teal-400', bg: 'bg-teal-400/10', title: '高品質な生成', desc: 'Gemini APIで高品質な内容を生成' },
]

export default function Home() {
  const [vtuberName, setVtuberName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = vtuberName.trim()
    if (!trimmed) {
      setError('VTuber名を入力してください')
      return
    }
    if (trimmed.length > 50) {
      setError('VTuber名は50文字以内で入力してください')
      return
    }

    setIsLoading(true)
    router.push(`/${encodeURIComponent(trimmed)}`)
  }

  return (
    <main className="home-glow flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-2xl space-y-10">
        {/* ヘッダー */}
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="rounded-full border border-purple-500/30 bg-purple-500/10 p-3">
              <Star className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white">OshiPitch</h1>
          <p className="text-lg text-muted-foreground">
            推しの魅力を伝えるプレゼン資料を、
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">AI</span>
            が自動生成
          </p>
        </div>

        {/* 検索バー */}
        <form onSubmit={handleGenerate}>
          <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-[1px]">
            <div className="flex items-center rounded-xl bg-background px-4 py-2">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="VTuber名を入力してください"
                value={vtuberName}
                onChange={(e) => setVtuberName(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !vtuberName.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    生成する
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>

        {/* フィーチャーカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3"
            >
              <div className={`inline-flex rounded-lg ${feature.bg} p-2`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
