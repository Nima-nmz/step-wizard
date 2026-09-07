import { getOrCreateUser, updateUser } from '~/server/utils/userMockDb'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نشده' } })
  }

  const body = await readBody(event)

  const errors: Record<string, string[]> = {}
  if (body.first_name !== undefined && !body.first_name?.trim()) {
    errors.first_name = ['نام نمی‌تواند خالی باشد']
  }
  if (body.last_name !== undefined && !body.last_name?.trim()) {
    errors.last_name = ['نام خانوادگی نمی‌تواند خالی باشد']
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.email = ['ایمیل معتبر نیست']
  }

  if (Object.keys(errors).length > 0) {
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
