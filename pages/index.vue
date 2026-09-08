<script setup lang="ts">
definePageMeta({ layout: 'landing' })

const features = [
  {
    icon: '⚡',
    title: 'سریع و آسان',
    desc: 'ثبت‌نام در کمتر از ۳ دقیقه با احراز هویت آنلاین',
  },
  {
    icon: '🔒',
    title: 'امن و مطمئن',
    desc: 'اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود',
  },
  {
    icon: '📊',
    title: 'شفافیت کامل',
    desc: 'مشاهده جزئیات وام، سود و اقساط بدون هیچ هزینه پنهان',
  },
  {
    icon: '🏦',
    title: 'چندین طرح وام',
    desc: 'انتخاب از بین طرح‌های متنوع با سودهای رقابتی',
  },
  {
    icon: '📱',
    title: 'مدیریت آنلاین',
    desc: 'پیگیری وضعیت درخواست و مدیریت اقساط در هر زمان',
  },
  {
    icon: '🎯',
    title: 'بدون مراجعه حضوری',
    desc: 'تمام مراحل از ثبت‌نام تا دریافت وام به صورت غیرحضوری',
  },
]

const stats = [
  { value: '+۱۲,۰۰۰', label: 'کاربر فعال' },
  { value: '+۵۰۰', label: 'وام تأیید شده' },
  { value: '%۹۸', label: 'رضایت کاربران' },
  { value: '۲۴ ساعته', label: 'پشتیبانی' },
]

const steps = [
  { num: '۱', title: 'ثبت‌نام', desc: 'شماره موبایل و اطلاعات شخصی خود را وارد کنید' },
  { num: '۲', title: 'انتخاب طرح', desc: 'طرح وام مناسب نیاز خود را انتخاب کنید' },
  { num: '۳', title: 'ارسال مدارک', desc: 'مدارک مورد نیاز را آپلود کنید' },
  { num: '۴', title: 'دریافت وام', desc: 'پس از تأیید، وام به حساب شما واریز می‌شود' },
]
</script>

<template>
  <div class="landing">
    <!-- ───── Navbar ───── -->
    <nav class="navbar">
      <div class="nav-inner">
        <div class="nav-brand">
          <span class="brand-icon">💳</span>
          <span class="brand-text">سامانه وام</span>
        </div>
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link active">خانه</NuxtLink>
          <NuxtLink to="/calculator" class="nav-link">محاسبه‌گر وام</NuxtLink>
        </div>
        <NuxtLink to="/RegisterWizard" class="nav-cta">شروع ثبت‌نام</NuxtLink>
      </div>
    </nav>

    <!-- ───── Hero ───── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="orb orb-1" />
        <div class="orb orb-2" />
        <div class="orb orb-3" />
        <div class="grid-pattern" />
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot" />
          سامانه جدید دریافت وام
        </div>

        <h1 class="hero-title">
          دریافت وام
          <span class="hero-highlight">سریع، ساده و مطمئن</span>
        </h1>

        <p class="hero-desc">
          با سامانه وام، فرآیند دریافت وام را به صورت کاملاً آنلاین و بدون مراجعه حضوری
          تجربه کنید. ثبت‌نام کنید، طرح مورد نظرتان را انتخاب کنید و وام بگیرید.
        </p>

        <div class="hero-actions">
          <NuxtLink to="/RegisterWizard" class="btn-primary-hero">
            همین حالا شروع کنید
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <a href="#features" class="btn-secondary-hero">
            بیشتر بدانید
          </a>
        </div>

        <div class="hero-trust">
          <div class="trust-avatars">
            <div class="trust-avatar" v-for="i in 4" :key="i" :style="{ '--i': i }">
              {{ ['ع', 'م', 'ن', 'ف'][i - 1] }}
            </div>
          </div>
          <span class="trust-text">
            <strong>۲,۴۵۰+</strong> کاربر در حال استفاده
          </span>
        </div>
      </div>

      <!-- Mock UI Card -->
      <div class="hero-visual">
        <div class="mock-card">
          <div class="mock-header">
            <div class="mock-dots">
              <span /><span /><span />
            </div>
            <span class="mock-title">پنل کاربری</span>
          </div>
          <div class="mock-body">
            <div class="mock-row">
              <div class="mock-label">مبلغ وام</div>
              <div class="mock-value">۵۰,۰۰۰,۰۰۰ تومان</div>
            </div>
            <div class="mock-row">
              <div class="mock-label">نرخ سود</div>
              <div class="mock-value mock-blue">٪۱۸ سالانه</div>
            </div>
            <div class="mock-row">
              <div class="mock-label">اقساط ماهانه</div>
              <div class="mock-value">۴,۸۷۲,۰۰۰ تومان</div>
            </div>
            <div class="mock-progress">
              <div class="mock-progress-bar" />
            </div>
            <div class="mock-status">
              <span class="mock-status-dot" />
              وضعیت: در حال بررسی
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ───── Stats ───── -->
    <section class="stats-section">
      <div class="stats-inner">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- ───── Features ───── -->
    <section id="features" class="features-section">
      <div class="features-inner">
        <div class="section-header">
          <span class="section-tag">امکانات</span>
          <h2 class="section-title">چرا سامانه وام؟</h2>
          <p class="section-desc">تجربيه‌ای متفاوت از دریافت وام با امکاناتی که نیاز دارید</p>
        </div>

        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ───── Steps ───── -->
    <section class="steps-section">
      <div class="steps-inner">
        <div class="section-header">
          <span class="section-tag">مراحل</span>
          <h2 class="section-title">ساده مثل ۱، ۲، ۳، ۴</h2>
          <p class="section-desc">فقط ۴ مرحله ساده تا دریافت وام</p>
        </div>

        <div class="steps-grid">
          <div v-for="s in steps" :key="s.num" class="step-card">
            <div class="step-num">{{ s.num }}</div>
            <h3 class="step-title">{{ s.title }}</h3>
            <p class="step-desc">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ───── CTA ───── -->
    <section class="cta-section">
      <div class="cta-inner">
        <div class="cta-bg">
          <div class="cta-orb cta-orb-1" />
          <div class="cta-orb cta-orb-2" />
        </div>
        <div class="cta-content">
          <h2 class="cta-title">آماده‌اید وام بگیرید؟</h2>
          <p class="cta-desc">
            همین الان ثبت‌نام کنید و در کمتر از ۳ دقیقه درخواست وام خود را ثبت نمایید.
          </p>
          <NuxtLink to="/RegisterWizard" class="btn-cta">
            ثبت‌نام رایگان
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ───── Footer ───── -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <p class="footer-copy">© {{ new Date().getFullYear() }} سامانه وام. تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.landing {
  @apply flex flex-1 flex-col overflow-x-hidden;
}

/* ════════════════════════════════════════════
   Navbar
   ════════════════════════════════════════════ */
.navbar {
  @apply fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl;
}
.nav-inner {
  @apply mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8;
}
.nav-brand {
  @apply flex items-center gap-2.5;
}
.brand-icon {
  @apply text-xl;
}
.brand-text {
  @apply text-[1.05rem] font-bold text-gray-900;
}
.nav-cta {
  @apply rounded-full bg-blue-600 px-5 py-2 text-[0.85rem] font-semibold text-white no-underline transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200;
}
.nav-links {
  @apply hidden items-center gap-6 sm:flex;
}
.nav-link {
  @apply text-sm text-gray-500 no-underline transition-colors hover:text-gray-900;
}
.nav-link.active { @apply font-semibold text-blue-600 ; }

/* ════════════════════════════════════════════
   Hero
   ════════════════════════════════════════════ */
.hero {
  @apply relative flex min-h-screen items-center pt-20 pb-16;
}
.hero-bg {
  @apply pointer-events-none absolute inset-0 overflow-hidden;
}
.orb {
  @apply absolute rounded-full blur-[120px];
  animation: float 8s ease-in-out infinite;
}
.orb-1 {
  @apply -top-32 -right-32 h-[500px] w-[500px] bg-blue-200/60;
  animation-delay: 0s;
}
.orb-2 {
  @apply top-1/2 -left-40 h-[400px] w-[400px] bg-blue-300/40;
  animation-delay: 2s;
}
.orb-3 {
  @apply -bottom-20 right-1/3 h-[350px] w-[350px] bg-indigo-200/50;
  animation-delay: 4s;
}
.grid-pattern {
  @apply absolute inset-0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

.hero-content {
  @apply relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:w-1/2;
}
.hero-badge {
  @apply mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[0.8rem] font-medium text-blue-700;
  animation: fadeUp 0.6s ease-out both;
}
.badge-dot {
  @apply h-2 w-2 rounded-full bg-blue-500;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
}

.hero-title {
  @apply mb-5 text-[2.5rem] font-extrabold leading-tight text-gray-900 sm:text-[3.2rem];
  animation: fadeUp 0.6s ease-out 0.1s both;
}
.hero-highlight {
  @apply bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent;
}

.hero-desc {
  @apply mb-8 max-w-lg text-[1.05rem] leading-relaxed text-gray-500 sm:text-[1.1rem];
  animation: fadeUp 0.6s ease-out 0.2s both;
}

.hero-actions {
  @apply flex flex-wrap items-center gap-4;
  animation: fadeUp 0.6s ease-out 0.3s both;
}
.btn-primary-hero {
  @apply inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-[0.95rem] font-bold text-white no-underline transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200/60 hover:-translate-y-0.5;
}
.btn-secondary-hero {
  @apply inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3.5 text-[0.95rem] font-medium text-gray-700 no-underline transition-all duration-300 hover:border-gray-300 hover:bg-gray-50;
}

.hero-trust {
  @apply mt-10 flex items-center gap-3;
  animation: fadeUp 0.6s ease-out 0.4s both;
}
.trust-avatars {
  @apply flex -space-x-3 space-x-reverse;
}
.trust-avatar {
  @apply flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white;
  --i: 0;
  z-index: calc(4 - var(--i));
}
.trust-text {
  @apply text-[0.85rem] text-gray-500;
}
.trust-text strong {
  @apply font-bold text-gray-800;
}

/* Hero Visual */
.hero-visual {
  @apply relative z-10 mt-12 lg:mt-0 lg:w-1/2 lg:pr-16;
  animation: fadeUp 0.8s ease-out 0.3s both;
}
.mock-card {
  @apply mx-auto max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50;
}
.mock-header {
  @apply flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-5 py-3;
}
.mock-dots {
  @apply flex gap-1.5;
}
.mock-dots span {
  @apply h-2.5 w-2.5 rounded-full bg-gray-300;
}
.mock-dots span:first-child { @apply bg-red-400; }
.mock-dots span:nth-child(2) { @apply bg-yellow-400; }
.mock-dots span:last-child { @apply bg-green-400; }
.mock-title {
  @apply text-[0.75rem] font-medium text-gray-500;
}
.mock-body {
  @apply space-y-4 p-5;
}
.mock-row {
  @apply flex items-center justify-between;
}
.mock-label {
  @apply text-[0.8rem] text-gray-400;
}
.mock-value {
  @apply text-[0.9rem] font-semibold text-gray-800;
}
.mock-blue {
  @apply text-blue-600;
}
.mock-progress {
  @apply h-2 overflow-hidden rounded-full bg-gray-100;
}
.mock-progress-bar {
  @apply h-full w-3/5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500;
  animation: progressFill 2s ease-out 1s both;
}
@keyframes progressFill {
  from { width: 0; }
}
.mock-status {
  @apply flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-[0.8rem] font-medium text-blue-700;
}
.mock-status-dot {
  @apply h-2 w-2 rounded-full bg-blue-500;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ════════════════════════════════════════════
   Stats
   ════════════════════════════════════════════ */
.stats-section {
  @apply border-y border-gray-100 bg-gray-50/50 py-16;
}
.stats-inner {
  @apply mx-auto grid max-w-5xl grid-cols-2 gap-8 px-5 sm:grid-cols-4 sm:px-8;
}
.stat-item {
  @apply flex flex-col items-center gap-1 text-center;
}
.stat-value {
  @apply text-[1.8rem] font-extrabold text-blue-600 sm:text-[2.2rem];
}
.stat-label {
  @apply text-[0.85rem] text-gray-500;
}

/* ════════════════════════════════════════════
   Features
   ════════════════════════════════════════════ */
.features-section {
  @apply py-20 sm:py-28;
}
.features-inner {
  @apply mx-auto max-w-6xl px-5 sm:px-8;
}
.section-header {
  @apply mb-14 text-center;
}
.section-tag {
  @apply mb-3 inline-block rounded-full bg-blue-50 px-4 py-1 text-[0.75rem] font-semibold uppercase tracking-wider text-blue-600;
}
.section-title {
  @apply mb-3 text-[1.8rem] font-bold text-gray-900 sm:text-[2.2rem];
}
.section-desc {
  @apply mx-auto max-w-md text-[0.95rem] text-gray-500;
}

.features-grid {
  @apply grid gap-5 sm:grid-cols-2 lg:grid-cols-3;
}
.feature-card {
  @apply rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1;
}
.feature-card:hover .feature-icon {
  @apply bg-blue-100;
}
.feature-icon {
  @apply mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl transition-colors duration-300;
}
.feature-title {
  @apply mb-2 text-[1.05rem] font-bold text-gray-900;
}
.feature-desc {
  @apply text-[0.9rem] leading-relaxed text-gray-500;
}

/* ════════════════════════════════════════════
   Steps
   ════════════════════════════════════════════ */
.steps-section {
  @apply bg-gray-50/60 py-20 sm:py-28;
}
.steps-inner {
  @apply mx-auto max-w-5xl px-5 sm:px-8;
}
.steps-grid {
  @apply grid gap-6 sm:grid-cols-2 lg:grid-cols-4;
}
.step-card {
  @apply relative rounded-2xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1;
}
.step-num {
  @apply mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white;
}
.step-title {
  @apply mb-2 text-[1rem] font-bold text-gray-900;
}
.step-desc {
  @apply text-[0.85rem] leading-relaxed text-gray-500;
}

/* ════════════════════════════════════════════
   CTA
   ════════════════════════════════════════════ */
.cta-section {
  @apply py-20 sm:py-28;
}
.cta-inner {
  @apply relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-16 text-center sm:px-16 sm:py-20;
}
.cta-bg {
  @apply pointer-events-none absolute inset-0 overflow-hidden;
}
.cta-orb {
  @apply absolute rounded-full bg-white/10 blur-[80px];
}
.cta-orb-1 {
  @apply -top-20 -right-20 h-[250px] w-[250px];
}
.cta-orb-2 {
  @apply -bottom-20 -left-20 h-[200px] w-[200px];
}
.cta-content {
  @apply relative z-10;
}
.cta-title {
  @apply mb-4 text-[1.8rem] font-extrabold text-white sm:text-[2.2rem];
}
.cta-desc {
  @apply mx-auto mb-8 max-w-md text-[1rem] text-blue-100;
}
.btn-cta {
  @apply inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-[0.95rem] font-bold text-blue-700 no-underline transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5;
}

/* ════════════════════════════════════════════
   Footer
   ════════════════════════════════════════════ */
.landing-footer {
  @apply border-t text-center items-center border-gray-100 bg-white py-6;
}
.footer-inner {
  @apply mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 sm:px-8;
}
.footer-brand {
  @apply flex items-center gap-2 text-[0.95rem] font-bold text-gray-800;
}
.footer-copy {
  @apply text-[0.8rem] text-center text-gray-400;
}

/* ════════════════════════════════════════════
   Responsive
   ════════════════════════════════════════════ */
@media (max-width: 1023px) {
  .hero {
    @apply flex-col text-center;
  }
  .hero-content {
    @apply mx-auto max-w-2xl lg:w-full;
  }
  .hero-actions {
    @apply justify-center;
  }
  .hero-trust {
    @apply justify-center;
  }
  .hero-visual {
    @apply mx-auto mt-12 max-w-sm lg:pr-0;
  }
}

@media (max-width: 639px) {
  .hero-title {
    @apply text-[2rem];
  }
  .stats-inner {
    @apply gap-6;
  }
  .stat-value {
    @apply text-[1.5rem];
  }
}
</style>
