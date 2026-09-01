import type {
  LoanProduct,
  LoanCalculationRequest,
  LoanCalculationResult,
  LoanApplication,
  LoanApplyPayload,
  LoanDocument,
  LoanGuarantor,
  LoanListResponse,
  LoanTimelineEvent,
} from '~/types/loan'
import { LOAN_URLS, ADMIN_LOAN_URLS } from './api.config'
import { useFetchApi } from './useFetchApi'


export async function getLoanProducts(): Promise<LoanProduct[]> {
  const fetchData = useFetchApi<LoanProduct[]>()
  return fetchData(LOAN_URLS.products.url, { method: 'GET' })
}

export async function calculateLoanInstallment(
  payload: LoanCalculationRequest,
): Promise<LoanCalculationResult> {
  const fetchData = useFetchApi<LoanCalculationResult>()
  return fetchData(LOAN_URLS.calculate.url, { method: 'POST', body: payload })
}


export async function applyLoan(payload: LoanApplyPayload): Promise<LoanApplication> {
  const fetchData = useFetchApi<LoanApplication>()
  return fetchData(LOAN_URLS.apply.url, { method: 'POST', body: payload })
}

export async function uploadLoanDocument(loanId: number, file: File): Promise<LoanDocument> {
  const fetchData = useFetchApi<LoanDocument>()
  const formData = new FormData()
  formData.append('document', file)

  return fetchData(LOAN_URLS.uploadDocument(loanId).url, { method: 'POST', body: formData })
}

export async function deleteLoanDocument(loanId: number, documentId: number): Promise<void> {
  const fetchData = useFetchApi<void>()
  return fetchData(LOAN_URLS.deleteDocument(loanId, documentId).url, { method: 'DELETE' })
}

export async function submitLoanGuarantor(
  loanId: number,
  payload: LoanGuarantor,
): Promise<LoanApplication> {
  const fetchData = useFetchApi<LoanApplication>()
  return fetchData(LOAN_URLS.submitGuarantor(loanId).url, { method: 'POST', body: payload })
}

export async function submitLoanApplication(loanId: number): Promise<LoanApplication> {
  const fetchData = useFetchApi<LoanApplication>()
  return fetchData(LOAN_URLS.submit(loanId).url, { method: 'POST' })
}


export async function getLoanList(page = 1, perPage = 10): Promise<LoanListResponse> {
  const fetchData = useFetchApi<LoanListResponse>()
  return fetchData(LOAN_URLS.list.url, { method: 'GET', query: { page, perPage } })
}

export async function getLoanDetail(loanId: number): Promise<LoanApplication> {
  const fetchData = useFetchApi<LoanApplication>()
  return fetchData(LOAN_URLS.detail(loanId).url, { method: 'GET' })
}

export async function cancelLoan(loanId: number): Promise<LoanApplication> {
  const fetchData = useFetchApi<LoanApplication>()
  return fetchData(LOAN_URLS.cancel(loanId).url, { method: 'PATCH' })
}

export async function getLoanTimeline(loanId: number): Promise<LoanTimelineEvent[]> {
  const fetchData = useFetchApi<LoanTimelineEvent[]>()
  return fetchData(LOAN_URLS.timeline(loanId).url, { method: 'GET' })
}

export async function getAdminLoanList(page = 1, perPage = 10): Promise<LoanListResponse> {
  const fetchData = useFetchApi<LoanListResponse>()
  return fetchData(ADMIN_LOAN_URLS.list.url, { method: 'GET', query: { page, perPage } })
}

export async function approveLoanByAdmin(loanId: number): Promise<LoanApplication> {
  const fetchData = useFetchApi<LoanApplication>()
  return fetchData(ADMIN_LOAN_URLS.approve(loanId).url, { method: 'POST' })
}

export async function rejectLoanByAdmin(loanId: number, reason?: string): Promise<LoanApplication> {
  const fetchData = useFetchApi<LoanApplication>()
  return fetchData(ADMIN_LOAN_URLS.reject(loanId).url, { method: 'POST', body: { reason } })
}

