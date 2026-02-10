import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { VtuberProfile } from '@/types/vtuber'

interface Props {
  profile: VtuberProfile
  catchphrase: string
}

export function VtuberProfileCard({ profile, catchphrase }: Props) {
  const channelUrl = profile.youtubeChannelId
    ? `https://www.youtube.com/channel/${profile.youtubeChannelId}`
    : null

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex items-start gap-4">
        {/* アバター */}
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={64}
            height={64}
            className="rounded-full shrink-0"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-bold shrink-0">
            {profile.name.charAt(0)}
          </div>
        )}

        {/* 情報 */}
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-2xl font-bold truncate">{profile.name}</h1>
          <p className="text-sm text-purple-400 font-medium">{catchphrase}</p>
          <p className="text-xs text-muted-foreground">
            {profile.affiliation && <span>{profile.affiliation} · </span>}
            デビュー: {profile.debutDate}
          </p>
        </div>

        {/* チャンネルボタン */}
        {channelUrl && (
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            チャンネルへ
          </a>
        )}
      </div>
    </div>
  )
}
