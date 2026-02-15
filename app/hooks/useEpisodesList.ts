import { useCallback, useEffect, useRef, useState } from "react"

import { api } from "@/services/api"
import { EpisodeUi } from "@/services/api/types"

export function useEpisodesList(initialPage = 1) {
  const [episodes, setEpisodes] = useState<EpisodeUi[]>([])
  const [page, setPage] = useState(initialPage)

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [errorKind, setErrorKind] = useState<string | null>(null)

  const [hasNextPage, setHasNextPage] = useState(false)

  // prevents duplicate requests if onEndReached fires multiple times
  const inFlightRef = useRef(false)

  const loadPage = useCallback(async (targetPage: number, mode: "replace" | "append") => {
    if (inFlightRef.current) return
    inFlightRef.current = true

    if (mode === "replace") setIsLoading(true)
    else setIsLoadingMore(true)

    setErrorKind(null)

    try {
      const res = await api.getEpisodesList({ page: targetPage })

      if (res.kind === "ok") {
        const { episodes: newEpisodes, info } = res.data

        setHasNextPage(info.nextPage != null)
        setPage(targetPage)

        setEpisodes((prev) => {
          if (mode === "replace") return newEpisodes

          // dedupe by id (safe against double fetch)
          const byId = new Map(prev.map((e) => [e.id, e]))
          for (const e of newEpisodes) byId.set(e.id, e)
          return Array.from(byId.values())
        })
      } else {
        setErrorKind(res.kind)
      }
    } catch {
      setErrorKind("unknown")
    } finally {
      if (mode === "replace") setIsLoading(false)
      else setIsLoadingMore(false)

      inFlightRef.current = false
    }
  }, [])

  const reload = useCallback(async () => {
    await loadPage(initialPage, "replace")
  }, [initialPage, loadPage])

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading || isLoadingMore) return
    await loadPage(page + 1, "append")
  }, [hasNextPage, isLoading, isLoadingMore, loadPage, page])

  useEffect(() => {
    reload()
  }, [reload])

  return {
    episodes,
    isLoading,
    isLoadingMore,
    errorKind,
    hasNextPage,
    loadMore,
    reload,
  }
}
