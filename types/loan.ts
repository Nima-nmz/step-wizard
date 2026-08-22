export type LoanStatus =
  | 'draft'
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'cancelled'   

export interface LoanProduct {
  id: number
  title: string
  description?: string
  interestRate: number       // درصد سود سالانه
  minAmount: number
  maxAmount: number
  minDurationMonths: number
  maxDurationMonths: number
}

export interface LoanCalculationRequest {
  productId: number
  amount: number
  durationMonths: number
}

export interface LoanCalculationResult {
  monthlyInstallment: number
  totalPayment: number
  totalInterest: number
}

export interface LoanDocument {
  id: number
  name: string
  url: string
  uploadedAt: string
}

export interface LoanGuarantor {
  fullName: string
  nationalId: string
  phoneNumber: string
  relationship: string
}

export interface LoanTimelineEvent {
  id: number
  status: LoanStatus
  note?: string
  createdAt: string
}

export interface LoanApplication {
  id: number
  productId: number
  amount: number
  durationMonths: number
  status: LoanStatus
  documents: LoanDocument[]
  guarantor: LoanGuarantor | null
  createdAt: string
  updatedAt: string
}

export interface LoanApplyPayload {
  productId: number
  amount: number
  durationMonths: number
}

export interface LoanListResponse {
  items: LoanApplication[]
  meta: {
    page: number
    perPage: number
    total: number
  }
}