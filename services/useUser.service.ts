import type { UserProfile, UpdateProfilePayload, UpdateBankPayload, UserProfileResponse, UpdateProfileResponse } from '~/types/user'
import { USER_URLS } from './api.config'
import { useFetchApi } from './useFetchApi'

export async function getUserProfile(): Promise<UserProfile> {
  const fetchData = useFetchApi<UserProfileResponse>()
  const data = await fetchData(USER_URLS.profile.url)
  return data.user
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResponse> {
  const fetchData = useFetchApi<UpdateProfileResponse>()
  const data = await fetchData(USER_URLS.updateProfile.url, {
    method: 'PUT',
    body: payload,
  })
  return data
}

export async function updateAvatar(file: File): Promise<UpdateProfileResponse> {
  const fetchData = useFetchApi<UpdateProfileResponse>()
  const formData = new FormData()
  formData.append('avatar', file)
  const data = await fetchData(USER_URLS.updateAvatar.url, {
    method: 'POST',
    body: formData,
  })
  return data
}

export async function updateBankInfo(payload: UpdateBankPayload): Promise<UpdateProfileResponse> {
  const fetchData = useFetchApi<UpdateProfileResponse>()
  const data = await fetchData(USER_URLS.updateBank.url, {
    method: 'PUT',
    body: payload,
  })
  return data
}

export async function getIdCard(): Promise<{ success: boolean; idCardUrl: string }> {
  const fetchData = useFetchApi<{ success: boolean; idCardUrl: string }>()
  const data = await fetchData(USER_URLS.idCard.url)
  return data
}
