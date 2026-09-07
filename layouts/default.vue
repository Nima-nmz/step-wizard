<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useWizardStore } from '~/stores/wizardStore'
import { getUserProfile } from '~/services/useUser.service'
import type { UserProfile } from '~/types/user'
import { Button } from '@/components/ui/button'
import {
  UserIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  CreditCardIcon,
  ChevronDownIcon,
} from 'lucide-vue-next'

const store = useWizardStore()
const router = useRouter()

const profile = ref<UserProfile | null>(null)
const showProfileMenu = ref(false)
const profileLoading = ref(false)

const initials = computed(() => {
  if (!profile.value) return 'ک'
  const f = profile.value.firstName?.[0] || ''
  const l = profile.value.lastName?.[0] || ''
  return (f + l) || 'ک'
})

const displayName = computed(() => {
  if (!profile.value) return ''
  return `${profile.value.firstName} ${profile.value.lastName}`.trim()
})

function handleLogout() {
  store.clearStore()
  profile.value = null
  showProfileMenu.value = false
  router.push('/')
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function closeMenu() {
  showProfileMenu.value = false
}

async function fetchProfile() {
  if (!store.isAuthenticated) return
  profileLoading.value = true
  try {
    profile.value = await getUserProfile()
  } catch {
  } finally {
    profileLoading.value = false
  }
}

onMounted(fetchProfile)

watch(() => store.isAuthenticated, (val) => {
  if (val) fetchProfile()
  else profile.value = null
})
</script>

<template>
  <div class="app-shell" @click="closeMenu">
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
          <template v-if="store.isAuthenticated">
            <div class="profile-menu-wrapper" @click.stop>
              <Button class="profile-trigger" @click="toggleProfileMenu">
                <div v-if="profile?.avatarUrl" class="avatar-sm">
                  <img :src="profile.avatarUrl" :alt="displayName" />
                </div>
                <div v-else class="avatar-sm avatar-placeholder-sm">
                  {{ initials }}
                </div>
                <ChevronDownIcon class="size-4 text-gray-400" :class="{ 'rotate-180': showProfileMenu }" />
              </Button>

              <Transition name="menu">
                <div v-if="showProfileMenu" class="profile-dropdown" @click.stop>
                  <div class="dropdown-header">
                    <div v-if="profile?.avatarUrl" class="avatar-md">
                      <img :src="profile.avatarUrl" :alt="displayName" />
                    </div>
                    <div v-else class="avatar-md avatar-placeholder-md">
                      {{ initials }}
                    </div>
                    <div class="dropdown-user-info">
                      <span class="dropdown-name">{{ displayName || 'کاربر' }}</span>
                      <span class="dropdown-phone ltr">{{ profile?.phoneNumber }}</span>
                    </div>
                  </div>

                  <div class="dropdown-divider" />

                  <NuxtLink to="/dashboard" class="dropdown-item" @click="closeMenu">
                    <LayoutDashboardIcon class="size-4" />
                    داشبورد
                  </NuxtLink>
                  <NuxtLink v-if="!store.isAdmin" to="/loans" class="dropdown-item" @click="closeMenu">
                    <CreditCardIcon class="size-4" />
                    وام‌های من
                  </NuxtLink>

                  <div class="dropdown-divider" />

                  <Button class="dropdown-item dropdown-item-danger" @click="handleLogout">
                    <LogOutIcon class="size-4" />
                    خروج از حساب
                  </Button>
                </div>
              </Transition>
            </div>
          </template>

          <Button v-else class="logout-btn" @click="router.push('/')">
            ورود
          </Button>
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

/* ---------- Profile Menu ---------- */
.profile-menu-wrapper {
  @apply relative;
}
.profile-trigger {
  @apply flex items-center gap-2 rounded-lg p-1 transition-colors duration-150 hover:bg-gray-100 cursor-pointer border-none bg-transparent;
}
.profile-trigger svg {
  transition: transform 0.2s;
}
.avatar-sm {
  @apply h-8 w-8 overflow-hidden rounded-full;
}
.avatar-sm img {
  @apply h-full w-full object-cover;
}
.avatar-placeholder-sm {
  @apply flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white;
}

.profile-dropdown {
  @apply absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg;
}
.dropdown-header {
  @apply flex items-center gap-3 px-4 py-3;
}
.avatar-md {
  @apply h-11 w-11 shrink-0 overflow-hidden rounded-full;
}
.avatar-md img {
  @apply h-full w-full object-cover;
}
.avatar-placeholder-md {
  @apply flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white;
}
.dropdown-user-info {
  @apply flex flex-col min-w-0;
}
.dropdown-name {
  @apply text-sm font-semibold text-gray-900 truncate;
}
.dropdown-phone {
  @apply text-xs text-gray-500;
}

.dropdown-divider {
  @apply h-px bg-gray-100 mx-3;
}

.dropdown-item {
  @apply flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 no-underline transition-colors duration-150 hover:bg-gray-50 cursor-pointer border-none bg-transparent w-full text-right;
}
.dropdown-item-danger {
  @apply text-red-600 hover:bg-red-50;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
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

@media (max-width: 639px) {
  .main-nav {
    @apply order-3 flex w-full basis-full gap-1 overflow-x-auto pt-2;
  }
  .header-inner {
    @apply flex-wrap;
  }
}
</style>
