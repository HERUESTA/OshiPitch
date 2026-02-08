import { getGeminiClient } from './client'
import { SYSTEM_INSTRUCTION, createUserPrompt } from './prompt'
import type { VtuberPitch } from '@/types/vtuber'

export async function generateVtuberPitch(vtuberName: string): Promise<VtuberPitch> {
  const genAI = getGeminiClient()

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object' as const,
        properties: {
          profile: {
            type: 'object' as const,
            properties: {
              name: { type: 'string' as const },
              affiliation: { type: 'string' as const, nullable: true },
              debutDate: { type: 'string' as const }
            },
            required: ['name', 'affiliation', 'debutDate']
          },
          catchphrase: { type: 'string' as const },
          recommendedFor: {
            type: 'array' as const,
            items: { type: 'string' as const },
            minItems: 3,
            maxItems: 3
          },
          recommendedVideos: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                title: { type: 'string' as const },
                url: { type: 'string' as const },
                description: { type: 'string' as const }
              },
              required: ['title', 'url', 'description']
            },
            minItems: 2,
            maxItems: 3
          },
          quotes: {
            type: 'array' as const,
            items: { type: 'string' as const },
            minItems: 1,
            maxItems: 3
          }
        },
        required: ['profile', 'catchphrase', 'recommendedFor', 'recommendedVideos', 'quotes']
      }
    },
    systemInstruction: SYSTEM_INSTRUCTION
  })

  const result = await model.generateContent(createUserPrompt(vtuberName))
  const response = result.response
  const text = response.text()

  // JSONをパース
  const pitch: VtuberPitch = JSON.parse(text)

  return pitch
}
