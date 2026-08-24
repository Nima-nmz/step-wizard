<script setup lang="ts">
import { ref } from 'vue'
import type { LoanDocument } from '~/types/loan'

defineProps<{ documents: LoanDocument[]; uploading: boolean; error: string }>()
const emit = defineEmits<{ upload: [file: File]; remove: [id: number] }>()

const dragActive = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    emit('upload', input.files[0])
    input.value = ''
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  dragActive.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) emit('upload', file)
}
</script>

<template>
  <div class="doc-upload">
    <div
      class="dropzone"
      :class="{ 'drag-active': dragActive, 'has-error': error }"
      @dragover.prevent="dragActive = true"
      @dragleave.prevent="dragActive = false"
      @drop="handleDrop"
      @click="triggerFileInput"
    >
      <input ref="fileInput" type="file" hidden @change="handleFileSelect" />
      <span v-if="uploading" class="spinner" />
      <template v-else>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>مدارک ضمانت رو اینجا رها کن یا کلیک کن</p>
      </template>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="documents.length" class="doc-list">
      <li v-for="doc in documents" :key="doc.id" class="doc-item">
        <span class="doc-name">{{ doc.name }}</span>
        <button type="button" class="doc-remove" @click="emit('remove', doc.id)">حذف</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.dropzone {
  @apply flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-gray-300 p-7 text-center text-gray-500 cursor-pointer transition-[border-color,background-color] duration-200;
}
.dropzone:hover { @apply border-gray-400; }
.dropzone.drag-active { @apply border-blue-500 bg-blue-50; }
.dropzone.has-error { @apply border-red-500 bg-red-50; }
.dropzone p { @apply text-[0.85rem]; }
.spinner {
  @apply h-[22px] w-[22px] rounded-full border-[3px] border-gray-200 border-t-blue-500;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error {
  @apply mt-2 text-[0.8rem] text-red-500;
}
.doc-list {
  @apply mt-3 flex flex-col gap-2 list-none m-0 p-0;
}
.doc-item {
  @apply flex items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-[0.85rem] text-gray-700;
}
.doc-remove {
  @apply border-none bg-transparent text-[0.8rem] text-red-500 cursor-pointer;
}
.doc-remove:hover { @apply underline; }
</style>
