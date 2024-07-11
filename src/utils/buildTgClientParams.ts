import { TelegramClientParams } from 'telegram/client/telegramBaseClient'
import { AccountModel } from '../interfaces'
import { parseProxy } from './proxyParser'
import { Logger } from 'telegram'
import { LogLevel } from 'telegram/extensions/Logger'

export const buildTgClientParams = async (proxyString: AccountModel['proxyString']) => {
  let params: TelegramClientParams = {
    connectionRetries: 5,
    baseLogger: new Logger(LogLevel.ERROR),
  }

  if (proxyString) {
    const proxy = parseProxy(proxyString)
    const { port, host, auth, protocol } = proxy

    if (protocol === 'socks5') {
      params = {
        ...params,
        useWSS: false,
        proxy: {
          ip: host,
          port,
          username: auth?.user,
          password: auth?.pass,
          socksType: 5,
          timeout: 2,
        },
      }
    }
  }

  return params
}
