import { ProxyModel } from '../interfaces'

const getAddress = (input: string) => {
  if (input.includes('@')) input = input.substring(input.lastIndexOf('@') + 1)
  else if (input.includes('://')) input = input.split('://')[1]

  if (!input.includes(':')) throw new Error('Invalid format of host or port')
  const host = input.split(':')[0]
  const port = parseInt(input.split(':')[1])
  if (/^\w+$/.test(host)) throw new Error('Invalid host format.')
  if (isNaN(port)) throw new Error('Invalid port format')
  return { host: host, port: port }
}

const getProtocol = (input: string) => {
  const acceptedProtocols = ['http', 'https', 'socks5']
  if (!input.includes('://')) return { protocol: acceptedProtocols[0] }
  const protocol = input.split('://')[0]
  if (!acceptedProtocols.includes(protocol))
    throw new Error(`Unacceptable protocol. Accepted protocols: ${acceptedProtocols.join(' | ')}`)

  return { protocol }
}

const getAuth = (input: string) => {
  if (!input.includes('@')) return undefined
  if (input.includes('://')) input = input.split('://')[1]
  input = input.substring(0, input.lastIndexOf('@'))
  if (!input.includes(':')) throw new Error('Invalid auth format')
  const [user, pass] = input.split(':')
  return { auth: { user, pass } }
}

export const parseProxy = (input: string): ProxyModel => {
  return { ...getAddress(input), ...getProtocol(input), ...getAuth(input) }
}
