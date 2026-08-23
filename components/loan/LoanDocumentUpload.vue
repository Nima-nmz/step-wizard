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
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.75rem 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.dropzone:hover { border-color: #9ca3af; }
.dropzone.drag-active { border-color: #3b82f6; background: #eff6ff; }
.dropzone.has-error { border-color: #ef4444; background: #fef2f2; }
.dropzone p { margin: 0; font-size: 0.85rem; }

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error {
  color: #ef4444;
  font-size: 0.8rem;
  margin: 0.5rem 0 0;
}

.doc-list {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.doc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.9rem;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #374151;
}

.doc-remove {
  border: none;
  background: none;
  color: #ef4444;
  font-size: 0.8rem;
  cursor: pointer;
}
.doc-remove:hover { text-decoration: underline; }
</style>