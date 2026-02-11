import type { RecommendedVideo } from '@/types/vtuber'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

function getApiKey(): string | null {
  return process.env.YOUTUBE_API_KEY ?? null
}

function isValidChannelId(channelId: string): boolean {
  return /^UC[\w-]{22}$/.test(channelId)
}

function isHandle(value: string): boolean {
  return value.startsWith('@')
}

/**
 * ハンドル(@xxx)やチャンネルIDを受け取り、正規のchannelIdとアバターURLを返す。
 * channels APIを1回だけ叩いて両方解決する。
 */
export async function resolveChannelInfo(
  channelIdOrHandle: string
): Promise<{ channelId: string; avatarUrl: string } | null> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn('YOUTUBE_DATA_API_KEY is not set')
    return null
  }

  try {
    const url = new URL(`${YOUTUBE_API_BASE}/channels`)
    url.searchParams.set('part', 'snippet')
    if (isHandle(channelIdOrHandle)) {
      url.searchParams.set('forHandle', channelIdOrHandle.slice(1))
    } else if (isValidChannelId(channelIdOrHandle)) {
      url.searchParams.set('id', channelIdOrHandle)
    } else {
      return null
    }
    url.searchParams.set('key', apiKey)
    const res = await fetch(url)

    if (!res.ok) {
      const errorBody = await res.text()
      if (res.status === 403) {
        console.warn('YouTube API quota exceeded', errorBody)
      } else {
        console.error(`YouTube Channels API error: ${res.status}`, errorBody)
      }
      return null
    }

    const data = await res.json()
    const channel = data.items?.[0]
    if (!channel) return null

    const avatarUrl = channel.snippet?.thumbnails?.high?.url ?? ''
    return { channelId: channel.id, avatarUrl }
  } catch (error) {
    console.error('YouTube Channels API fetch failed:', error)
    return null
  }
}

/**
 * VTuber名でYouTubeチャンネルを検索し、最初にヒットしたチャンネルの情報を返す。
 * resolveChannelInfoで解決できなかった場合のフォールバック。
 */
export async function searchChannelByName(
  vtuberName: string
): Promise<{ channelId: string; avatarUrl: string } | null> {
  const apiKey = getApiKey()
  if (!apiKey) return null

  try {
    const url = new URL(`${YOUTUBE_API_BASE}/search`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('q', vtuberName)
    url.searchParams.set('type', 'channel')
    url.searchParams.set('maxResults', '1')
    url.searchParams.set('key', apiKey)
    const res = await fetch(url)

    if (!res.ok) return null

    const data = await res.json()
    const item = data.items?.[0]
    if (!item) return null

    const channelId = (item.id as Record<string, string>)?.channelId
    const snippet = item.snippet as Record<string, unknown> | undefined
    const thumbnails = snippet?.thumbnails as Record<string, Record<string, unknown>> | undefined
    const avatarUrl = (thumbnails?.high?.url as string) ?? ''

    return channelId ? { channelId, avatarUrl } : null
  } catch {
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

  if (!isValidChannelId(channelId)) {
    console.warn(`Invalid YouTube channel ID for first stream search: "${channelId}"`)
    return null
  }

  try {
    const url = new URL(`${YOUTUBE_API_BASE}/search`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('channelId', channelId)
    url.searchParams.set('q', `${vtuberName} 初配信`)
    url.searchParams.set('maxResults', '1')
    url.searchParams.set('type', 'video')
    url.searchParams.set('key', apiKey)
    const res = await fetch(url)

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(`YouTube Search API error (first stream): ${res.status}`, errorBody)
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
  maxResults: number = 3,
  query?: string
): Promise<RecommendedVideo[]> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn('YOUTUBE_DATA_API_KEY is not set')
    return []
  }

  if (!isValidChannelId(channelId)) {
    console.warn(`Invalid YouTube channel ID for popular videos: "${channelId}"`)
    return []
  }

  try {
    const url = new URL(`${YOUTUBE_API_BASE}/search`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('channelId', channelId)
    if (query) url.searchParams.set('q', query)
    url.searchParams.set('order', 'viewCount')
    url.searchParams.set('maxResults', String(maxResults))
    url.searchParams.set('type', 'video')
    url.searchParams.set('key', apiKey)
    const res = await fetch(url)

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(`YouTube Search API error: ${res.status}`, errorBody)
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
