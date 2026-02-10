// Vtuberプレゼン資料の型定義
export interface VtuberProfile {
  name: string
  affiliation: string | null      // 所属（個人勢の場合null）
  debutDate: string                // YYYY-MM-DD形式
  youtubeChannelId?: string        // UCxxx形式
  avatarUrl?: string               // YouTube アバター画像URL
}

export interface RecommendedVideo {
  title: string
  url: string
  thumbnailUrl: string             // YouTube APIから取得
}

export interface GroundingSource {
  title: string
  url: string
}

export interface VtuberPitch {
  profile: VtuberProfile
  catchphrase: string
  streamingStyles: string[]        // 配信スタイル（2〜4個）
  recommendedFor: string[]         // 3つのおすすめポイント
  firstStreamVideo?: RecommendedVideo     // 初配信動画
  recommendedVideos: RecommendedVideo[]  // YouTube APIから取得（Top3）
  sources?: GroundingSource[]      // 情報源
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
