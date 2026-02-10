import { LinkIcon } from 'lucide-react'
import type { GroundingSource } from '@/types/vtuber'

interface Props {
  sources: GroundingSource[]
}

export function GroundingSources({ sources }: Props) {
  if (sources.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">情報源</h2>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li key={index}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-400 transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{source.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
