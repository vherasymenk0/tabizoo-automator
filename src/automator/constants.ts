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
  signIn: '/user/v1/sign-in',
  info: '/mining/v1/info',
  checkIn: '/user/v1/check-in',
  checkInAds: '/user/v1/check-in-ad',
  lvlUp: '/user/v1/level-up',
  claim: '/mining/v1/claim',
} as const
