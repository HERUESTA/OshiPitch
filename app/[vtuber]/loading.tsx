'use client'

import { useEffect, useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const steps = [
  { label: 'リサーチ中...', duration: 3000 },
  { label: '構成中...', duration: 6000 },
  { label: '動画取得中...', duration: 4000 },
]

function useStepProgress(steps: { label: string; duration: number }[]): number {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep >= steps.length - 1) return

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, steps[currentStep].duration)

    return () => clearTimeout(timer)
  }, [currentStep, steps])

  return currentStep
}

export default function VtuberLoading() {
  const currentStep = useStepProgress(steps)

  return (
    <div className="min-h-screen home-glow">
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-center gap-2">
          <Star className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-muted-foreground">OshiPitch</span>
        </div>
      </header>

      <main className="px-6 py-8 md:px-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* ステップ進捗 */}
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            <div className="flex items-center gap-3">
              {steps.map((step, i) => (
                <span
                  key={step.label}
                  className={`text-sm transition-colors duration-300 ${
                    i === currentStep
                      ? 'text-purple-400 font-medium'
                      : i < currentStep
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/40'
                  }`}
                >
                  {i < currentStep ? '✓' : i === currentStep ? '●' : '○'} {step.label}
                </span>
              ))}
            </div>
          </div>

          {/* プロフィールカード スケルトン */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* 配信スタイル スケルトン */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          {/* こんな人におすすめ スケルトン */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>

          {/* おすすめ動画 スケルトン */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-36" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
