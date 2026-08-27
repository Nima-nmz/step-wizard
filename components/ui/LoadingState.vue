<script setup lang="ts">
withDefaults(defineProps<{
  loading?: boolean
  error?: string
  loadingText?: string
}>(), {
  loading: false,
  error: '',
  loadingText: 'در حال دریافت...',
})

defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="state-box">
    <span class="spinner" />
    {{ loadingText }}
  </div>
  <div v-else-if="error" class="state-box error-box">
    <p>{{ error }}</p>
    <button class="btn-retry" @click="$emit('retry')">تلاش مجدد</button>
  </div>
  <slot v-else />
</template>
