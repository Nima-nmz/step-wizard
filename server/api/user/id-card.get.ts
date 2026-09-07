import { findUserByToken } from '~/server/utils/userMockDb'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نشده' } })
  }

  const user = findUserByToken(token)
  if (!user) {
    throw createError({ statusCode: 404, data: { message: 'کاربر یافت نشد' } })
  }

  if (!user.idCardUrl) {
    throw createError({ statusCode: 404, data: { message: 'تصویر کارت ملی موجود نیست' } })
  }

  return { success: true, idCardUrl: user.idCardUrl }
})
