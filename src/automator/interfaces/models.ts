export interface SignInModel {
  request_id: string
  code: number
  data: {
    user: {
      id: number
      tg_user_id: number
      name: string
      photo_url: string
      is_premium: number
      level: number
      invites: number
      referral: number
      coins: number
      tabi_address: string
      ton_address: string
      streak: number
      create_time: string
      login_time: string
      check_in_date: string
      on_board: number
      ton_balance: number
    }
    lastLoginTime: string
    invitationRewardSinceLastLogin: number
  }
  message: string
  error: string
}

export interface InfoModel {
  request_id: ''
  code: number
  data: {
    mining_data: {
      tg_user_id: number
      rate: number
      referral_rate: number
      top_limit: number
      accumulated: number
      next_claim_time: string
      refresh_time: string
      current: number
      next_claim_timestamp: number
      refresh_timestamp: number
    }
  }
  message: string
  error: string
}

export type LvlUpModel = {
  request_id: string
  code: number
  data: {
    user: {
      id: number
      tg_user_id: number
      name: string
      photo_url: ''
      is_premium: number
      level: number
      invites: number
      referral: number
      coins: number
      tabi_address: string
      ton_address: string
      streak: number
      create_time: string
      login_time: string
      check_in_date: string
      on_board: number
      ton_balance: number
    }
  }
  message: string
  error: string
}

export type CheckInModel = {
  request_id: string
  code: number
  data: {
    user: {
      id: number
      tg_user_id: number
      name: string
      photo_url: string
      is_premium: number
      level: number
      invites: number
      referral: number
      coins: number
      tabi_address: string
      ton_address: string
      streak: number
      create_time: string
      login_time: string
      check_in_date: string
      on_board: number
      ton_balance: number
    }
    lastLoginTime: string
    invitationRewardSinceLastLogin: number
  }
  message: string
  error: string
}
