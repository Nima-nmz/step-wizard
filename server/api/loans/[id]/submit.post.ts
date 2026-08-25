import { findApplication, pushTimeline, toPublicApplication } from '~/server/utils/loanMockDb'

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

  if (application.status !== 'draft') {
    throw createError({ statusCode: 422, data: { message: 'فقط درخواست‌های پیش‌نویس قابل ارسال هستند' } })
  }

  if (application.documents.length === 0) {
    throw createError({ statusCode: 422, data: { message: 'حداقل یک مدرک ضمانت الزامی است' } })
  }

  if (!application.guarantor) {
    throw createError({ statusCode: 422, data: { message: 'اطلاعات ضامن الزامی است' } })
  }

  pushTimeline(application, 'pending', 'درخواست ارسال شد')
  return toPublicApplication(application)
})
