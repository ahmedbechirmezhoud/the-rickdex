import { EpisodeUi } from "@/services/api/types"

export type EpisodeMeta = { season: number; episode: number }
const EP_CODE_RE = /S(\d{2})E(\d{2})/i

export function parseEpisodeCode(code: string): EpisodeMeta | null {
  const match = EP_CODE_RE.exec(code)
  if (!match) return null

  const season = Number.parseInt(match[1], 10)
  const episode = Number.parseInt(match[2], 10)

  if (Number.isNaN(season) || Number.isNaN(episode)) return null
  return { season, episode }
}

export type Row =
  | { type: "header"; season: number; title: string }
  | { type: "episode"; episode: EpisodeUi }

export function buildRows(episodes: EpisodeUi[]): { rows: Row[]; stickyHeaderIndices: number[] } {
  const bySeason = new Map<number, EpisodeUi[]>()
  const metaById = new Map<number, EpisodeMeta | null>()

  const getMeta = (ep: EpisodeUi) => {
    if (metaById.has(ep.id)) return metaById.get(ep.id) ?? null
    const meta = parseEpisodeCode(ep.episode)
    metaById.set(ep.id, meta)
    return meta
  }

  for (const ep of episodes) {
    const season = getMeta(ep)?.season ?? -1
    const list = bySeason.get(season) ?? []
    list.push(ep)
    bySeason.set(season, list)
  }

  const seasonNumbers = [...bySeason.keys()].sort((a, b) => a - b)

  const rows: Row[] = []
  const stickyHeaderIndices: number[] = []

  for (const season of seasonNumbers) {
    const list = bySeason.get(season) ?? []

    list.sort((a, b) => {
      const ma = getMeta(a)
      const mb = getMeta(b)

      if (!ma || !mb) return a.id - b.id
      if (ma.season !== mb.season) return ma.season - mb.season
      return ma.episode - mb.episode
    })

    stickyHeaderIndices.push(rows.length)
    rows.push({
      type: "header",
      season,
      title: season >= 0 ? `Season ${season}` : "Unknown season",
    })

    for (const ep of list) rows.push({ type: "episode", episode: ep })
  }

  return { rows, stickyHeaderIndices }
}

export function getEpLabel(code?: string): string {
  if (!code) return ""
  const parsed = parseEpisodeCode(code)
  if (!parsed) return "EP"
  return `EP${String(parsed.episode).padStart(2, "0")}`
}
