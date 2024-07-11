import { wait } from '../utils'

export const randomDelay = async (from = 2, to = 6) => {
  const delayTime = Math.floor(Math.random() * (to - from + 1)) + from
  return wait(delayTime)
}
