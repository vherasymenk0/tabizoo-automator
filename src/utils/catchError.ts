import { FloodWaitError } from 'telegram/errors'
import { log } from '../services'
import { wait } from './wait'

export const catchError = async (error: unknown, name: string) => {
  if (error instanceof FloodWaitError) {
    log.error(String(error), name)
    log.warn(`Sleep ${error.seconds} seconds`, name)
    await wait(error.seconds)
  }
  await wait()
  log.error(String(error), name)
}
