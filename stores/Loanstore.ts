import { defineStore } from 'pinia'
import type { LoanProduct, LoanCalculationResult, LoanApplication } from '~/types/loan'

interface LoanState {
  products: LoanProduct[]
  calculation: LoanCalculationResult | null
  currentApplication: LoanApplication | null
  applications: LoanApplication[]
  applicationsLoading: boolean
  applicationsMeta: { page: number; perPage: number; total: number }
}

const defaultState = (): LoanState => ({
  products: [],
  calculation: null,
  currentApplication: null,
  applications: [],
  applicationsLoading: false,
  applicationsMeta: { page: 1, perPage: 10, total: 0 },
})

export const useLoanStore = defineStore('loan', {
  state: defaultState,

  actions: {
    setProducts(products: LoanProduct[]) {
      this.products = products
    },
    setCalculation(result: LoanCalculationResult | null) {
      this.calculation = result
    },
    setCurrentApplication(application: LoanApplication | null) {
      this.currentApplication = application
    },
    setApplications(items: LoanApplication[], meta: LoanState['applicationsMeta']) {
      this.applications = items
      this.applicationsMeta = meta
    },
    setApplicationsLoading(value: boolean) {
      this.applicationsLoading = value
    },
    resetLoanStore() {
      Object.assign(this, defaultState())
    },
  },
})