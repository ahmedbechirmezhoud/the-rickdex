import { ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import { adaptEpisodesListResponse } from "./adapters"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type {
  ApiConfig,
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
      // Normalize all network/HTTP issues into a single known union
      return getGeneralApiProblem(response) ?? { kind: "unknown", temporary: true }
    }

    const data = response.data
    if (!data || !data.info || !Array.isArray(data.results)) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", data: adaptEpisodesListResponse(data) }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
