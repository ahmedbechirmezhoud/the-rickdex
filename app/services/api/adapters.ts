import { EpisodeApi, EpisodesListResponseApi, EpisodesPageUi, EpisodeUi } from "./types"

const extractPageParam = (url: string | null): number | null => {
  if (!url) return null
  const match = /[?&]page=(\d+)/.exec(url)
  if (!match) return null
  const n = Number(match[1])
  return Number.isFinite(n) ? n : null
}

export const adaptEpisode = (episode: EpisodeApi): EpisodeUi => ({
  id: episode.id,
  name: episode.name,
  airDate: episode.air_date,
  episode: episode.episode,
  characters: episode.characters,
  url: episode.url,
  created: episode.created,
})

export const adaptEpisodesListResponse = (payload: EpisodesListResponseApi): EpisodesPageUi => ({
  info: {
    count: payload.info.count,
    pages: payload.info.pages,
    next: payload.info.next,
    prev: payload.info.prev,
    nextPage: extractPageParam(payload.info.next),
    prevPage: extractPageParam(payload.info.prev),
  },
  episodes: payload.results.map(adaptEpisode),
})
