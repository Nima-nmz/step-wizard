<script setup lang="ts">
withDefaults(defineProps<{
  loading?: boolean
  disabled?: boolean
  loadingText?: string
  variant?: 'primary' | 'success' | 'danger' | 'neutral' | 'cancel'
  size?: 'normal' | 'sm'
}>(), {
  loading: false,
  disabled: false,
  variant: 'primary',
  size: 'normal',
})
</script>

<template>
  <button
    class="loading-btn"
    :class="[`variant-${variant}`, `size-${size}`, { 'is-loading': loading }]"
    :disabled="loading || disabled"
  >
    <span v-if="loading" class="btn-spinner" />
    <slot />
  </button>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.loading-btn {
  @apply flex w-full items-center justify-center gap-2 rounded-lg border-none p-[0.85rem] text-[0.95rem] font-medium cursor-pointer transition-colors duration-200;
}
.loading-btn:disabled { @apply cursor-not-allowed opacity-60; }

.variant-primary { @apply bg-blue-500 text-white; }
.variant-primary:hover:not(:disabled) { @apply bg-blue-600; }

.variant-success { @apply bg-green-500 text-white; }
.variant-success:hover:not(:disabled) { @apply bg-green-600; }

.variant-danger { @apply bg-red-500 text-white; }
.variant-danger:hover:not(:disabled) { @apply bg-red-600; }

.variant-cancel { @apply bg-red-50 text-red-600 border border-red-200; }
.variant-cancel:hover:not(:disabled) { @apply bg-red-100; }

.variant-neutral { @apply bg-gray-100 text-gray-700; }
.variant-neutral:hover:not(:disabled) { @apply bg-gray-200; }

.size-sm {
  @apply p-2 text-[0.85rem];
}

.btn-spinner {
  @apply h-[14px] w-[14px] rounded-full border-2 border-white/40 border-t-white;
  animation: spin 0.7s linear infinite;
}
.variant-neutral .btn-spinner,
.variant-cancel .btn-spinner {
  @apply border-gray-300 border-t-gray-700;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
