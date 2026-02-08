import { GoogleGenerativeAI } from '@google/generative-ai'

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  return new GoogleGenerativeAI(apiKey)
}
