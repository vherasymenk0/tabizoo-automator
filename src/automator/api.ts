import { Axios } from '../services'
import { API_MAP } from './constants'
import { CheckInModel, InfoModel, LvlUpModel, SignInModel } from './interfaces'

class ApiService {
  async getInfo(axios: Axios) {
    try {
      const { data } = await axios.get<InfoModel>(API_MAP.info)
      return data.mining_data
    } catch (e) {
      throw new Error(`Api | getInfo() | ${e}`)
    }
  }

  async signIn(axios: Axios) {
    try {
      const { data } = await axios.post<SignInModel>(API_MAP.signIn)
      return data
    } catch (e) {
      throw new Error(`Api | signIn() | ${e}`)
    }
  }

  async lvlUp(axios: Axios) {
    try {
      const { data } = await axios.post<LvlUpModel>(API_MAP.lvlUp)
      return data.user
    } catch (e) {
      throw new Error(`Api | lvlUp() | ${e}`)
    }
  }

  async checkIn(axios: Axios) {
    try {
      const { data } = await axios.post<CheckInModel>(API_MAP.checkIn)
      return data
    } catch (e) {
      throw new Error(`Api | checkIn() | ${e}`)
    }
  }

  async checkInAds(axios: Axios) {
    try {
      const { data } = await axios.post<CheckInModel>(API_MAP.checkInAds, {
        data: { check_in_status: 1 },
      })
      return data
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
