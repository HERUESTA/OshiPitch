/**
 * YouTubeチャンネルIDからアバター画像URLを構築する。
 * yt3.ggpht.com はYouTubeのプロフィール画像CDN。
 */
export function buildYouTubeAvatarUrl(channelId: string, size: number = 240): string {
  return `https://yt3.ggpht.com/${channelId}=s${size}-c-k-c0x00ffffff-no-rj`
}
