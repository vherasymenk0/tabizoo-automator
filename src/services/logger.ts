import chalk from 'chalk'

class Logger {
  private formatLabel(label?: string): string {
    if (!label) return String(chalk.white.dim('LOGGER '))
    label = label.toUpperCase()

    if (label.length < 5) label = label.padEnd(5, ' ')
    else if (label.length > 7) label = label.slice(0, 6) + '.'

    return label.padEnd(7, ' ')
  }

  private logger(msg: string, label?: string) {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Kiev',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
    })

    const formattedLabel = this.formatLabel(label)
    return console.log(`${timestamp} | ${formattedLabel} | ${msg}`)
  }

  info(msg: string, label?: string) {
    this.logger(chalk.cyanBright(msg), label)
  }
  warn(msg: string, label?: string) {
    this.logger(chalk.yellow(msg), label)
  }
  error(msg: string, label?: string) {
    this.logger(chalk.redBright(msg), label)
  }
  success(msg: string, label?: string) {
    this.logger(chalk.greenBright(msg), label)
  }
  debug(msg: string, label?: string) {
    this.logger(chalk.white(msg), label)
  }
}

export const log = new Logger()
