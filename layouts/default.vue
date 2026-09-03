<script setup lang="ts">
import { useWizardStore } from '~/stores/wizardStore'

const store = useWizardStore()
const router = useRouter()

function handleLogout() {
  store.clearStore()
  router.push('/')
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <NuxtLink to="/" class="brand">
          <span class="brand-icon">💳</span>
          <span class="brand-text">سامانه وام</span>
        </NuxtLink>

        <nav v-if="store.isAuthenticated" class="main-nav">
          <NuxtLink v-if="!store.isAdmin" to="/loans" class="nav-link">وام‌های من</NuxtLink>
          <NuxtLink v-if="!store.isAdmin" to="/loans/new" class="nav-link">درخواست جدید</NuxtLink>
          <NuxtLink v-if="store.isAdmin" to="/admin" class="nav-link">پنل ادمین</NuxtLink>
        </nav>

        <div class="header-actions">
          <button v-if="store.isAuthenticated" class="logout-btn" @click="handleLogout">
            خروج
          </button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="main-inner">
        <slot />
      </div>
    </main>

    <footer class="app-footer">
      <p>© {{ new Date().getFullYear() }} سامانه وام. تمامی حقوق محفوظ است.</p>
    </footer>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.app-shell {
  @apply flex min-h-screen flex-col bg-white;
}

/* ---------- Header ---------- */
.app-header {
  @apply sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur;
}
.header-inner {
  @apply mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6;
}
.brand {
  @apply flex shrink-0 items-center gap-2 text-gray-900 no-underline;
}
.brand-icon {
  @apply text-xl leading-none;
}
.brand-text {
  @apply text-[1.05rem] font-bold;
}

.main-nav {
  @apply hidden items-center gap-1 sm:flex;
}
.nav-link {
  @apply rounded-lg px-3 py-2 text-[0.875rem] font-medium text-gray-600 no-underline transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900;
}
.nav-link.router-link-active {
  @apply bg-blue-50 text-blue-900;
}

.header-actions {
  @apply flex shrink-0 items-center gap-2;
}
.logout-btn {
  @apply rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[0.8rem] font-medium text-gray-600 cursor-pointer transition-colors duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600;
}

/* ---------- Main ---------- */
.app-main {
  @apply flex-1;
}
.main-inner {
  @apply mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8;
}

/* ---------- Footer ---------- */
.app-footer {
  @apply border-t border-gray-100 bg-white py-5 text-center;
}
.app-footer p {
  @apply text-[0.8rem] text-gray-400;
}

/* موبایل: منو رو زیر هدر به‌صورت اسکرول افقی نشون بده */
@media (max-width: 639px) {
  .main-nav {
    @apply order-3 flex w-full basis-full gap-1 overflow-x-auto pt-2;
  }
  .header-inner {
    @apply flex-wrap;
  }
}
</style>