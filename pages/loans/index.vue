<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLoanStore } from '~/stores/Loanstore'
import { getLoanList } from '~/services/Useloan.service'
import LoanStatusBadge from '~/components/loan/LoanStatusBadge.vue'

const store = useLoanStore()
const { applications, applicationsLoading } = storeToRefs(store)

const loadError = ref('')

async function fetchApplications() {
  store.setApplicationsLoading(true)
  loadError.value = ''

  try {
    const data = await getLoanList()
    store.setApplications(data.items, data.meta)
  } catch {
    loadError.value = 'دریافت لیست درخواست‌ها با خطا مواجه شد.'
  } finally {
    store.setApplicationsLoading(false)
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

onMounted(fetchApplications)
</script>

<template>
  <div class="loans-page">
    <header class="loans-header">
      <div>
        <h1>درخواست‌های وام</h1>
        <p>لیست درخواست‌های ثبت‌شده و وضعیت هر کدوم</p>
      </div>
      <NuxtLink to="/loans/new" class="btn-new">درخواست جدید</NuxtLink>
    </header>

    <div v-if="applicationsLoading" class="state-box">
      <span class="spinner" />
      در حال دریافت لیست...
    </div>

    <div v-else-if="loadError" class="state-box error-box">
      <p>{{ loadError }}</p>
      <button class="btn-retry" @click="fetchApplications">تلاش مجدد</button>
    </div>

    <div v-else-if="applications.length === 0" class="state-box empty-box">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 15h6" />
      </svg>
      <p>هنوز هیچ درخواست وامی ثبت نکردی</p>
      <NuxtLink to="/loans/new" class="btn-new">ثبت اولین درخواست</NuxtLink>
    </div>

    <ul v-else class="loan-list">
      <li v-for="loan in applications" :key="loan.id" class="loan-card">
        <div class="loan-card-main">
          <span class="loan-amount">{{ formatAmount(loan.amount) }}</span>
          <span class="loan-duration">{{ loan.durationMonths }} ماهه</span>
        </div>
        <div class="loan-card-side">
          <LoanStatusBadge :status="loan.status" />
          <NuxtLink :to="`/loans/${loan.id}`" class="loan-detail-link">مشاهده جزئیات</NuxtLink>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.loans-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.loans-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.loans-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
  font-weight: 600;
}

.loans-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.btn-new {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.25rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}
.btn-new:hover {
  background: #2563eb;
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
  text-align: center;
}

.empty-box svg {
  color: #d1d5db;
}

.error-box {
  color: #dc2626;
}

.btn-retry {
  padding: 0.5rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn-retry:hover {
  background: #e5e7eb;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loan-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loan-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.loan-card-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.loan-amount {
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

.loan-duration {
  font-size: 0.8rem;
  color: #6b7280;
}

.loan-card-side {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.loan-detail-link {
  font-size: 0.85rem;
  color: #3b82f6;
  text-decoration: none;
}
.loan-detail-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .loans-header {
    flex-direction: column;
  }
  .loan-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .loan-card-side {
    width: 100%;
    justify-content: space-between;
  }
}
</style>