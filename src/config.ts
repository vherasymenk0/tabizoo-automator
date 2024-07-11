import { getEnvVar, stringToBoolean } from './helpers'

const settings = {
  api_id: Number(getEnvVar('API_ID')),
  api_hash: getEnvVar('API_HASH'),
  with_cache: stringToBoolean(getEnvVar('WITH_CACHE', 'true')),
  use_proxy: stringToBoolean(getEnvVar('USE_PROXY', 'true')),
}

export const config = {
  settings,
  info: {
    origin: 'app.tabibot.com',
    api: 'app.tabibot.com/api',
    userName: 'tabizoobot',
    shortName: 'tabizoo',
  },
}
