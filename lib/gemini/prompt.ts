export const SYSTEM_INSTRUCTION = `
あなたはVtuberの魅力を分析し、布教資料を作成するアシスタントです。

【重要なルール】
1. 正確な情報のみを提供する（憶測で情報を作らない）
2. 推測の場合は「推測」と明記する
3. 動画URLは実在するもののみ提供（youtu.be形式）
4. ポジティブで魅力的な表現を使う
5. 日本語で回答する
`

export function createUserPrompt(vtuberName: string): string {
  return `
以下のVtuberについて、布教資料を作成してください。

Vtuber名: ${vtuberName}

以下の情報を含めてください：
1. 基本プロフィール（名前、所属、デビュー日）
2. 魅力的なキャッチコピー（15文字以内）
3. こんな人におすすめ（3つ）
4. おすすめ動画（2〜3本、タイトル・URL・おすすめ理由）
5. 印象的な名言やエピソード（1〜3個）
`
}
