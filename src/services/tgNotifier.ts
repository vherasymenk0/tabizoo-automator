import { config } from '../config'
import { Axios } from './axios'
import { log } from './logger'

export class TGNotifier {
  static axios = new Axios({
    config: {
      baseURL: 'https://api.telegram.org',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    },
  })

  static async sendMessage(msg: string, id?: number) {
    const { chat_id, bot, topic_id } = config.settings
    if (!bot) return

    let ids = []
    if (chat_id) ids.push({ id: +chat_id, topic_id: +topic_id })
    if (id) ids.push({ id })
    if (ids.length === 0) return log.warn('[sendMessage] Receiver id not specified')

    try {
      for (const chat of ids) {
        let url = `/bot${bot}/sendmessage?chat_id=${chat.id}`
        if (chat.topic_id) url += `&message_thread_id=${chat.topic_id}`
        url += `&parse_mode=HTML&disable_web_page_preview=true&disable_notification=true&text=${encodeURIComponent(msg)}`

        await this.axios.get(url)
      }
    } catch (e) {
      throw new Error(`Api.sendMessage() | ${String(e)}`)
    }
  }
}
