import { findApplication } from '~/server/utils/loanMockDb'

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

  return application.timeline
})
