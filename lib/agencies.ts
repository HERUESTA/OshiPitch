export interface AgencyConfig {
  name: string           // 事務所名
  aliases: string[]      // 表記ゆれ対応
  talentListUrl: string  // タレント一覧ページURL
}

export const AGENCIES: AgencyConfig[] = [
  {
    name: 'にじさんじ',
    aliases: ['nijisanji', 'にじさんじ', 'anycolor'],
    talentListUrl: 'https://www.nijisanji.jp/talents',
  },
  {
    name: 'ホロライブ',
    aliases: ['hololive', 'ホロライブ', 'cover'],
    talentListUrl: 'https://hololive.hololivepro.com/talents',
  },
]

export function findAgency(text: string): AgencyConfig | undefined {
  const lower = text.toLowerCase()
  return AGENCIES.find((agency) =>
    agency.aliases.some((alias) => lower.includes(alias.toLowerCase()))
  )
}
