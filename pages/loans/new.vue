<script setup lang="ts">
import { useLoanWizard } from '~/composables/useLoanWizard'
import { useLoanFormatter } from '~/composables/useLoanFormatter'
import PageContainer from '~/components/ui/PageContainer.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
import FormField from '~/components/ui/FormField.vue'
import LoadingButton from '~/components/ui/LoadingButton.vue'
import LoanProductCard from '~/components/loan/LoanProductCard.vue'

const { formatAmount } = useLoanFormatter()

const {
  products, productsLoading, loadError,
  selectedProductId, selectedProduct, amount, durationMonths,
  calculating, calcError, calculation, applying,
  fetchProducts,
  selectProduct, calculate, submitApplication,
} = useLoanWizard()
</script>

<template>
  <PageContainer>
    <header class="page-header">
      <h1>درخواست وام جدید</h1>
      <p>یک طرح رو انتخاب کن و مبلغ و مدت بازپرداخت رو مشخص کن</p>
    </header>

    <LoadingState :loading="productsLoading" :error="loadError" loading-text="در حال دریافت طرح‌ها..." @retry="fetchProducts">
      <div class="product-list">
        <LoanProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :selected="product.id === selectedProductId"
          @select="selectProduct(product.id)"
        />
      </div>

      <div v-if="selectedProduct" class="calc-form">
        <FormField label="مبلغ وام (تومان)">
          <input
            v-model.number="amount"
            type="number"
            :min="selectedProduct.minAmount"
            :max="selectedProduct.maxAmount"
            :placeholder="`بین ${formatAmount(selectedProduct.minAmount)} تا ${formatAmount(selectedProduct.maxAmount)}`"
          />
        </FormField>

        <FormField label="مدت بازپرداخت (ماه)">
          <input
            v-model.number="durationMonths"
            type="number"
            :min="selectedProduct.minDurationMonths"
            :max="selectedProduct.maxDurationMonths"
            :placeholder="`بین ${selectedProduct.minDurationMonths} تا ${selectedProduct.maxDurationMonths} ماه`"
          />
        </FormField>

        <LoadingButton variant="primary" :loading="calculating" :disabled="!amount || !durationMonths" @click="calculate">
          {{ calculating ? 'در حال محاسبه...' : 'محاسبه قسط' }}
        </LoadingButton>

        <p v-if="calcError" class="error-text">{{ calcError }}</p>

        <div v-if="calculation" class="calc-result">
          <div class="result-row">
            <span>قسط ماهانه</span>
            <strong>{{ formatAmount(calculation.monthlyInstallment) }}</strong>
          </div>
          <div class="result-row">
            <span>مجموع بازپرداخت</span>
            <strong>{{ formatAmount(calculation.totalPayment) }}</strong>
          </div>
          <div class="result-row">
            <span>مجموع سود</span>
            <strong>{{ formatAmount(calculation.totalInterest) }}</strong>
          </div>

          <LoadingButton variant="success" :loading="applying" @click="submitApplication">
            {{ applying ? 'در حال ثبت...' : 'ثبت درخواست' }}
          </LoadingButton>
        </div>
      </div>
    </LoadingState>
  </PageContainer>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.product-list {
  @apply mb-6 flex flex-col gap-3;
}
.calc-form {
  @apply rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)];
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
@media (max-width: 480px) {
  .calc-form { @apply p-[1.1rem]; }
}
</style>
