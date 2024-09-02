import { AxiosRequestConfig } from 'axios'
import { config } from '../config'
import { formatNum } from '../helpers'
import { AccountModel } from '../interfaces'
import { Axios, log, Proxy, TGClient, TGNotifier } from '../services'
import { msToTime } from '../utils'
import { Api } from './api'
import { AUTOMATOR_AXIOS_CONFIG } from './constants'

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export class Automator extends TGClient {
  private readonly ax: Axios
  private nextClaimTimeInSecond = 0
  private lvl = 0
  private coinsToClaim: null | number = 0
  private isClaimAvailable = false
  private hasCheckedIn = false
  private logs: string = ''
  private log = {
    warn: (msg: string) => {
      this.logs += `[Warning]: ${msg}\n`
      log.warn(msg, this.client.name)
    },
    success: (msg: string) => {
      this.logs += `[Success]: ${msg}\n`
      log.success(msg, this.client.name)
    },
    error: (msg: string) => {
      this.logs += `[Error]: ${msg}\n`
      log.error(msg, this.client.name)
    },
    info: (msg: string) => {
      this.logs += `[Info]: ${msg}\n`
      log.info(msg, this.client.name)
    },
  }

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
      id: props.name,
    })
  }

  async sendLogs() {
    const name = this.client.webData?.username || this.client.name
    const title = `<b>#Tabizoo ${name}</b>\n\n`
    const message = title + this.logs

    if (this.client.getLogs) await TGNotifier.sendMessage(message, this.client.webData?.id)
    else await TGNotifier.sendMessage(message)
    this.logs = ''
  }

  private async checkProxy() {
    if (this.client.proxyString && config.settings.use_proxy)
      await Proxy.check(this.client.proxyString, this.client.name)
  }

  async login() {
    await this.checkProxy()
    const { stringData } = await this.getTgData()
    this.ax.instance.defaults.headers.Rawdata = stringData

    const { user } = await Api.signIn(this.ax)
    const currentDate = getTodayDate()

    this.hasCheckedIn = currentDate === user.check_in_date
    this.lvl = user.level

    this.log.info(`Coins: ${formatNum(user.coins)} | Lvl: ${user.level} | Streak: ${user.streak}`)
  }

  async checkIn() {
    const {
      user: { check_in_date, streak },
    } = await Api.checkInAds(this.ax)
    const currentDate = getTodayDate()

    const hasCheckedIn = currentDate === check_in_date

    if (hasCheckedIn) this.log.success(`Successfully checked in. Streak: \x1b[33m${streak}\x1b`)
    else this.log.warn('Something went wrong while check in')
  }

  async getMiningInfo() {
    const { top_limit, current, rate, referral_rate, next_claim_timestamp } = await Api.getInfo(
      this.ax,
    )
    const nextClaimTimeInSecond = next_claim_timestamp / 1000000
    this.nextClaimTimeInSecond = nextClaimTimeInSecond
    this.isClaimAvailable = nextClaimTimeInSecond === 0

    if (current === top_limit) this.coinsToClaim = current

    let msg = `Mined ${formatNum(current)} of ${formatNum(top_limit)} | EPH: ${formatNum(rate)}`
    if (referral_rate > 0) msg += formatNum(referral_rate)
    this.log.info(msg)
  }

  async claim() {
    const isClaimed = await Api.claim(this.ax)
    if (isClaimed) {
      this.log.success(`Successfully claimed! +${formatNum(this.coinsToClaim as number)}`)
      this.coinsToClaim = null
    } else this.log.warn('Something went wrong while claiming')
  }

  async lvlUp(): Promise<void> {
    const { level } = await Api.lvlUp(this.ax)
    if (level > this.lvl) {
      this.log.success(`Upgrade successful. New LVL: ${level}`)
      this.lvl = level
      return this.lvlUp()
    } else this.log.warn('Not enough point to upgrade')
  }

  async start() {
    await this.login()

    if (!this.hasCheckedIn) await this.checkIn()
    await this.getMiningInfo()

    if (this.isClaimAvailable) await this.claim()
    else {
      const time = msToTime(this.nextClaimTimeInSecond * 1000).formattedTime
      this.log.warn(`Claim will be available in ${time}`)
    }

    await this.lvlUp()
    await this.sendLogs()
  }
}
