import { useCallback, useEffect, useState } from "react"

import { api } from "@/services/api"
import { EpisodeUi } from "@/services/api/types"

export function useEpisodesList(page = 1) {
  const [episodes, setEpisodes] = useState<EpisodeUi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorKind, setErrorKind] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setErrorKind(null)

    try {
      const res = await api.getEpisodesList({ page })
      if (res.kind === "ok") setEpisodes(res.data.episodes)
      else setErrorKind(res.kind)
    } catch {
      setErrorKind("unknown")
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    const run = async () => {
      await load()
    }
    run()
  }, [load])

  return { episodes, isLoading, errorKind, reload: load }
}
