import {
  CharacterApi,
  CharactersListResponseApi,
  CharactersPageUi,
  CharacterUi,
  EpisodeApi,
  EpisodesListResponseApi,
  EpisodesPageUi,
  EpisodeUi,
} from "./types"

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

export const adaptCharacter = (character: CharacterApi): CharacterUi => ({
  id: character.id,
  name: character.name,
  status: character.status,
  species: character.species,
  type: character.type,
  gender: character.gender,
  origin: {
    name: character.origin.name,
    url: character.origin.url,
  },
  location: {
    name: character.location.name,
    url: character.location.url,
  },
  image: character.image,
  episodes: character.episode,
  url: character.url,
  created: character.created,
})

export const adaptCharactersListResponse = (
  payload: CharactersListResponseApi,
): CharactersPageUi => ({
  info: {
    count: payload.info.count,
    pages: payload.info.pages,
    next: payload.info.next,
    prev: payload.info.prev,
    nextPage: extractPageParam(payload.info.next),
    prevPage: extractPageParam(payload.info.prev),
  },
  characters: payload.results.map(adaptCharacter),
})

export const adaptCharactersByIdsResponse = (payload: CharacterApi[]): CharacterUi[] =>
  payload.map(adaptCharacter)
