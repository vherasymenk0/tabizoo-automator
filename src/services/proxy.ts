import { SocksProxyAgent } from 'socks-proxy-agent'
import { Axios } from './axios'
import { log } from './logger'
import { IpInfoModel } from '../interfaces'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { parseProxy } from '../utils'

class ProxyService {
  private ax: Axios
  private ipInfoUrl = 'https://ipinfo.io/json'

  constructor() {
    this.ax = new Axios()
  }

  getAgent(proxy: string) {
    const { protocol } = parseProxy(proxy)
    if (protocol === 'socks5') return new SocksProxyAgent(proxy)
    return new HttpsProxyAgent(proxy)
  }

  async check(proxyString: string, id: string) {
    try {
      const httpsAgent = this.getAgent(proxyString)
      const { ip, country, city, timezone } = await this.ax.get<IpInfoModel>(this.ipInfoUrl, {
        httpsAgent,
        httpAgent: httpsAgent,
      })
      log.info(`${id} | proxy_info: ${ip} | ${country} | ${city} | ${timezone}`)
    } catch (e) {
      throw new Error(`Error during connect to proxy ${proxyString} | error: ${String(e)}`)
    }
  }
}

export const Proxy = new ProxyService()
