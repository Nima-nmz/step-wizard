<template>
  <div class="wizard-shell">
    <header class="wizard-header">
      <NuxtLink to="/" class="brand">
        <span class="brand-icon">💳</span>
        <span class="brand-text">سامانه وام</span>
      </NuxtLink>
    </header>

    <main class="wizard-main">
      <div class="wizard-inner">
        <slot />
      </div>
    </main>

    <footer class="wizard-footer">
      <p>© {{ new Date().getFullYear() }} سامانه وام. تمامی حقوق محفوظ است.</p>
    </footer>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.wizard-shell {
  @apply flex min-h-screen flex-col bg-gray-50;
}

.wizard-header {
  @apply border-b border-gray-100 bg-white/90 backdrop-blur;
}
.brand {
  @apply mx-auto flex max-w-5xl items-center gap-2 px-4 py-3.5 text-gray-900 no-underline sm:px-6;
}
.brand-icon {
  @apply text-xl leading-none;
}
.brand-text {
  @apply text-[1.05rem] font-bold;
}

.wizard-main {
  @apply flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12;
}
.wizard-inner {
  @apply w-full max-w-xl;
}

.wizard-footer {
  @apply border-t border-gray-100 bg-white py-5 text-center;
}
.wizard-footer p {
  @apply text-[0.8rem] text-gray-400;
}
</style>
