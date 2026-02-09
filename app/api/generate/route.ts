import { NextResponse } from 'next/server'
import { generateVtuberPitch } from '@/lib/gemini/generate'
import type { GenerateRequest, GenerateResponse } from '@/types/vtuber'

export async function POST(request: Request) {
  try {
    const { vtuberName }: GenerateRequest = await request.json()

    // バリデーション
    if (!vtuberName || typeof vtuberName !== 'string') {
      return NextResponse.json<GenerateResponse>({
        success: false,
        error: 'Vtuber名を入力してください'
      }, { status: 400 })
    }

    if (vtuberName.length > 50) {
      return NextResponse.json<GenerateResponse>({
        success: false,
        error: 'Vtuber名は50文字以内で入力してください'
      }, { status: 400 })
    }

    // Gemini APIで生成
    const pitch = await generateVtuberPitch(vtuberName)

    return NextResponse.json<GenerateResponse>({
      success: true,
      data: pitch
    })

  } catch (error) {
    console.error('Generation error:', error)

    // APIキー未設定エラー
    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json<GenerateResponse>({
        success: false,
        error: 'サーバー設定エラー: APIキーが設定されていません'
      }, { status: 500 })
    }

    // その他のエラー（generate.tsからの具体的なメッセージをそのまま返す）
    const message = error instanceof Error
      ? error.message
      : 'プレゼン資料の生成に失敗しました。もう一度お試しください。'
    return NextResponse.json<GenerateResponse>({
      success: false,
      error: message
    }, { status: 500 })
  }
}
