import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import { randomDelay } from '../utils'

type Handler = <TData>(url: string, config?: AxiosRequestConfig) => Promise<TData>
type Props = {
  config?: AxiosRequestConfig
  proxyString?: string | null
}

const retryErrors = [
  AxiosError.ERR_NETWORK,
  AxiosError.ETIMEDOUT,
  AxiosError.ECONNABORTED,
  AxiosError.ERR_CANCELED,
]

const retryErrorCodes = [400, 401, 408, 429, 500, 502, 503, 504, 520, 521, 525]

export class Axios {
  readonly instance

  constructor(props?: Props) {
    this.instance = axios.create({
      baseURL: props?.config?.baseURL,
      headers: {
        Accept: '*/*',
        ...props?.config?.headers,
      },
      timeout: 1000 * 150,
    })

    this.instance.interceptors.request.use(async (config) => {
      await randomDelay()
      return config
    })

    this.instance.interceptors.response.use(
      async (response) => {
        await randomDelay()
        return response
      },
      async (e) => {
        const apiError = e?.response?.data?.[1] || e?.response?.data?.[0]
        if (apiError) throw apiError

        if (e?.code && retryErrors.includes(e.code)) throw e
        if (e?.response?.status) throw e

        throw e
      },
    )

    axiosRetry(this.instance, {
      retries: 10,
      retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 3000),
      retryCondition(e) {
        if (e?.code) return retryErrors.includes(e.code)
        if (e?.response?.status) return retryErrorCodes.includes(e.response.status)

        return false
      },
    })
  }

  async makeRequest(method: string, url: string, options: AxiosRequestConfig = {}) {
    try {
      const resp = await this.instance({
        ...options,
        method,
        url,
      })
      return resp?.data
    } catch (error) {
      return await Promise.reject(error)
    }
  }

  setAuthToken(auth_token?: string) {
    if (auth_token) this.instance.defaults.headers.common.Authorization = `Bearer ${auth_token}`
    else delete this.instance.defaults.headers.common.Authorization
  }

  get: Handler = (url, axConfig) => this.makeRequest('get', url, axConfig)
  post: Handler = (url, axConfig) => this.makeRequest('post', url, axConfig)
  delete: Handler = (url, axConfig) => this.makeRequest('delete', url, axConfig)
}
