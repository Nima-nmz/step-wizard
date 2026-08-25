import { promises as fs } from 'node:fs'
import path from 'node:path'
import { findApplication, addDocument } from '~/server/utils/loanMockDb'

const UPLOAD_ROOT = path.join(process.cwd(), '.data', 'uploads')

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
    throw createError({ statusCode: 422, data: { message: 'فقط درخواست‌های پیش‌نویس قابل ویرایش هستند' } })
  }

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'document')

  if (!file || !file.data) {
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors: { document: ['فایل الزامی است'] } } })
  }

  const doc = addDocument(application, file.filename || 'مدرک.jpg')
  const docUrl = `/api/loans/${id}/documents/${doc.id}`

  try {
    const dir = path.join(UPLOAD_ROOT, String(id))
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, String(doc.id)), file.data)
    doc.url = docUrl
  } catch {
  }

  return doc
})
