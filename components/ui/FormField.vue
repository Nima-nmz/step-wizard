<script setup lang="ts">
import { Label } from '@/components/ui/label'

defineProps<{
  label?: string
  error?: string
}>()
</script>

<template>
  <div class="form-row">
    <Label class="mb-3" v-if="label">{{ label }}</Label>
    <slot />
    <span v-if="error" class="field-error">{{ error }}</span>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.form-row { @apply mb-4; }
:deep(input) {
  @apply w-full rounded-lg border-[1.5px] border-gray-300 bg-white px-3 py-2.5 text-[0.9rem] font-[inherit] box-border transition-[border-color,box-shadow] duration-200;
}
:deep(input:focus) {
  @apply border-blue-500 outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.15)];
}
:deep(input.has-error) {
  @apply border-red-500;
}
.field-error {
  @apply mt-1.5 block text-[0.75rem] text-red-500;
}
</style>
