// Phase 1: リサーチ用（Google Search Grounding有効）
export const RESEARCH_INSTRUCTION = `
あなたはVtuberの情報を正確に調査するリサーチャーです。
Google検索を活用して、事実に基づいた情報のみを提供してください。

【調査項目】
1. 正式名称と所属事務所
2. デビュー日（正確な日付）
3. YouTubeチャンネルID（UCから始まるID）
4. YouTubeチャンネルの実在する人気動画（URLを含む）
5. 有名なエピソードや名言
6. 活動内容の特徴

【重要】
- 検索で確認できた情報のみ記載する
- 確認できなかった項目は「不明」と記載する
- 動画URLは検索結果から取得した実在するもののみ
- YouTubeチャンネルIDは必ず正確に記載する
`

export function createResearchPrompt(vtuberName: string): string {
  return `以下のVtuberについて、Google検索で正確な情報を調査してください。\n\nVtuber名: ${vtuberName}`
}

// Phase 2: 構造化用（Grounding無効、JSON Schema出力）
export const STRUCTURE_INSTRUCTION = `
あなたはVtuberの布教資料を構成するアシスタントです。
提供された調査結果をもとに、魅力的な布教資料を構造化してください。
調査結果にない情報を追加しないでください。
ポジティブで魅力的な表現を使い、日本語で回答してください。
`

export function createStructurePrompt(researchResult: string): string {
  return `
以下の調査結果をもとに、布教資料を構造化してください。
調査結果にない情報は追加しないでください。

【調査結果】
${researchResult}

以下の情報を含めてください：
1. 基本プロフィール（名前、所属、デビュー日、YouTubeチャンネルID）
2. 魅力的なキャッチコピー（15文字以内）
3. こんな人におすすめ（3つ）
4. おすすめ動画（2〜3本、タイトル・URL・おすすめ理由）
5. 印象的な名言やエピソード（1〜3個）
`
}
