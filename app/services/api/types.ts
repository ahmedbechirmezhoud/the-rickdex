export interface ApiInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

/**
 * Matches the REST payload.
 */
export interface EpisodeApi {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export interface EpisodesListResponseApi {
  info: ApiInfo
  results: EpisodeApi[]
}

/**
 * Query params supported by /episode.
 */
export interface EpisodesListParams {
  page?: number
  name?: string
  episode?: string
}

/**
 * UI-friendly model
 */
export interface EpisodeUi {
  id: number
  name: string
  airDate: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export interface EpisodesPageUi {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
    nextPage: number | null
    prevPage: number | null
  }
  episodes: EpisodeUi[]
}

export interface ApiNamedResourceUi {
  name: string
  url: string
}
export interface ApiNamedResourceApi {
  name: string
  url: string
}

export interface CharacterApi {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: ApiNamedResourceApi
  location: ApiNamedResourceApi
  image: string
  episode: string[]
  url: string
  created: string
}

export interface CharactersListResponseApi {
  info: ApiInfo
  results: CharacterApi[]
}

export type CharacterStatus = "alive" | "dead" | "unknown" | string

/**
 * Query params supported by /character.
 */
export interface CharactersListParams {
  page?: number
  name?: string
  status?: CharacterStatus
  species?: string
  type?: string
  gender?: "female" | "male" | "genderless" | "unknown" | string
}

/**
 * UI-friendly model
 */
export interface CharacterUi {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: string
  origin: ApiNamedResourceUi
  location: ApiNamedResourceUi
  image: string
  episodes: string[]
  url: string
  created: string
}
export interface CharactersPageUi {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
    nextPage: number | null
    prevPage: number | null
  }
  characters: CharacterUi[]
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
