import Image from 'next/image'
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
        <div className="flex items-start gap-4">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-bold">
              {profile.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <CardTitle className="text-3xl">{profile.name}</CardTitle>
              {profile.affiliation && (
                <Badge variant="secondary">{profile.affiliation}</Badge>
              )}
            </div>
          </div>
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
