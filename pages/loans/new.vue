<script setup lang="ts">
import { watch } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoanStore } from '~/stores/Loanstore'
import { getLoanProducts, calculateLoanInstallment, applyLoan } from '~/services/Useloan.service'
import LoanProductCard from '~/components/loan/LoanProductCard.vue'

const store = useLoanStore()
const router = useRouter()

const productsLoading = ref(false)
const loadError = ref('')

const selectedProductId = ref<number | null>(null)
const amount = ref<number | null>(null)
const durationMonths = ref<number | null>(null)

const calculating = ref(false)
const calcError = ref('')
const applying = ref(false)

const selectedProduct = computed(() =>
  store.products.find((p) => p.id === selectedProductId.value) || null,
)

async function fetchProducts() {
  productsLoading.value = true
  loadError.value = ''
  try {
    const products = await getLoanProducts()
    store.setProducts(products)
  } catch {
    loadError.value = 'دریافت طرح‌های وام با خطا مواجه شد.'
  } finally {
    productsLoading.value = false
  }
}

function selectProduct(id: number) {
  selectedProductId.value = id
  store.setCalculation(null)
  calcError.value = ''
}

async function calculate() {
  if (!selectedProduct.value || !amount.value || !durationMonths.value) return

  calculating.value = true
  calcError.value = ''
  store.setCalculation(null)

  try {
    const result = await calculateLoanInstallment({
      productId: selectedProduct.value.id,
      amount: amount.value,
      durationMonths: durationMonths.value,
    })
    store.setCalculation(result)
  } catch (error: any) {
    calcError.value = error?.data?.errors
      ? Object.values(error.data.errors).flat().join(' - ')
      : 'محاسبه با خطا مواجه شد.'
  } finally {
    calculating.value = false
  }
}

async function submitApplication() {
  if (!selectedProduct.value || !amount.value || !durationMonths.value) return

  applying.value = true
  try {
    const application = await applyLoan({
      productId: selectedProduct.value.id,
      amount: amount.value,
      durationMonths: durationMonths.value,
    })
    store.setCurrentApplication(application)
    router.push(`/loans/${application.id}`)
  } catch {
    calcError.value = 'ثبت درخواست با خطا مواجه شد.'
  } finally {
    applying.value = false
  }
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('fa-IR').format(n) + ' تومان'
}
   watch([amount, durationMonths], () => {
     if (store.calculation) {
       store.setCalculation(null)
     }
   })

onMounted(fetchProducts)
</script>

<template>
  <div class="new-loan-page">
    <header class="page-header">
      <h1>درخواست وام جدید</h1>
      <p>یک طرح رو انتخاب کن و مبلغ و مدت بازپرداخت رو مشخص کن</p>
    </header>

    <div v-if="productsLoading" class="state-box">
      <span class="spinner" />
      در حال دریافت طرح‌ها...
    </div>

    <div v-else-if="loadError" class="state-box error-box">
      <p>{{ loadError }}</p>
      <button class="btn-retry" @click="fetchProducts">تلاش مجدد</button>
    </div>

    <template v-else>
      <div class="product-list">
        <LoanProductCard
          v-for="product in store.products"
          :key="product.id"
          :product="product"
          :selected="product.id === selectedProductId"
          @select="selectProduct(product.id)"
        />
      </div>

      <div v-if="selectedProduct" class="calc-form">
        <div class="form-row">
          <label>مبلغ وام (تومان)</label>
          <input
            v-model.number="amount"
            type="number"
            :min="selectedProduct.minAmount"
            :max="selectedProduct.maxAmount"
            :placeholder="`بین ${formatAmount(selectedProduct.minAmount)} تا ${formatAmount(selectedProduct.maxAmount)}`"
          />
        </div>

        <div class="form-row">
          <label>مدت بازپرداخت (ماه)</label>
          <input
            v-model.number="durationMonths"
            type="number"
            :min="selectedProduct.minDurationMonths"
            :max="selectedProduct.maxDurationMonths"
            :placeholder="`بین ${selectedProduct.minDurationMonths} تا ${selectedProduct.maxDurationMonths} ماه`"
          />
        </div>

        <button class="btn-calc" :disabled="!amount || !durationMonths || calculating" @click="calculate">
          <span v-if="calculating" class="spinner spinner-sm" />
          {{ calculating ? 'در حال محاسبه...' : 'محاسبه قسط' }}
        </button>

        <p v-if="calcError" class="error">{{ calcError }}</p>

        <div v-if="store.calculation" class="calc-result">
          <div class="result-row">
            <span>قسط ماهانه</span>
            <strong>{{ formatAmount(store.calculation.monthlyInstallment) }}</strong>
          </div>
          <div class="result-row">
            <span>مجموع بازپرداخت</span>
            <strong>{{ formatAmount(store.calculation.totalPayment) }}</strong>
          </div>
          <div class="result-row">
            <span>مجموع سود</span>
            <strong>{{ formatAmount(store.calculation.totalInterest) }}</strong>
          </div>

          <button class="btn-submit" :disabled="applying" @click="submitApplication">
            <span v-if="applying" class="spinner spinner-sm" />
            {{ applying ? 'در حال ثبت...' : 'ثبت درخواست' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.new-loan-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.page-header {
  margin-bottom: 1.5rem;
}
.page-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
  font-weight: 600;
}
.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  color: #6b7280;
}
.error-box { color: #dc2626; }
.btn-retry {
  padding: 0.5rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.spinner-sm {
  width: 14px;
  height: 14px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
}
@keyframes spin { to { transform: rotate(360deg); } }

.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.calc-form {
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.form-row {
  margin-bottom: 1rem;
}
.form-row label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #374151;
}
.form-row input {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-row input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.btn-calc {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-calc:hover:not(:disabled) { background: #2563eb; }
.btn-calc:disabled { opacity: 0.55; cursor: not-allowed; }

.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

.calc-result {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #eee;
}
.result-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.9rem;
  color: #374151;
}
.result-row strong {
  color: #111827;
}

.btn-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.85rem;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-submit:hover:not(:disabled) { background: #16a34a; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 480px) {
  .calc-form { padding: 1.1rem; }
}
</style>