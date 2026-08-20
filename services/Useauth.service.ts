import type { ValidationCode } from '~/types/wizard'
import { AUTH_URLS } from './api.config'
import { useFetchApi } from './useFetchApi'

interface SendOtpResponse {
  success: boolean
  message: string
  remind_valid_time: number
}

interface ValidateOtpResponse extends ValidationCode {
  success: boolean
}

export async function sendOtpApi(phoneNumber: string): Promise<SendOtpResponse> {
  const fetchData = useFetchApi<SendOtpResponse>()

  return fetchData(
    AUTH_URLS.sendOtp.url,
    { method: 'POST', body: { number: phoneNumber } },
    { setToken: false },
  )
}

export async function verifyOtpApi(phoneNumber: string, code: string): Promise<ValidateOtpResponse> {
  const fetchData = useFetchApi<ValidateOtpResponse>()

  return fetchData(
    AUTH_URLS.validateOtp.url,
    { method: 'POST', body: { number: phoneNumber, code } },
    { setToken: false },
  )
}