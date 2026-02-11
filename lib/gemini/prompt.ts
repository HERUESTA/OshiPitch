import type { AgencyConfig } from '@/lib/agencies'

// Phase 1: リサーチ用（Google Search Grounding + urlContext有効）
export const RESEARCH_INSTRUCTION = `
あなたはVtuberの情報を正確に調査するリサーチャーです。
Google検索とURLコンテキストを活用して、事実に基づいた情報のみを提供してください。

【調査項目】
1. 正式名称と所属事務所
2. デビュー日（正確な日付）
3. YouTubeチャンネルID（UCから始まるID）
4. 配信スタイル・活動ジャンル（ゲーム実況、歌枠、雑談など）
5. 活動内容の特徴

【情報源の優先順位】
1. 所属事務所の公式サイト（最優先）
2. 本人のYouTubeチャンネル概要欄
3. 本人の公式X（Twitter）
4. VTuber専門Wiki
5. その他信頼できるニュースソース

【主要VTuber事務所の公式サイト】
- にじさんじ: https://www.nijisanji.jp/talents
- ホロライブ: https://hololive.hololivepro.com/talents

【重要】
- まず公式サイトの情報を確認し、それを基準とする
- 公式サイトと他ソースで矛盾する場合は公式を優先する
- 検索で確認できた情報のみ記載する
- 確認できなかった項目は「不明」と記載する
- YouTubeチャンネルIDは必ず正確に記載する
- 前世と書かれているソースは参考にしないでください
`

export function createResearchPrompt(vtuberName: string, agency?: AgencyConfig): string {
  let prompt = `以下のVtuberについて、正確な情報を調査してください。\n\nVtuber名: ${vtuberName}`
  if (agency) {
    prompt += `\n\n【所属事務所の公式サイト】\n${agency.name}: ${agency.talentListUrl}\nこのURLの情報を最優先で参照してください。`
  }
  return prompt
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
3. 配信スタイル（2〜4個のタグ形式、例: 「ゲーム実況」「歌枠」「雑談」）
4. こんな人におすすめ（3つ）
`
}
