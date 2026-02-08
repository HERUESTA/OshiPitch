import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import type { RecommendedVideo } from '@/types/vtuber'

interface Props {
  video: RecommendedVideo
}

export function RecommendedVideoCard({ video }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-start justify-between">
          <span className="flex-1">{video.title}</span>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{video.description}</p>
      </CardContent>
    </Card>
  )
}
