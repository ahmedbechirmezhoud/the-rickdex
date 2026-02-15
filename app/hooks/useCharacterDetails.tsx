import { useCallback, useEffect, useRef, useState } from "react"

import { api } from "@/services/api"
import type { CharacterUi } from "@/services/api/types"

type UseCharacterDetailsResult = {
  character: CharacterUi | null
  isLoading: boolean
  errorKind: string | null
  reload: () => void
}

export function useCharacterDetails(characterId?: string): UseCharacterDetailsResult {
  const [character, setCharacter] = useState<CharacterUi | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorKind, setErrorKind] = useState<string | null>(null)

  const inFlightRef = useRef(false)

  const load = useCallback(async () => {
    if (!characterId) {
      setCharacter(null)
      setIsLoading(false)
      setErrorKind("missing_character_id")
      return
    }

    if (inFlightRef.current) return
    inFlightRef.current = true

    setIsLoading(true)
    setErrorKind(null)

    const result = await api.getCharacterById(Number(characterId))

    if (result.kind === "ok") {
      setCharacter(result.data)
      setErrorKind(null)
    } else {
      setCharacter(null)
      setErrorKind(result.kind)
    }

    setIsLoading(false)
    inFlightRef.current = false
  }, [characterId])

  useEffect(() => {
    load()
  }, [load])

  return { character, isLoading, errorKind, reload: load }
}
