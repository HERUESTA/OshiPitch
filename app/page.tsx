export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">OshiPitch</h1>
        <p className="text-xl mb-8">推しの魅力を伝えるプレゼン資料を、AIが自動生成</p>
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
          <p className="mb-2">🎤 Vtuber名を入力するだけで布教資料を自動生成</p>
          <p className="mb-2">🔗 生成した資料をそのままシェア</p>
          <p>✨ Gemini APIで高品質な内容を生成</p>
        </div>
      </div>
    </main>
  )
}
