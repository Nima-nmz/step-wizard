export interface UserProfile {
  id: number
  phoneNumber: string
  firstName: string
  lastName: string
  nationalId: string
  birthDate: string
  email: string | null
  avatarUrl: string | null
  idCardUrl: string | null
  iban: string | null
  bankName: string | null
  accountNumber: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateProfilePayload {
  first_name?: string
  last_name?: string
  email?: string | null
  birth_date?: string
}

export interface UpdateBankPayload {
  iban: string
  bank_name?: string
  account_number?: string
}

export interface UpdateAvatarPayload {
  avatar: File
}

export interface UserProfileResponse {
  success: boolean
  user: UserProfile
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
  user: UserProfile
}
