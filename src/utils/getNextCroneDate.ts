import cronParser from 'cron-parser'

export const getNextCroneDate = (expression: string) => {
  const interval = cronParser.parseExpression(expression).next()

  return new Date(interval.toString()).toUTCString()
}
