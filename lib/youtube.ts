import type { RecommendedVideo } from '@/types/vtuber'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

function getApiKey(): string | null {
  return process.env.YOUTUBE_API_KEY ?? null
}

/**
 * チャンネルIDからアバター画像URLを取得する
 */
export async function fetchChannelInfo(
  channelId: string
): Promise<{ avatarUrl: string } | null> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn('YOUTUBE_DATA_API_KEY is not set')
    return null
  }

  try {
    const url = `${YOUTUBE_API_BASE}/channels?part=snippet&id=${encodeURIComponent(channelId)}&key=${apiKey}`
    const res = await fetch(url)

    if (!res.ok) {
      if (res.status === 403) {
        console.warn('YouTube API quota exceeded')
      } else {
        console.error(`YouTube Channels API error: ${res.status}`)
      }
      return null
    }

    const data = await res.json()
    const channel = data.items?.[0]
    if (!channel) return null

    const avatarUrl = channel.snippet?.thumbnails?.high?.url
    return avatarUrl ? { avatarUrl } : null
  } catch (error) {
    console.error('YouTube Channels API fetch failed:', error)
    return null
  }
}

/**
 * チャンネルの初配信動画を検索する
 */
export async function fetchFirstStreamVideo(
  channelId: string,
  vtuberName: string
): Promise<RecommendedVideo | null> {
  const apiKey = getApiKey()
  if (!apiKey) return null

  try {
    const query = encodeURIComponent(`${vtuberName} 初配信`)
    const url = `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${encodeURIComponent(channelId)}&q=${query}&maxResults=1&type=video&key=${apiKey}`
    const res = await fetch(url)

    if (!res.ok) {
      console.error(`YouTube Search API error (first stream): ${res.status}`)
      return null
    }

    const data = await res.json()
    const item = data.items?.[0]
    if (!item) return null

    const snippet = item.snippet as Record<string, unknown> | undefined
    const id = item.id as Record<string, string> | undefined
    const thumbnails = snippet?.thumbnails as Record<string, Record<string, unknown>> | undefined

    return {
      title: (snippet?.title as string) ?? '',
      url: `https://www.youtube.com/watch?v=${id?.videoId ?? ''}`,
      thumbnailUrl: (thumbnails?.high?.url as string) ?? '',
    }
  } catch (error) {
    console.error('YouTube first stream search failed:', error)
    return null
  }
}

/**
 * チャンネルIDから人気動画を取得する
 */
export async function fetchPopularVideos(
  channelId: string,
  maxResults: number = 3
): Promise<RecommendedVideo[]> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn('YOUTUBE_DATA_API_KEY is not set')
    return []
  }

  try {
    const url = `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${encodeURIComponent(channelId)}&order=viewCount&maxResults=${maxResults}&type=video&key=${apiKey}`
    const res = await fetch(url)

    if (!res.ok) {
      console.error(`YouTube Search API error: ${res.status}`)
      return []
    }

    const data = await res.json()
    const items = data.items ?? []

    return items.map((item: Record<string, unknown>) => {
      const snippet = item.snippet as Record<string, unknown> | undefined
      const id = item.id as Record<string, string> | undefined
      const thumbnails = snippet?.thumbnails as Record<string, Record<string, unknown>> | undefined
      return {
        title: (snippet?.title as string) ?? '',
        url: `https://www.youtube.com/watch?v=${id?.videoId ?? ''}`,
        thumbnailUrl: (thumbnails?.high?.url as string) ?? '',
      }
    })
  } catch (error) {
    console.error('YouTube Search API fetch failed:', error)
    return []
  }
}
