import { useCallback, useEffect, useMemo, useState } from "react"

import { api } from "@/services/api"
import type { CharacterUi, EpisodeUi } from "@/services/api/types"

const DEFAULT_MAX_CHARACTERS = 12

function toNumberParam(value: unknown): number | null {
  if (typeof value === "string") {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    const n = Number(value[0])
    return Number.isFinite(n) ? n : null
  }
  return null
}

function characterIdFromUrl(url: string): number | null {
  // works for: https://rickandmortyapi.com/api/character/268
  const match = /\/character\/(\d+)\s*$/i.exec(url)
  if (!match) return null
  const n = Number(match[1])
  return Number.isFinite(n) ? n : null
}

export type UseEpisodeDetailsResult = {
  episodeId: number | null
  episode: EpisodeUi | null
  characters: CharacterUi[]
  isLoading: boolean
  errorKind: string | null
  reload: () => void
}

export function useEpisodeDetails(
  episodeIdParam: unknown,
  options?: { maxCharacters?: number },
): UseEpisodeDetailsResult {
  const maxCharacters = options?.maxCharacters ?? DEFAULT_MAX_CHARACTERS

  const episodeId = useMemo(() => toNumberParam(episodeIdParam), [episodeIdParam])

  const [episode, setEpisode] = useState<EpisodeUi | null>(null)
  const [characters, setCharacters] = useState<CharacterUi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorKind, setErrorKind] = useState<string | null>(null)

  const [reloadKey, setReloadKey] = useState(0)
  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (!episodeId) {
        if (!isMounted) return
        setEpisode(null)
        setCharacters([])
        setIsLoading(false)
        setErrorKind("bad-data")
        return
      }

      if (!isMounted) return
      setIsLoading(true)
      setErrorKind(null)
      setEpisode(null)
      setCharacters([])

      const episodeRes = await api.getEpisodeById(episodeId)
      if (!isMounted) return

      if (episodeRes.kind !== "ok") {
        setErrorKind(episodeRes.kind)
        setIsLoading(false)
        return
      }

      const ep = episodeRes.data
      setEpisode(ep)

      const ids = (ep.characters ?? [])
        .map(characterIdFromUrl)
        .filter((n): n is number => typeof n === "number")
        .slice(0, maxCharacters)

      if (ids.length > 0) {
        const charsRes = await api.getCharactersByIds(ids)
        if (!isMounted) return

        if (charsRes.kind === "ok") {
          setCharacters(charsRes.data)
        } else {
          setErrorKind(charsRes.kind)
        }
      }

      setIsLoading(false)
    }

    run()

    return () => {
      isMounted = false
    }
  }, [episodeId, maxCharacters, reloadKey])

  return { episodeId, episode, characters, isLoading, errorKind, reload }
}
