// Vtuberプレゼン資料の型定義
export interface VtuberProfile {
  name: string
  affiliation: string | null      // 所属（個人勢の場合null）
  debutDate: string                // YYYY-MM-DD形式
}

export interface RecommendedVideo {
  title: string
  url: string
  description: string              // なぜおすすめか
}

export interface VtuberPitch {
  profile: VtuberProfile
  catchphrase: string
  recommendedFor: string[]         // 3つのおすすめポイント
  recommendedVideos: RecommendedVideo[]  // 2〜3本
  quotes: string[]                 // 名言・エピソード（1〜3個）
}

// API Request/Response型
export interface GenerateRequest {
  vtuberName: string
}

export interface GenerateResponse {
  success: boolean
  data?: VtuberPitch
  error?: string
}
