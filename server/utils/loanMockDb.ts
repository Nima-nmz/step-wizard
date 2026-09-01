import type { LoanApplication, LoanProduct, LoanTimelineEvent, LoanStatus, LoanGuarantor } from '~/types/loan'

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: 1,
    title: 'وام کوتاه‌مدت',
    description: 'مناسب برای نیازهای فوری با بازپرداخت سریع',
    interestRate: 18,
    minAmount: 5_000_000,
    maxAmount: 50_000_000,
    minDurationMonths: 3,
    maxDurationMonths: 12,
  },
  {
    id: 2,
    title: 'وام میان‌مدت',
    description: 'تعادل بین مبلغ وام و مدت بازپرداخت',
    interestRate: 20,
    minAmount: 20_000_000,
    maxAmount: 150_000_000,
    minDurationMonths: 6,
    maxDurationMonths: 24,
  },
  {
    id: 3,
    title: 'وام بلندمدت',
    description: 'برای مبالغ بالاتر با اقساط سبک‌تر',
    interestRate: 23,
    minAmount: 50_000_000,
    maxAmount: 300_000_000,
    minDurationMonths: 12,
    maxDurationMonths: 48,
  },
]

interface LoanRecord extends LoanApplication {
  timeline: LoanTimelineEvent[]
  ownerToken: string
}

const applications: LoanRecord[] = []
let nextLoanId = 1
let nextDocId = 1
let nextTimelineId = 1

const nowIso = () => new Date().toISOString()

function seed() {
  applications.push(
    {
      id: nextLoanId++,
      productId: 2,
      amount: 20_000_000,
      durationMonths: 6,
      status: 'approved',
      documents: [],
      guarantor: null,
      ownerToken: 'user-seed-1',
      createdAt: '2026-07-01T09:00:00.000Z',
      updatedAt: '2026-07-05T09:00:00.000Z',
      timeline: [
        { id: nextTimelineId++, status: 'pending', note: 'درخواست ثبت شد', createdAt: '2026-07-01T09:00:00.000Z' },
        { id: nextTimelineId++, status: 'under_review', note: 'در حال بررسی کارشناس', createdAt: '2026-07-03T09:00:00.000Z' },
        { id: nextTimelineId++, status: 'approved', note: 'درخواست تأیید شد', createdAt: '2026-07-05T09:00:00.000Z' },
      ],
    },
    {
      id: nextLoanId++,
      productId: 1,
      amount: 30_000_000,
      durationMonths: 9,
      status: 'rejected',
      documents: [],
      guarantor: null,
      ownerToken: 'user-seed-1',
      createdAt: '2026-06-15T09:00:00.000Z',
      updatedAt: '2026-06-18T09:00:00.000Z',
      timeline: [
        { id: nextTimelineId++, status: 'pending', note: 'درخواست ثبت شد', createdAt: '2026-06-15T09:00:00.000Z' },
        { id: nextTimelineId++, status: 'rejected', note: 'مدارک ناکافی', createdAt: '2026-06-18T09:00:00.000Z' },
      ],
    },
  )
}
seed()

export function createApplication(productId: number, amount: number, durationMonths: number, ownerToken: string): LoanRecord {
  const record: LoanRecord = {
    id: nextLoanId++,
    productId,
    amount,
    durationMonths,
    status: 'draft',
    documents: [],
    guarantor: null,
    ownerToken,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    timeline: [{ id: nextTimelineId++, status: 'draft', note: 'درخواست ایجاد شد', createdAt: nowIso() }],
  }
  applications.push(record)
  return record
}

export function findApplication(id: number): LoanRecord | undefined {
  return applications.find((a) => a.id === id)
}

export function listApplications(): LoanRecord[] {
  return [...applications].sort((a, b) => b.id - a.id)
}

export function addDocument(app: LoanRecord, name: string, url = '#') {
  const doc = { id: nextDocId++, name, url, uploadedAt: nowIso() }
  app.documents.push(doc)
  app.updatedAt = nowIso()
  return doc
}

export function removeDocument(app: LoanRecord, docId: number) {
  app.documents = app.documents.filter((d) => d.id !== docId)
  app.updatedAt = nowIso()
}

export function setGuarantor(app: LoanRecord, guarantor: LoanGuarantor) {
  app.guarantor = guarantor
  app.updatedAt = nowIso()
}

export function pushTimeline(app: LoanRecord, status: LoanStatus, note?: string) {
  app.timeline.push({ id: nextTimelineId++, status, note, createdAt: nowIso() })
  app.status = status
  app.updatedAt = nowIso()
}

export function toPublicApplication(record: LoanRecord): LoanApplication {
  const { timeline, ownerToken, ...rest } = record
  return rest
}

export function getOwnerToken(record: LoanRecord): string {
  return record.ownerToken
}
