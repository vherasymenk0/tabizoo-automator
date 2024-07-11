import fs from 'fs'
import { log } from './logger'
import { AccountModel } from '../interfaces'
import { PATHS } from '../constants'

class DataBaseService {
  private write(data: AccountModel[]) {
    fs.writeFileSync(PATHS.db, JSON.stringify(data, null, 2), 'utf8')
  }

  init() {
    const isDBCreated = fs.existsSync(PATHS.db)
    if (!isDBCreated) {
      this.write([])
      log.success('Database has been successfully initialized')
    }
  }

  set(account: AccountModel) {
    const data = this.getAll()
    const newData = data.filter(({ name }) => name !== account.name)
    this.write([...newData, account])
  }

  update(name: AccountModel['name'], data: AccountModel) {
    const accounts = this.getAll()
    const newData = accounts.map((acc) => {
      if (acc.name === name) return data
      return acc
    })

    this.write([...newData])
  }

  getAll(): AccountModel[] {
    const jsonData = fs.readFileSync(PATHS.db, 'utf8')
    return JSON.parse(jsonData)
  }

  delete(accs: AccountModel['name'][]) {
    const data = this.getAll()
    const newData = data.filter((client) => !accs.includes(client.name))
    this.write(newData)
  }
}

export const DB = new DataBaseService()
