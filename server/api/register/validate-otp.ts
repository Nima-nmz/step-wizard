const ADMIN_PHONE_NUMBERS = ['09120000000']

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body?.code !== '123456') {
    throw createError({
      statusCode: 422,
      data: { errors: { code: ['کد تأیید صحیح نیست'] } },
    })
  }
  await new Promise((r) => setTimeout(r, 500))
  const role = ADMIN_PHONE_NUMBERS.includes(body?.number) ? 'admin' : 'user'
  const token = role === 'admin' ? 'mock-admin-token-123' : `user-token-${body?.number}`

  const { getOrCreateUser } = await import('~/server/utils/userMockDb')
  getOrCreateUser(token, { phoneNumber: body?.number })

  return { success: true, token, refresh_token: 'mock-refresh-456', role }
})
