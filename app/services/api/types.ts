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
