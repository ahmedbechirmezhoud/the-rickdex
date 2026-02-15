import { EpisodeUi } from "@/services/api/types"
import type { Row } from "@/utils/episodes"

export function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
}

export type SearchableEpisode = {
  episode: EpisodeUi
  searchName: string
  searchCode: string
}

export type SearchMode = "none" | "exact" | "empty"

export function getExactRank(item: SearchableEpisode, query: string, tokens: string[]) {
  // lower is better
  const code = item.searchCode
  const name = item.searchName

  if (code === query) return 0
  if (code.startsWith(query)) return 1
  if (name.startsWith(query)) return 2

  const allTokensInCode = tokens.length > 0 && tokens.every((t) => code.includes(t))
  const allTokensInName = tokens.length > 0 && tokens.every((t) => name.includes(t))

  if (allTokensInCode) return 3
  if (allTokensInName) return 4

  if (code.includes(query)) return 5
  if (name.includes(query)) return 6

  return 7
}

export type UseEpisodesSearchReturn = {
  search: string
  setSearch: (value: string) => void

  isSearching: boolean
  mode: SearchMode
  episodes: EpisodeUi[]

  rows: Row[]
  stickyHeaderIndices: number[]

  normalizedSearch: string
}

export function hasReachedS05E10(episodes: EpisodeUi[]) {
  // “reached” means your currently loaded list contains S05E10
  return episodes.some((ep) => normalizeText(ep.episode) === "s05e10")
}
