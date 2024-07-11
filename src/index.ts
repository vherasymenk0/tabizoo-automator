import { DB, log } from './services'
import { launcher } from './launcher'

try {
  DB.init()
  launcher(process.argv[2])
} catch (e) {
  log.error(String(e))
}
