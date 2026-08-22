import { defineStore } from 'pinia'
import type {
  LoanProduct,
  LoanCalculationResult,
  LoanApplication,
  LoanDocument,
  LoanGuarantor,
  LoanTimelineEvent,
} from '~/types/loan'

interface LoanState {
  products: LoanProduct[]
  productsLoading: boolean

  calculation: LoanCalculationResult | null
  calculating: boolean

  currentApplication: LoanApplication | null
  isSubmittingApplication: boolean

  applications: LoanApplication[]
  applicationsLoading: boolean
  applicationsMeta: { page: number; perPage: number; total: number }

  timeline: LoanTimelineEvent[]
  timelineLoading: boolean

  validationErrors: Record<string, string>
}

const defaultState = (): LoanState => ({
  products: [],
  productsLoading: false,

  calculation: null,
  calculating: false,

  currentApplication: null,
  isSubmittingApplication: false,

  applications: [],
  applicationsLoading: false,
  applicationsMeta: { page: 1, perPage: 10, total: 0 },

  timeline: [],
  timelineLoading: false,

  validationErrors: {},
})

export const useLoanStore = defineStore('loan', {
  state: defaultState,

  getters: {
    getFieldError: (s) => (field: string) => s.validationErrors[field] || '',

    canSubmitApplication: (s) =>
      !!s.currentApplication &&
      s.currentApplication.documents.length > 0 &&
      s.currentApplication.guarantor !== null,
  },

  actions: {
    setProducts(products: LoanProduct[]) {
      this.products = products
    },
    setProductsLoading(value: boolean) {
      this.productsLoading = value
    },

    setCalculation(result: LoanCalculationResult | null) {
      this.calculation = result
    },
    setCalculating(value: boolean) {
      this.calculating = value
    },

    setCurrentApplication(application: LoanApplication | null) {
      this.currentApplication = application
    },
    addDocument(document: LoanDocument) {
      this.currentApplication?.documents.push(document)
    },
    removeDocument(documentId: number) {
      if (!this.currentApplication) return
      this.currentApplication.documents = this.currentApplication.documents.filter(
        (d) => d.id !== documentId,
      )
    },
    setGuarantor(guarantor: LoanGuarantor) {
      if (!this.currentApplication) return
      this.currentApplication.guarantor = guarantor
    },
    setSubmittingApplication(value: boolean) {
      this.isSubmittingApplication = value
    },

    setApplications(items: LoanApplication[], meta: LoanState['applicationsMeta']) {
      this.applications = items
      this.applicationsMeta = meta
    },
    setApplicationsLoading(value: boolean) {
      this.applicationsLoading = value
    },
    updateApplicationStatus(id: number, status: LoanApplication['status']) {
      const target = this.applications.find((a) => a.id === id)
      if (target) target.status = status
    },
    removeApplication(id: number) {
      this.applications = this.applications.filter((a) => a.id !== id)
    },

    setTimeline(events: LoanTimelineEvent[]) {
      this.timeline = events
    },
    setTimelineLoading(value: boolean) {
      this.timelineLoading = value
    },

    setValidationErrors(errors: Record<string, string>) {
      this.validationErrors = errors
    },
    clearFieldError(field: string) {
      if (this.validationErrors[field]) {
        const newErrors = { ...this.validationErrors }
        delete newErrors[field]
        this.validationErrors = newErrors
      }
    },

    resetLoanStore() {
      Object.assign(this, defaultState())
    },
  },
})