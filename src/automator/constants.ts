import { config } from '../config'

export const AUTOMATOR_AXIOS_CONFIG = {
  baseURL: `https://${config.info.api}`,
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'uk,en-GB;q=0.9,en;q=0.8',
    'Content-Type': 'application/json',
    Host: config.info.origin,
    Origin: `https://${config.info.origin}`,
    Referer: `https://${config.info.origin}/`,
    Priority: 'u=1, i',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
  },
}

export const API_MAP = {
  signIn: '/user/sign-in',
  info: '/mining/info',
  checkIn: '/user/check-in',
  lvlUp: '/user/level-up',
  claim: '/mining/claim',
} as const
