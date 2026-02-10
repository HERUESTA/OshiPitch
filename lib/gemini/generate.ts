import { getGeminiClient } from './client'
import {
  RESEARCH_INSTRUCTION,
  createResearchPrompt,
  STRUCTURE_INSTRUCTION,
  createStructurePrompt,
} from './prompt'
import { fetchChannelInfo, fetchFirstStreamVideo, fetchPopularVideos } from '@/lib/youtube'
import type { VtuberPitch, GroundingSource } from '@/types/vtuber'

// Phase 1: Google Search Groundingでリサーチ
async function researchVtuber(vtuberName: string) {
  const ai = getGeminiClient()

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: createResearchPrompt(vtuberName),
    config: {
      systemInstruction: RESEARCH_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  })

  const researchText = response.text ?? ''

  // groundingMetadataから情報源を抽出
  const sources: GroundingSource[] = []
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata
  if (groundingMetadata?.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      const web = chunk.web
      if (web?.uri && web?.title) {
        sources.push({ title: web.title, url: web.uri })
      }
    }
  }

  return { researchText, sources }
}

// Phase 2: リサーチ結果を構造化JSON出力
async function structureVtuberPitch(researchText: string): Promise<VtuberPitch> {
  const ai = getGeminiClient()

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: createStructurePrompt(researchText),
    config: {
      systemInstruction: STRUCTURE_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          profile: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              affiliation: { type: 'STRING', nullable: true },
              debutDate: { type: 'STRING' },
              youtubeChannelId: { type: 'STRING' },
            },
            required: ['name', 'affiliation', 'debutDate'],
          },
          catchphrase: { type: 'STRING' },
          streamingStyles: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            minItems: '2',
            maxItems: '4',
          },
          recommendedFor: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            minItems: '3',
            maxItems: '3',
          },
        },
        required: ['profile', 'catchphrase', 'streamingStyles', 'recommendedFor'],
      },
    },
  })

  const text = response.text ?? '{}'
  return JSON.parse(text) as VtuberPitch
}

export async function generateVtuberPitch(vtuberName: string): Promise<VtuberPitch> {
  // Phase 1: リサーチ
  let researchText: string
  let sources: GroundingSource[]
  try {
    const result = await researchVtuber(vtuberName)
    researchText = result.researchText
    sources = result.sources
  } catch (error) {
    console.error(`Research failed for "${vtuberName}":`, error)
    throw new Error('情報の取得に失敗しました。正確なVTuber名を入力してください。')
  }

  if (!researchText) {
    throw new Error('VTuberの情報が見つかりませんでした。正確な名前を入力してください。')
  }

  // Phase 2: 構造化
  let pitch: VtuberPitch
  try {
    pitch = await structureVtuberPitch(researchText)
  } catch (error) {
    console.error(`Structure failed for "${vtuberName}":`, error)
    throw new Error('プレゼン資料の生成に失敗しました。もう一度お試しください。')
  }

  // YouTube API: アバター画像と人気動画を取得
  const channelId = pitch.profile.youtubeChannelId
  if (channelId) {
    const [channelInfo, firstStream, videos] = await Promise.all([
      fetchChannelInfo(channelId),
      fetchFirstStreamVideo(channelId, vtuberName),
      fetchPopularVideos(channelId, 6),
    ])
    if (channelInfo) {
      pitch.profile.avatarUrl = channelInfo.avatarUrl
    }
    pitch.firstStreamVideo = firstStream ?? undefined
    pitch.recommendedVideos = videos
  } else {
    pitch.recommendedVideos = []
  }

  // 情報源を付与
  pitch.sources = sources

  return pitch
}
