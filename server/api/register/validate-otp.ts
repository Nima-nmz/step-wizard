export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body?.code !== '123456') {
    throw createError({
      statusCode: 422,
      data: { errors: { code: ['کد تأیید صحیح نیست'] } },
    })
  }
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, token: 'mock-token-123', refresh_token: 'mock-refresh-456' }
})
