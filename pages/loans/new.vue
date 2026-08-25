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
@reference "~/assets/css/main.css";

.new-loan-page {
  @apply mx-auto max-w-[700px] px-4 py-6;
}
.page-header {
  @apply mb-6;
}
.page-header h1 {
  @apply mb-1 text-[1.4rem] font-semibold;
}
.page-header p {
  @apply text-[0.9rem] text-gray-500;
}
.state-box {
  @apply flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-12 text-gray-500 shadow-[0_1px_3px_rgba(0,0,0,0.08)];
}
.error-box { @apply text-red-600; }
.btn-retry {
  @apply rounded-lg border-none bg-gray-100 px-5 py-2 text-gray-700 cursor-pointer;
}
.spinner {
  @apply h-5 w-5 rounded-full border-[3px] border-gray-200 border-t-blue-500;
  animation: spin 0.7s linear infinite;
}
.spinner-sm {
  @apply h-[14px] w-[14px] border-2 border-white/40 border-t-white;
}
@keyframes spin { to { transform: rotate(360deg); } }
.product-list {
  @apply mb-6 flex flex-col gap-3;
}
.calc-form {
  @apply rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)];
}
.form-row {
  @apply mb-4;
}
.form-row label {
  @apply mb-2 block text-[0.9rem] font-medium text-gray-700;
}
.form-row input {
  @apply w-full rounded-lg border-[1.5px] border-gray-300 bg-white p-3 text-base font-[inherit] box-border transition-[border-color,box-shadow] duration-200;
}
.form-row input:focus {
  @apply border-blue-500 outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.15)];
}
.btn-calc {
  @apply flex w-full items-center justify-center gap-2 rounded-lg border-none bg-blue-500 p-3 text-[0.95rem] font-medium text-white cursor-pointer transition-colors duration-200;
}
.btn-calc:hover:not(:disabled) { @apply bg-blue-600; }
.btn-calc:disabled { @apply cursor-not-allowed opacity-[0.55]; }
.error {
  @apply mt-3 text-[0.85rem] text-red-500;
}
.calc-result {
  @apply mt-5 border-t border-gray-100 pt-5;
}
.result-row {
  @apply flex justify-between py-1.5 text-[0.9rem] text-gray-700;
}
.result-row strong {
  @apply text-gray-900;
}
.btn-submit {
  @apply mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-none bg-green-500 p-[0.85rem] text-[0.95rem] font-medium text-white cursor-pointer transition-colors duration-200;
}
.btn-submit:hover:not(:disabled) { @apply bg-green-600; }
.btn-submit:disabled { @apply cursor-not-allowed opacity-60; }
@media (max-width: 480px) {
  .calc-form { @apply p-[1.1rem]; }
}
</style>
