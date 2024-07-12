import { Automator } from './automator'
import cron from 'node-cron'
import { DB, log } from '../services'
import { catchError, getNextCroneDate } from '../utils'

export const runAutomator = async () => {
  const accounts = DB.getAll()
  const bots = accounts.map((account) => ({
    name: account.name,
    automator: new Automator(account),
  }))

  const tasks = bots.map(async ({ automator, name }) => {
    try {
      await automator.start()

      // example every 5 hours
      const exampleExpression = '0 */5 * * *'
      log.info(`Next claim time: ${getNextCroneDate(exampleExpression)}`, name)
      cron.schedule(
        exampleExpression,
        async () => {
          await automator.start()
          log.info(`Next claim time: ${getNextCroneDate(exampleExpression)}`, name)
        },
        { timezone: 'Europe/Kiev' },
      )
    } catch (error) {
      await catchError(error, name)
    }
  })

  await Promise.all(tasks)
}
