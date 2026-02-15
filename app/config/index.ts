/**
 * App config.
 *
 * ⚠️ These values ship in the JS bundle. Do NOT store secrets here.
 */
import BaseConfig from "./config.base"

type AppConfig = typeof BaseConfig & {
  /**
   * Base URL for your REST API.
   */
  API_URL: string
}

const Config: AppConfig = {
  ...BaseConfig,
  // Rick & Morty REST base URL
  API_URL: "https://rickandmortyapi.com/api",
}

// Prevent accidental mutation during development
if (__DEV__) Object.freeze(Config)

export default Config
