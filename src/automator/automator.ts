import { AUTOMATOR_AXIOS_CONFIG } from './constants'
import { AxiosRequestConfig } from 'axios'
import { Axios, log, Proxy, TGClient } from '../services'
import { AccountModel } from '../interfaces'
import { wait } from '../utils'
import { Api } from './api'

export class Automator extends TGClient {
  private readonly ax: Axios

  constructor(props: AccountModel) {
    super(props)
    const { headers, baseURL } = AUTOMATOR_AXIOS_CONFIG
    let axiosConfig: AxiosRequestConfig = { baseURL, headers: { ...headers, ...props.agent } }

    if (this.client?.proxyString) {
      const agent = Proxy.getAgent(this.client.proxyString)
      axiosConfig.httpsAgent = agent
      axiosConfig.httpAgent = agent
    }

    this.ax = new Axios({
      config: axiosConfig,
      proxyString: props.proxyString,
    })
  }

  async init() {
    const { stringData } = await this.getTgData()

    this.ax.instance.defaults.headers['X-Telegram-Auth'] = stringData
    await wait()
  }

  async example() {
    await Api.getExample(this.ax)
    await wait()

    log.success('Successfully get example', this.client.name)
    await wait(1)
  }

  async start() {
    await this.init()
    await wait()
    await this.example()
    await wait()
  }
}
