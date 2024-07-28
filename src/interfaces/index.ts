export interface AccountModel {
  name: string
  session: string
  proxyString: string | null
  deviceType?: string
  agent: {
    'Sec-Ch-Ua-Mobile': string
    'Sec-Ch-Ua-Platform': string
    'Sec-Ch-Ua': string
    'User-Agent': string
  }
  fingerprint: {
    visitorId: string
    components: {
      [key: string]: { value: unknown; duration: number } | { error: unknown; duration: number }
    }
  } | null
  getLogs?: boolean
  webData: {
    stringData: string
    lastUpdateAt: number
    id: number
    username: string
  } | null
}

export interface ProxyModel {
  protocol: string
  host: string
  port: number
  auth?: {
    user: string
    pass: string
  }
}

export interface IpInfoModel {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}
