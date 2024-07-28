import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import { randomDelay } from '../utils'
import { log } from './logger'
import chalk from 'chalk'

type Handler = <TData>(url: string, config?: AxiosRequestConfig) => Promise<TData>
type Props = {
  config?: AxiosRequestConfig
  proxyString?: string | null
  id?: string
}

const retryErrors = [
  AxiosError.ERR_NETWORK,
  AxiosError.ETIMEDOUT,
  AxiosError.ECONNABORTED,
  AxiosError.ERR_CANCELED,
]

const retryErrorStatuses = [400, 408, 429, 502, 503, 504, 520, 521, 525]

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

    axiosRetry(this.instance, {
      retries: 3,
      retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 3000),
      retryCondition(e) {
        if (e?.response?.status && e?.response?.statusText) {
          if (retryErrorStatuses.includes(e.response.status)) {
            log.error(
              `${e.response.status}: ${e.response.statusText}. ${chalk.white('Retrying...')}`,
              props?.id,
            )
            return true
          }
        }

        if (e?.code) {
          if (retryErrors.includes(e.code)) {
            log.error(`${String(e.code)}: ${e.message}. ${chalk.white('Retrying...')}`, props?.id)
            return true
          }
        }

        return false
      },
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
        const apiError = e?.response?.data?.error?.message || e?.response?.data?.error?.text
        if (apiError) throw apiError
        throw e
      },
    )
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
