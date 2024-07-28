import { Automator } from './automator'
import cron from 'node-cron'
import { DB, log } from '../services'
import { catchError, getNextCroneDate } from '../utils'
import { config } from '../config'
import chalk from 'chalk'
import async from 'async'

export const runAutomator = async () => {
  if (config.settings.use_proxy) log.debug(`Proxy: ${chalk.greenBright.bold('ENABLED')}`)
  else log.debug(`Proxy: ${chalk.redBright('DISABLED')}`)

  if (config.settings.with_cache) log.debug(`Cache: ${chalk.greenBright.bold('ENABLED')}`)
  else log.debug(`Cache: ${chalk.redBright('DISABLED')}`)

  let accountName = ''
  try {
    const accounts = DB.getAll()
    const bots = accounts.map((account) => {
      accountName = account.name
      return {
        name: account.name,
        automator: new Automator(account),
      }
    })

    await async.eachLimit(bots, 5, async ({ automator, name }) => {
      try {
        await automator.start()

        const schedule = '0 */5 * * *'
        log.debug(`Next start: ${getNextCroneDate(schedule)}`, name)

        cron.schedule(
          schedule,
          async () => {
            await automator.start()
            log.info(`Next start: ${getNextCroneDate(schedule)}`, name)
          },
          { timezone: 'Europe/Kiev' },
        )
      } catch (error) {
        await catchError(error, name)
      }
    })
  } catch (e: any) {
    const err = e?.message || e
    log.error(String(err), accountName)
  }
}
