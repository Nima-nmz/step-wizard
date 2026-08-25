import { listApplications, toPublicApplication } from '~/server/utils/loanMockDb'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نامعتبر است' } })
  }

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 10

  const allItems = listApplications().map(toPublicApplication)

  return {
    items: allItems.slice((page - 1) * perPage, page * perPage),
    meta: { page, perPage, total: allItems.length },
  }
})
