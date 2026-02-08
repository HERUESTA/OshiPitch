import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { VtuberProfile } from '@/types/vtuber'

interface Props {
  profile: VtuberProfile
  catchphrase: string
}

export function VtuberProfileCard({ profile, catchphrase }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-3xl">{profile.name}</CardTitle>
          {profile.affiliation && (
            <Badge variant="secondary">{profile.affiliation}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xl font-semibold text-primary">{catchphrase}</p>
        <p className="text-sm text-muted-foreground">
          デビュー日: {profile.debutDate}
        </p>
      </CardContent>
    </Card>
  )
}
