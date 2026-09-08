import { getOrCreateUser, updateUser } from '~/server/utils/userMockDb'
import { validateUpdateProfile } from '~/lib/validations'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نشده' } })
  }

  const body = await readBody(event)

  const { valid, errors: validationErrors } = validateUpdateProfile(body)

  if (!valid) {
    const errors: Record<string, string[]> = {}
    for (const [field, msg] of Object.entries(validationErrors)) {
      errors[field] = [msg]
    }
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر', errors } })
  }

  const updateData: Record<string, any> = {}
  if (body.first_name !== undefined) updateData.firstName = body.first_name
  if (body.last_name !== undefined) updateData.lastName = body.last_name
  if (body.email !== undefined) updateData.email = body.email || null
  if (body.birth_date !== undefined) updateData.birthDate = body.birth_date

  await new Promise((r) => setTimeout(r, 500))

  getOrCreateUser(token)
  const updated = updateUser(token, updateData)!
  return { success: true, message: 'اطلاعات بروزرسانی شد', user: updated }
})
