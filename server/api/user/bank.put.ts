import { getOrCreateUser, updateUser } from '~/server/utils/userMockDb'
import { validateUpdateBank } from '~/lib/validations'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نشده' } })
  }

  const body = await readBody(event)

  const { valid, errors: validationErrors } = validateUpdateBank(body)

  if (!valid) {
    const errors: Record<string, string[]> = {}
    for (const [field, msg] of Object.entries(validationErrors)) {
      errors[field] = [msg]
    }
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
