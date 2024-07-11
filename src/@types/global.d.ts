export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_ID: string
      API_HASH: string
      USE_PROXY?: string
      WITH_CACHE?: string
      [key: string]: string
    }
  }
}
