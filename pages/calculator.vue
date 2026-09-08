<script setup lang="ts">
import { computed, ref } from 'vue'
import { PRODUCTS } from '~/lib/validations'
import { useLoanFormatter } from '~/composables/useLoanFormatter'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  CreditCardIcon,
  CalculatorIcon,
  ClockIcon,
  TrendingUpIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ZapIcon,
  CheckIcon,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'landing',
})

const PRODUCT_META: Record<number, { title: string; desc: string }> = {
  1: { title: 'وام کوتاه‌مدت', desc: 'بازپرداخت سریع' },
  2: { title: 'وام میان‌مدت', desc: 'تعادل مبلغ و مدت' },
  3: { title: 'وام بلندمدت', desc: 'اقساط سبک‌تر' },
}

const productList = computed(() =>
  Object.entries(PRODUCTS).map(([id, p]) => ({
    id: Number(id),
    ...p,
    title: PRODUCT_META[Number(id)]?.title ?? `طرح ${id}`,
    desc: PRODUCT_META[Number(id)]?.desc ?? '',
  })),
)

const selectedProductId = ref(1)
const amount = ref(20_000_000)
const durationMonths = ref(12)

const { formatAmount } = useLoanFormatter()

const selectedProduct = computed(
  () => productList.value.find((p) => p.id === selectedProductId.value) ?? productList.value[0],
)

const minAmount = computed(() => selectedProduct.value.minAmount)
const maxAmount = computed(() => selectedProduct.value.maxAmount)
const minDuration = computed(() => selectedProduct.value.minDurationMonths)
const maxDuration = computed(() => selectedProduct.value.maxDurationMonths)
const interestRate = computed(() => selectedProduct.value.interestRate)

function amortize(principal: number, annualRate: number, n: number) {
  const r = annualRate / 100 / 12
  if (n <= 0) return { monthlyInstallment: 0, totalPayment: 0, totalInterest: 0 }
  if (r <= 0) {
    const m = Math.round(principal / n)
    return { monthlyInstallment: m, totalPayment: m * n, totalInterest: 0 }
  }
  const factor = Math.pow(1 + r, n)
  const monthlyInstallment = Math.round((principal * r * factor) / (factor - 1))
  const totalPayment = monthlyInstallment * n
  return { monthlyInstallment, totalPayment, totalInterest: totalPayment - principal }
}

const calculation = computed(() => amortize(amount.value, interestRate.value, durationMonths.value))

const QUICK_AMOUNTS = [10_000_000, 20_000_000, 50_000_000, 100_000_000, 200_000_000]
const QUICK_DURATIONS = [6, 12, 18, 24, 36]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function handleProductChange(id: number) {
  selectedProductId.value = id
  const p = productList.value.find((x) => x.id === id)!
  amount.value = clamp(amount.value, p.minAmount, p.maxAmount)
  durationMonths.value = clamp(durationMonths.value, p.minDurationMonths, p.maxDurationMonths)
}

function handleAmountChange(val: number[] | undefined) {
  if (!val?.length || val[0] == null) return
  amount.value = clamp(Math.round(val[0]), minAmount.value, maxAmount.value)
}

function handleDurationChange(val: number[] | undefined) {
  if (!val?.length || val[0] == null) return
  durationMonths.value = clamp(Math.round(val[0]), minDuration.value, maxDuration.value)
}
</script>

<template>
  <div class="calculator-page" dir="rtl">
    <!-- ───── Navbar ───── -->
    <nav class="navbar">
      <div class="nav-inner">
        <NuxtLink to="/" class="nav-brand">
          <span class="brand-icon">💳</span>
          <span class="brand-text">سامانه وام</span>
        </NuxtLink>
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">خانه</NuxtLink>
          <NuxtLink to="/calculator" class="nav-link active">محاسبه‌گر وام</NuxtLink>
        </div>
        <NuxtLink to="/RegisterWizard" class="nav-cta">شروع ثبت‌نام</NuxtLink>
      </div>
    </nav>

    <!-- ───── Hero ───── -->
    <section class="hero-section">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">
            <Badge variant="info-soft" class="badge-fix">
              <CalculatorIcon class="size-3" />
              محاسبه‌گر عمومی وام
            </Badge>
          </div>
          <h1 class="hero-title">محاسبه قسط وام، آنلاین و رایگان</h1>
          <p class="hero-description">
            بدون ثبت‌نام و احراز هویت؛ طرح وام را انتخاب کنید، مبلغ و مدت را با اسلایدر
            تغییر دهید و قسط ماهانه را لحظه‌ای ببینید.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value">{{ productList.length }}</span>
              <span class="stat-label">طرح وام</span>
            </div>
            <div class="stat-divider" />
            <div class="stat-item">
              <span class="stat-value">لحظه‌ای</span>
              <span class="stat-label">محاسبه</span>
            </div>
            <div class="stat-divider" />
            <div class="stat-item">
              <span class="stat-value">بدون</span>
              <span class="stat-label">ثبت‌نام</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-title">پیش‌نمایش زنده</span>
              <Badge variant="success-soft">{{ selectedProduct.title }}</Badge>
            </div>
            <div class="preview-body">
              <div class="preview-hero">
                <span class="preview-label">قسط ماهانه</span>
                <span class="preview-main">{{ formatAmount(calculation.monthlyInstallment) }}</span>
              </div>
              <div class="preview-row">
                <span>کل پرداختی</span>
                <span class="preview-value">{{ formatAmount(calculation.totalPayment) }}</span>
              </div>
              <div class="preview-row">
                <span>سود کل</span>
                <span class="preview-value">{{ formatAmount(calculation.totalInterest) }}</span>
              </div>
              <div class="preview-row">
                <span>مدت</span>
                <span class="preview-value">{{ durationMonths }} ماه • {{ interestRate }}٪ سالانه</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ───── Calculator ───── -->
    <section class="calculator-section">
      <div class="calculator-grid">
        <div class="calculator-form">
          <h2 class="section-title">تنظیمات وام</h2>

          <div class="form-group">
            <Label class="group-label">نوع وام</Label>
            <div class="product-selector">
              <button
                v-for="p in productList"
                :key="p.id"
                type="button"
                :class="['product-btn', { active: selectedProductId === p.id }]"
                @click="handleProductChange(p.id)"
              >
                <span class="product-check" v-if="selectedProductId === p.id">
                  <CheckIcon class="size-3" />
                </span>
                <span class="product-btn-title">{{ p.title }}</span>
                <span class="product-btn-desc">{{ p.desc }}</span>
                <span class="product-rate">
                  <TrendingUpIcon class="size-3" />
                  {{ p.interestRate }}٪ سالانه
                </span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <Label class="group-label">مبلغ وام</Label>
            <div class="slider-value">{{ formatAmount(amount) }}</div>
            <div class="slider-wrap" dir="ltr">
              <Slider
                :model-value="[amount]"
                :min="minAmount"
                :max="maxAmount"
                :step="1000000"
                @update:model-value="handleAmountChange"
              />
            </div>
            <div class="slider-caps">
              <span>{{ formatAmount(minAmount) }}</span>
              <span>{{ formatAmount(maxAmount) }}</span>
            </div>
            <div class="chips">
              <button
                v-for="q in QUICK_AMOUNTS"
                :key="q"
                type="button"
                :class="['chip', { active: amount === clamp(q, minAmount, maxAmount) && amount === q }]"
                @click="amount = clamp(q, minAmount, maxAmount)"
              >
                {{ formatAmount(q).replace(' تومان', '') }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <Label class="group-label">مدت بازپرداخت</Label>
            <div class="slider-value">{{ durationMonths }} ماه</div>
            <div class="slider-wrap" dir="ltr">
              <Slider
                :model-value="[durationMonths]"
                :min="minDuration"
                :max="maxDuration"
                :step="1"
                @update:model-value="handleDurationChange"
              />
            </div>
            <div class="slider-caps">
              <span>{{ minDuration }} ماه</span>
              <span>{{ maxDuration }} ماه</span>
            </div>
            <div class="chips">
              <button
                v-for="d in QUICK_DURATIONS"
                :key="d"
                type="button"
                :class="['chip', { active: durationMonths === d }]"
                :disabled="d < minDuration || d > maxDuration"
                @click="durationMonths = clamp(d, minDuration, maxDuration)"
              >
                {{ d }} ماهه
              </button>
            </div>
          </div>
        </div>

        <div class="calculator-results">
          <h2 class="section-title">نتیجه محاسبه</h2>
          <div class="results-card">
            <div class="result-item primary">
              <div class="result-icon">
                <CreditCardIcon class="size-5" />
              </div>
              <div class="result-content">
                <span class="result-label">قسط ماهانه</span>
                <span class="result-value">{{ formatAmount(calculation.monthlyInstallment) }}</span>
              </div>
            </div>

            <div class="result-divider" />

            <div class="result-item">
              <div class="result-icon">
                <CalculatorIcon class="size-5" />
              </div>
              <div class="result-content">
                <span class="result-label">کل مبلغ پرداختی</span>
                <span class="result-value">{{ formatAmount(calculation.totalPayment) }}</span>
              </div>
            </div>

            <div class="result-divider" />

            <div class="result-item">
              <div class="result-icon">
                <TrendingUpIcon class="size-5" />
              </div>
              <div class="result-content">
                <span class="result-label">سود کل وام</span>
                <span class="result-value">{{ formatAmount(calculation.totalInterest) }}</span>
              </div>
            </div>

            <div class="result-divider" />

            <div class="result-item">
              <div class="result-icon">
                <ClockIcon class="size-5" />
              </div>
              <div class="result-content">
                <span class="result-label">مدت بازپرداخت</span>
                <span class="result-value">{{ durationMonths }} ماه</span>
              </div>
            </div>

            <NuxtLink to="/RegisterWizard" class="results-cta">
              <Button class="w-full">
                ثبت‌نام و درخواست این وام
                <ArrowLeftIcon class="size-4" />
              </Button>
            </NuxtLink>
            <p class="results-note">محاسبه تقریبی است و مبلغ نهایی پس از بررسی اعلام می‌شود.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ───── Info ───── -->
    <section class="info-section">
      <div class="info-grid">
        <div class="info-card">
          <div class="info-icon">
            <ShieldCheckIcon class="size-6" />
          </div>
          <h3>بدون هزینه مخفی</h3>
          <p>تمام مبالغ شامل سود و کارمزدهای بانکی به‌صورت شفاف نمایش داده می‌شوند.</p>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <ZapIcon class="size-6" />
          </div>
          <h3>محاسبه لحظه‌ای</h3>
          <p>با هر تغییر در مبلغ یا مدت، نتیجه بلافاصله و بدون نیاز به اینترنت اضافه به‌روز می‌شود.</p>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <CalculatorIcon class="size-6" />
          </div>
          <h3>بدون ثبت‌نام</h3>
          <p>برای محاسبه نیازی به احراز هویت یا وارد کردن شماره موبایل ندارید.</p>
        </div>
      </div>
    </section>

    <!-- ───── CTA ───── -->
    <section class="cta-section">
      <h2>آماده‌اید برای درخواست وام؟</h2>
      <p>ثبت‌نام کنید، طرح مناسب را انتخاب کنید و نتیجه را پیگیری کنید.</p>
      <NuxtLink to="/RegisterWizard" class="cta-link">
        <Button size="lg" class="cta-btn">
          ثبت‌نام رایگان و درخواست وام
          <ArrowLeftIcon class="size-4" />
        </Button>
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.calculator-page {
  @apply min-h-screen bg-white text-gray-900;
}

/* ── Navbar (هماهنگ با لندینگ) ── */
.navbar {
  @apply sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur;
}
.nav-inner {
  @apply mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3;
}
.nav-brand {
  @apply flex items-center gap-2 no-underline;
}
.brand-icon { @apply text-2xl; }
.brand-text { @apply text-lg font-bold text-gray-900; }
.nav-links {
  @apply hidden items-center gap-6 sm:flex;
}
.nav-link {
  @apply text-sm text-gray-500 no-underline transition-colors hover:text-gray-900;
}
.nav-link.active { @apply font-semibold text-blue-600; }
.nav-cta {
  @apply rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-blue-700;
}

/* ── Hero ── */
.hero-section {
  @apply border-b border-gray-100 bg-gradient-to-b from-blue-50/60 to-white;
}
.hero-inner {
  @apply mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:py-16 lg:grid-cols-2 lg:py-20;
}
.hero-badge { @apply mb-5; }
.badge-fix { @apply inline-flex items-center gap-1.5; }
.hero-title {
  @apply mb-4 text-3xl font-extrabold leading-[1.4] md:text-4xl lg:text-[2.75rem];
}
.hero-description {
  @apply mb-8 max-w-xl text-base leading-8 text-gray-600 md:text-lg;
}
.hero-stats {
  @apply flex items-center gap-5 sm:gap-7;
}
.stat-item {
  @apply flex flex-col items-center gap-1;
}
.stat-value {
  @apply text-2xl font-extrabold text-blue-600 md:text-3xl;
}
.stat-label { @apply text-xs text-gray-500 md:text-sm; }
.stat-divider { @apply h-9 w-px bg-gray-200; }

.hero-visual { @apply w-full; }
.preview-card {
  @apply mx-auto w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(37,99,235,0.35)];
}
.preview-header {
  @apply mb-4 flex items-center justify-between border-b border-gray-100 pb-3;
}
.preview-title { @apply text-sm font-medium text-gray-500; }
.preview-body { @apply space-y-3; }
.preview-hero {
  @apply flex flex-col gap-1 rounded-xl bg-blue-50 p-4 text-center;
}
.preview-label { @apply text-xs text-blue-700; }
.preview-main { @apply text-2xl font-extrabold text-blue-700; }
.preview-row {
  @apply flex items-center justify-between gap-2 text-sm text-gray-600;
}
.preview-value { @apply font-semibold text-gray-900; }

/* ── Calculator ── */
.calculator-section {
  @apply bg-gray-50 py-12 md:py-16;
}
.calculator-grid {
  @apply mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[1fr_400px] lg:items-start;
}
.calculator-form {
  @apply rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8;
}
.section-title {
  @apply mb-6 text-lg font-bold md:text-xl;
}
.form-group { @apply mb-8; }
.form-group:last-of-type { @apply mb-0; }
.group-label { @apply mb-3 block text-sm font-semibold; }

.product-selector {
  @apply grid gap-3 sm:grid-cols-3;
}
.product-btn {
  @apply relative flex flex-col items-start gap-1 rounded-xl border-2 border-gray-200 bg-white p-4 text-right transition-all duration-200 hover:border-blue-300;
}
.product-btn.active {
  @apply border-blue-500 bg-blue-50/60;
}
.product-check {
  @apply absolute -top-2.5 -left-2.5 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow;
}
.product-btn-title { @apply text-sm font-bold; }
.product-btn-desc { @apply text-xs text-gray-500; }
.product-rate {
  @apply mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-700;
}

.slider-value {
  @apply mb-3 text-lg font-extrabold text-blue-700;
}
.slider-wrap {
  @apply px-1 py-2;
}
.slider-wrap :deep([data-slot="slider"]) {
  @apply w-full;
}
.slider-wrap :deep([data-slot="slider-track"]) {
  @apply h-2;
}
.slider-wrap :deep([data-slot="slider-range"]) {
  @apply bg-blue-600;
}
.slider-wrap :deep([data-slot="slider-thumb"]) {
  @apply size-5 cursor-grab border-2 border-blue-600 bg-white shadow-md active:cursor-grabbing;
}
.slider-caps {
  @apply mt-1 flex items-center justify-between text-xs text-gray-400;
}
.chips {
  @apply mt-3 flex flex-wrap gap-2;
}
.chip {
  @apply rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40;
}
.chip.active {
  @apply border-blue-600 bg-blue-600 font-semibold text-white hover:text-white;
}

/* ── Results ── */
.calculator-results { @apply w-full lg:sticky lg:top-20; }
.results-card {
  @apply rounded-2xl border border-gray-100 bg-white p-6 shadow-sm;
}
.result-item {
  @apply flex items-center gap-4;
}
.result-item.primary .result-value {
  @apply text-xl font-extrabold text-blue-700 md:text-2xl;
}
.result-icon {
  @apply flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600;
}
.result-content {
  @apply flex min-w-0 flex-1 flex-col gap-0.5;
}
.result-label { @apply text-xs text-gray-500 md:text-sm; }
.result-value { @apply truncate text-base font-bold md:text-lg; }
.result-divider { @apply my-4 border-t border-gray-100; }
.results-cta {
  @apply mt-6 block no-underline;
}
.results-note { @apply mt-3 text-center text-xs leading-5 text-gray-400; }

/* ── Info ── */
.info-section {
  @apply bg-white py-12 md:py-16;
}
.info-grid {
  @apply mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3;
}
.info-card {
  @apply rounded-2xl bg-gray-50 p-6 text-center;
}
.info-icon {
  @apply mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600;
}
.info-card h3 {
  @apply mb-2 text-base font-bold;
}
.info-card p {
  @apply text-sm leading-6 text-gray-600;
}

/* ── CTA ── */
.cta-section {
  @apply bg-blue-600 px-4 py-14 text-center md:py-16;
}
.cta-section h2 {
  @apply mb-3 text-2xl font-extrabold text-white md:text-3xl;
}
.cta-section p {
  @apply mx-auto mb-7 max-w-xl text-blue-100;
}
.cta-link { @apply no-underline; }
.cta-btn { @apply bg-white font-bold text-blue-700 hover:bg-blue-50 hover:text-blue-800; }

@media (max-width: 640px) {
  .hero-title { @apply text-2xl; }
  .hero-stats { @apply gap-4; }
  .product-selector { @apply grid-cols-1; }
}
</style>
