import { ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import {
  adaptEpisodesListResponse,
  adaptEpisode,
  adaptCharacter,
  adaptCharactersByIdsResponse,
} from "./adapters"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type {
  ApiConfig,
  CharacterApi,
  CharacterUi,
  EpisodeApi,
  EpisodeUi,
  EpisodesListParams,
  EpisodesListResponseApi,
  EpisodesPageUi,
} from "./types"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Standard API result shape used across endpoints.
 * - ok => strongly typed data
 * - otherwise => a GeneralApiProblem describing the failure
 */
export type ApiResult<T> = { kind: "ok"; data: T } | GeneralApiProblem

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * GET /episode?page=&name=&episode=
   */
  async getEpisodesList(params: EpisodesListParams = {}): Promise<ApiResult<EpisodesPageUi>> {
    const response = await this.apisauce.get<EpisodesListResponseApi>("/episode", params)

    if (!response.ok) {
      return getGeneralApiProblem(response) ?? { kind: "unknown", temporary: true }
    }

    const data = response.data
    if (!data || !data.info || !Array.isArray(data.results)) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", data: adaptEpisodesListResponse(data) }
  }

  /**
   * GET /episode/:id
   */
  async getEpisodeById(episodeId: number): Promise<ApiResult<EpisodeUi>> {
    const response = await this.apisauce.get<EpisodeApi>(`/episode/${episodeId}`)

    if (!response.ok) {
      return getGeneralApiProblem(response) ?? { kind: "unknown", temporary: true }
    }

    const data = response.data
    if (!data || typeof data.id !== "number" || typeof data.name !== "string") {
      return { kind: "bad-data" }
    }

    return { kind: "ok", data: adaptEpisode(data) }
  }

  /**
   * GET /character/:id
   */
  async getCharacterById(id: number): Promise<ApiResult<CharacterUi>> {
    const response = await this.apisauce.get<CharacterApi>(`/character/${id}`)

    if (!response.ok) {
      return getGeneralApiProblem(response) ?? { kind: "unknown", temporary: true }
    }

    const data = response.data
    if (!data || typeof data.id !== "number" || typeof data.name !== "string") {
      return { kind: "bad-data" }
    }

    return { kind: "ok", data: adaptCharacter(data) }
  }
  /**
   * GET /character/[1,2,3] or /character/1,2,3
   */
  async getCharactersByIds(ids: number[]): Promise<ApiResult<CharacterUi[]>> {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { kind: "bad-data" }
    }

    if (ids.length === 1) {
      const one = await this.getCharacterById(ids[0]!)
      if (one.kind !== "ok") return one
      return { kind: "ok", data: [one.data] }
    }

    const idsPath = ids.join(",")
    const response = await this.apisauce.get<CharacterApi[]>(`/character/${idsPath}`)

    if (!response.ok) {
      return getGeneralApiProblem(response) ?? { kind: "unknown", temporary: true }
    }

    const data = response.data
    if (!data || !Array.isArray(data)) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", data: adaptCharactersByIdsResponse(data) }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
