import { findApplication, setGuarantor, toPublicApplication } from '~/server/utils/loanMockDb'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نامعتبر است' } })
  }

  const id = Number(getRouterParam(event, 'id'))
  const application = findApplication(id)

  if (!application) {
    throw createError({ statusCode: 404, data: { message: 'درخواست وام یافت نشد' } })
  }

  if (application.status !== 'draft') {
    throw createError({ statusCode: 422, data: { message: 'فقط درخواست‌های پیش‌نویس قابل ویرایش هستند' } })
  }

  const body = await readBody<{ fullName: string; nationalId: string; phoneNumber: string; relationship: string }>(event)
  const errors: Record<string, string[]> = {}

  if (!body?.fullName?.trim()) errors.fullName = ['نام ضامن الزامی است']
  if (!/^\d{10}$/.test(body?.nationalId || '')) errors.nationalId = ['کد ملی باید ۱۰ رقم باشد']
  if (!/^09\d{9}$/.test(body?.phoneNumber || '')) errors.phoneNumber = ['شماره موبایل معتبر نیست']
  if (!body?.relationship?.trim()) errors.relationship = ['نسبت ضامن الزامی است']

  if (Object.keys(errors).length > 0) {
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors } })
  }

  setGuarantor(application, body)
  return toPublicApplication(application)
})
