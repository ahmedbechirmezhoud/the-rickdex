import { useEffect, useMemo, useRef, useState } from "react"

import { api } from "@/services/api"
import type { EpisodeUi } from "@/services/api/types"
import { buildRows } from "@/utils/episodes"
import {
  getExactRank,
  hasReachedS05E10,
  normalizeText,
  SearchableEpisode,
  SearchMode,
  UseEpisodesSearchReturn,
} from "@/utils/searchHelper"

function rankEpisodesForQuery(episodes: EpisodeUi[], normalizedQuery: string, tokens: string[]) {
  const searchable: SearchableEpisode[] = episodes.map((ep) => ({
    episode: ep,
    searchName: normalizeText(ep.name),
    searchCode: normalizeText(ep.episode),
  }))

  const exactItems = searchable.filter((item) =>
    tokens.every((t) => item.searchName.includes(t) || item.searchCode.includes(t)),
  )

  if (exactItems.length === 0) return [] as EpisodeUi[]

  return [...exactItems]
    .sort((a, b) => {
      const ra = getExactRank(a, normalizedQuery, tokens)
      const rb = getExactRank(b, normalizedQuery, tokens)
      if (ra !== rb) return ra - rb
      return a.episode.id - b.episode.id
    })
    .map((x) => x.episode)
}

export function useEpisodesSearch(episodes: EpisodeUi[]): UseEpisodesSearchReturn {
  const [search, setSearch] = useState("")

  // remote search results (used only when local list is “not reached” and local search returns 0)
  const [remoteEpisodes, setRemoteEpisodes] = useState<EpisodeUi[] | null>(null)
  const latestRequestId = useRef(0)

  const normalizedSearch = useMemo(() => normalizeText(search), [search])

  // start searching at 2 chars (same behavior you had)
  const isSearching = normalizedSearch.length >= 2

  const searchTokens = useMemo(() => {
    if (!isSearching) return [] as string[]
    return normalizedSearch
      .split(" ")
      .map((t) => t.trim())
      .filter(Boolean)
  }, [isSearching, normalizedSearch])

  const localRankedEpisodes = useMemo(() => {
    if (!isSearching) return episodes
    return rankEpisodesForQuery(episodes, normalizedSearch, searchTokens)
  }, [episodes, isSearching, normalizedSearch, searchTokens])

  const shouldRemoteSearch = useMemo(() => {
    if (!isSearching) return false
    // only hit API when:
    // 1) local search returns nothing
    // 2) the provided episodes list has not “reached” S05E10
    return localRankedEpisodes.length === 0 && !hasReachedS05E10(episodes)
  }, [episodes, isSearching, localRankedEpisodes.length])

  useEffect(() => {
    if (!shouldRemoteSearch) {
      // clear remote when not needed
      setRemoteEpisodes(null)
      return
    }

    const requestId = ++latestRequestId.current
    const rawQuery = search.trim()

    // tiny debounce so we don’t spam the endpoint while typing
    const timeout = setTimeout(async () => {
      // search by name via the API
      const res = await api.getEpisodesList({ name: rawQuery })

      if (latestRequestId.current !== requestId) return // outdated response

      if (res.kind !== "ok") {
        // if request fails, just keep it empty
        setRemoteEpisodes([])
        return
      }

      // EpisodesPageUi shape in this codebase typically exposes an `episodes` array
      const apiEpisodes = (res.data as any)?.episodes as EpisodeUi[] | undefined
      console.log("Remote search results for query", apiEpisodes?.length)
      const rankedRemote = Array.isArray(apiEpisodes)
        ? rankEpisodesForQuery(apiEpisodes, normalizedSearch, searchTokens)
        : []

      setRemoteEpisodes(rankedRemote)
    }, 250)

    return () => clearTimeout(timeout)
  }, [normalizedSearch, search, searchTokens, shouldRemoteSearch])

  const effectiveEpisodes = useMemo(() => {
    if (!isSearching) return episodes
    if (localRankedEpisodes.length > 0) return localRankedEpisodes
    if (remoteEpisodes && remoteEpisodes.length > 0) return remoteEpisodes
    return [] as EpisodeUi[]
  }, [episodes, isSearching, localRankedEpisodes, remoteEpisodes])

  const mode: SearchMode = useMemo(() => {
    if (!isSearching) return "none"
    return effectiveEpisodes.length === 0 ? "empty" : "exact"
  }, [effectiveEpisodes.length, isSearching])

  const { rows, stickyHeaderIndices } = useMemo(() => {
    return buildRows(effectiveEpisodes)
  }, [effectiveEpisodes])

  return {
    search,
    setSearch,
    normalizedSearch,

    isSearching,
    mode,
    episodes: effectiveEpisodes,

    rows,
    stickyHeaderIndices,
  }
}
