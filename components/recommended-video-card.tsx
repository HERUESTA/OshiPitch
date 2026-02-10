import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { RecommendedVideo } from '@/types/vtuber'

interface Props {
  video: RecommendedVideo
}

export function RecommendedVideoCard({ video }: Props) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group rounded-xl overflow-hidden border border-border/50 bg-card/50"
    >
      <div className="relative aspect-video">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-3 flex items-start justify-between gap-2">
        <p className="text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
          {video.title}
        </p>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </a>
  )
}
