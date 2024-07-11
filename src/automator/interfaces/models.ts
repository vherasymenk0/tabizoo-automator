interface BaseInfo {
  id: number
  tgUserId: number
  name: string
  photoUrl: null | string
  isPremium: number
  level: number
  invites: number
  referral: number
  coins: number
  tabiAddress: null | string
  streak: number
  createTime: string
  loginTime: string
  checkInDate: string
  hasCheckedIn: boolean
}

export interface SignInModel {
  user: BaseInfo
  lastLoginTime: string
  invitationRewardSinceLastLogin: number
}

export interface InfoModel {
  tgUserId: number
  rate: number
  referralRate: number
  topLimit: number
  accumulated: number
  refreshTime: string
  nextClaimTime: string
  current: number
  nextClaimTimeInSecond: number
}

export type LvlUpModel = BaseInfo
export type CheckInModel = BaseInfo
