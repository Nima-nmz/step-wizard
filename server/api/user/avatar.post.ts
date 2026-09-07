import { getOrCreateUser, updateUser } from '~/server/utils/userMockDb'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نشده' } })
  }

  const parts = await readMultipartFormData(event)
  const avatarPart = parts?.find((p) => p.name === 'avatar')

  if (!avatarPart) {
    throw createError({ statusCode: 422, data: { message: 'فایل ارسال نشد' } })
  }

  if (avatarPart.type && !avatarPart.type.startsWith('image/')) {
    throw createError({ statusCode: 422, data: { message: 'فایل باید تصویر باشد' } })
  }

  const avatarUrl = `data:${avatarPart.type || 'image/png'};base64,${avatarPart.data.toString('base64')}`

  await new Promise((r) => setTimeout(r, 500))

  getOrCreateUser(token)
  const updated = updateUser(token, { avatarUrl })!
  return { success: true, message: 'عکس پروفایل بروزرسانی شد', user: updated }
})
