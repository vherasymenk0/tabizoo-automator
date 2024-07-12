import { CheckInModel, InfoModel, LvlUpModel, SignInModel } from './interfaces'
import { API_MAP } from './constants'
import { Axios } from '../services'

class ApiService {
  async getInfo(axios: Axios) {
    try {
      return await axios.get<InfoModel>(API_MAP.info)
    } catch (e) {
      throw new Error(`Api | getInfo() | ${e}`)
    }
  }

  async signIn(axios: Axios) {
    try {
      return await axios.post<SignInModel>(API_MAP.signIn)
    } catch (e) {
      throw new Error(`Api | signIn() | ${e}`)
    }
  }

  async lvlUp(axios: Axios) {
    try {
      return await axios.post<LvlUpModel>(API_MAP.lvlUp)
    } catch (e) {
      throw new Error(`Api | lvlUp() | ${e}`)
    }
  }

  async checkIn(axios: Axios) {
    try {
      return await axios.post<CheckInModel>(API_MAP.checkIn)
    } catch (e) {
      throw new Error(`Api | checkIn() | ${e}`)
    }
  }

  async claim(axios: Axios) {
    try {
      return await axios.post<boolean>(API_MAP.claim)
    } catch (e) {
      throw new Error(`Api | claim() | ${e}`)
    }
  }
}

export const Api = new ApiService()
