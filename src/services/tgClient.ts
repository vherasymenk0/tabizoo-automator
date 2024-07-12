import { StringSession } from 'telegram/sessions'
import { Api, TelegramClient } from 'telegram'
import { DB } from './db'
import { log } from './logger'
import { getInputUser } from 'telegram/Utils'
import * as process from 'node:process'
import { Entity } from 'telegram/define'
import { AccountModel } from '../interfaces'
import { buildTgClientParams, time, wait } from '../utils'
import { config } from '../config'

export class TGClient {
  protected readonly client: AccountModel

  constructor(account: AccountModel) {
    this.client = account
  }

  private parseWebData(data: string) {
    const encodeWebData = data.split('tgWebAppData=')[1].split('&tgWebAppVersion')[0]
    return decodeURIComponent(encodeWebData)
  }

  private async getClient() {
    try {
      const { api_id, api_hash } = config.settings
      const { proxyString, session } = this.client

      const params = await buildTgClientParams(proxyString)
      const stringSession = new StringSession(session)
      const client = new TelegramClient(stringSession, api_id, api_hash, params)

      const isValidSession = await client.connect()
      if (!isValidSession) throw new Error('Session is invalid')

      return client
    } catch (e) {
      throw new Error(String(e))
    }
  }

  private getCachedWebData() {
    if (!config.settings.with_cache) return null

    const { webData, name } = this.client

    if (webData) {
      const twoDaysInSeconds = 48 * 60 * 60
      const { stringData, lastUpdateAt, id, username } = webData
      const cacheAge = time() - lastUpdateAt
      const isUnexpired = cacheAge < twoDaysInSeconds

      if (isUnexpired) {
        const timeUntilRevalidation = twoDaysInSeconds - cacheAge
        const [h, m, s] = [
          Math.floor(timeUntilRevalidation / 3600),
          Math.floor((timeUntilRevalidation % 3600) / 60),
          timeUntilRevalidation % 60,
        ]

        log.info(`Cache will be revalidated in [${h}h:${m}m:${s}s]`, name)
        return { id: id, stringData, username }
      }
    }

    return null
  }

  private async getInlineWebData(client: TelegramClient, entity: Entity) {
    const bot = getInputUser(entity) as Api.InputUser
    const app = new Api.InputBotAppShortName({
      botId: bot,
      shortName: config.info.shortName,
    })

    const webview = await client.invoke(
      new Api.messages.RequestAppWebView({
        peer: bot,
        app: app,
        platform: 'android',
        writeAllowed: true,
      }),
    )

    return this.parseWebData(webview.url)
  }

  private async getWebviewData(client: TelegramClient, entity: Entity) {
    const webview = await client.invoke(
      new Api.messages.RequestWebView({
        peer: entity,
        bot: entity,
        platform: 'android',
        fromBotMenu: false,
        url: `https://${config.info.origin}`,
      }),
    )

    return this.parseWebData(webview.url)
  }

  protected async getTgData() {
    const { userName } = config.info
    const { name } = this.client

    const cachedWebData = this.getCachedWebData()
    if (cachedWebData) return cachedWebData

    const client = await this.getClient()
    await wait(2)
    const { id: myId, username } = await client.getMe()

    if (!username) {
      log.error(`Set the username of your telegram account`, name)
      process.exit(1)
    }

    const id = myId.toJSNumber()
    const entity = await client.getEntity(userName)
    const stringData = await this.getWebviewData(client, entity)
    await client.destroy()

    DB.set({
      ...this.client,
      webData: { lastUpdateAt: time(), stringData, id, username },
    })
    log.info(`Web data has been successfully cached`, name)

    return { id, stringData, username }
  }
}
