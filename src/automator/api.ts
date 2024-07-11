import { ExampleModel } from './interfaces'
import { API_MAP } from './constants'
import { Axios } from '../services'

class ApiService {
  async getExample(axios: Axios) {
    try {
      const data = await axios.get<ExampleModel>(API_MAP.example)
      return data
    } catch (e) {
      throw new Error(`Api | getExample() | ${e}`)
    }
  }
}

export const Api = new ApiService()
