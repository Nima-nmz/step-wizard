import { getOrCreateUser, updateUser } from '~/server/utils/userMockDb'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نشده' } })
  }

  const body = await readBody(event)

  const errors: Record<string, string[]> = {}
  if (!body.iban?.trim()) {
    errors.iban = ['شماره شبا الزامی است']
  } else {
    const cleaned = body.iban.replace(/[\s\-]/g, '').toUpperCase()
    if (!/^IR\d{24}$/.test(cleaned)) {
      errors.iban = ['شماره شبا معتبر نیست (IR + 24 رقم)']
    }
  }

  if (Object.keys(errors).length > 0) {
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر', errors } })
  }

  await new Promise((r) => setTimeout(r, 500))

  getOrCreateUser(token)
  const cleaned = body.iban.replace(/[\s\-]/g, '').toUpperCase()
  const updated = updateUser(token, {
    iban: cleaned,
    bankName: body.bank_name || null,
    accountNumber: body.account_number || null,
  })!

  return { success: true, message: 'اطلاعات بانکی بروزرسانی شد', user: updated }
})
