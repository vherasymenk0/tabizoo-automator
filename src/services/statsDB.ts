import fs from 'fs'
import { DB, log } from './index'
import { PATHS } from '../constants'

export abstract class StatsDataBase<
  TData extends { [name: string]: Record<string, unknown> | null },
> {
  protected write(data: TData) {
    fs.writeFileSync(PATHS.stats, JSON.stringify(data, null, 2), 'utf8')
  }

  protected init() {
    const isStatsDBCreated = fs.existsSync(PATHS.stats)

    if (!isStatsDBCreated) {
      this.write({} as TData)
      log.info(`Statistics is available in the ${PATHS.stats} file`)
    }

    const accounts = DB.getAll()
    const statsData = this.getAll() as Record<string, unknown>

    accounts.forEach(({ name }) => {
      if (!(name in statsData)) statsData[name] = null
    })
  }

  protected getAll(): TData {
    const jsonData = fs.readFileSync(PATHS.db, 'utf8')
    return JSON.parse(jsonData)
  }

  abstract set(): void
  abstract get(): void
  abstract update(): void
}
