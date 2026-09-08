<template>
  <div class="landing-shell">
    <slot />
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.landing-shell {
  @apply flex min-h-screen flex-col bg-white;
}

.landing-shell > :first-child {
  @apply flex-1;
}
</style>
