import { AUTOMATOR_AXIOS_CONFIG } from './constants'
import { AxiosRequestConfig } from 'axios'
import { Axios, log, Proxy, TGClient } from '../services'
import { AccountModel } from '../interfaces'
import { Api } from './api'
import { formatNum } from '../helpers'
import { msToTime } from '../utils'

export class Automator extends TGClient {
  private readonly ax: Axios
  private nextClaimTimeInSecond = 0
  private lvl = 0
  private coinsToClaim: null | number = 0
  private isClaimAvailable = false
  private hasCheckedIn = false
  private log = {
    warn: (msg: string) => log.warn(msg, this.client.name),
    success: (msg: string) => log.success(msg, this.client.name),
    error: (msg: string) => log.error(msg, this.client.name),
    info: (msg: string) => log.info(msg, this.client.name),
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
    })
  }

  async login() {
    const { stringData } = await this.getTgData()
    this.ax.instance.defaults.headers.Rawdata = stringData

    const { user } = await Api.signIn(this.ax)
    this.hasCheckedIn = user.hasCheckedIn
    this.lvl = user.level

    const coins = `\x1b[0m${formatNum(user.coins)}\x1b[36m`
    const level = `\x1b[0m${user.level}\x1b[36m`
    const streak = `\x1b[0m${user.streak}\x1b[36m`
    this.log.info(`Coins: ${coins} | Lvl: ${level} | Streak: ${streak}`)
  }

  async checkIn() {
    const { hasCheckedIn, streak } = await Api.checkIn(this.ax)

    if (hasCheckedIn) this.log.success(`Successfully checked in. Streak: \x1b[33m${streak}\x1b`)
    else this.log.warn('Something went wrong while check in')
  }

  async getMiningInfo() {
    const info = await Api.getInfo(this.ax)
    this.nextClaimTimeInSecond = info.nextClaimTimeInSecond
    this.isClaimAvailable = info.nextClaimTimeInSecond === 0

    if (info.current === info.topLimit) this.coinsToClaim = info.current

    const current = `\x1b[0m${formatNum(info.current)}\x1b[36m`
    const topLimit = `\x1b[0m${formatNum(info.topLimit)}\x1b[36m`
    const rate = `\x1b[0m${formatNum(info.rate)}\x1b[36m`
    const referralRate = `\x1b[0m${formatNum(info.referralRate)}\x1b[36m`
    let msg = `Mined ${current} of ${topLimit} | EPH: ${rate}`
    if (info.referralRate > 0) msg += referralRate
    this.log.info(msg)
  }

  async claim() {
    const isClaimed = await Api.claim(this.ax)
    if (isClaimed) {
      const count = `\x1b[0m${formatNum(this.coinsToClaim as number)}\x1b`
      this.log.success(`Successfully claimed! +${count}`)
      this.coinsToClaim = null
    } else this.log.warn('Something went wrong while claiming')
  }

  async lvlUp(): Promise<void> {
    const { level } = await Api.lvlUp(this.ax)
    if (level > this.lvl) {
      this.log.success(`Upgrade successful. New LVL: \x1b[0m${level}\x1b`)
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
  }
}
