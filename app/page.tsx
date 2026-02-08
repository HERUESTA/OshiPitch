'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [vtuberName, setVtuberName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vtuberName })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // 結果ページへ遷移
      router.push(`/${encodeURIComponent(vtuberName)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-2xl space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold mb-4">OshiPitch</h1>
          <p className="text-xl text-muted-foreground">
            推しの魅力を伝えるプレゼン資料を、AIが自動生成
          </p>
        </div>

        {/* 入力フォーム */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Vtuber名を入力してください"
              value={vtuberName}
              onChange={(e) => setVtuberName(e.target.value)}
              disabled={isLoading}
              className="text-lg"
            />
            <Button type="submit" disabled={isLoading || !vtuberName.trim()} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                '生成する'
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>

        {/* 機能説明 */}
        <div className="bg-muted/50 p-6 rounded-lg space-y-2">
          <p className="text-sm text-muted-foreground">🎤 Vtuber名を入力するだけで布教資料を自動生成</p>
          <p className="text-sm text-muted-foreground">🔗 生成した資料をそのままシェア</p>
          <p className="text-sm text-muted-foreground">✨ Gemini APIで高品質な内容を生成</p>
        </div>
      </div>
    </main>
  )
}
