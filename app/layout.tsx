import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OshiPitch',
  description: '推しの魅力を伝えるプレゼン資料を、AIが自動生成するサービス',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
