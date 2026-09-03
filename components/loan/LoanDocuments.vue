<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LoanDocument } from '~/types/loan'
import { useLoanFormatter } from '~/composables/useLoanFormatter'
import { Button } from '@/components/ui/button'

const props = withDefaults(
  defineProps<{
    documents: LoanDocument[]
    /** 'view' فقط نمایش و پیش‌نمایش | 'manage' آپلود، حذف و پیش‌نمایش */
    mode?: 'view' | 'manage'
    uploading?: boolean
    error?: string
  }>(),
  {
    mode: 'view',
    uploading: false,
    error: '',
  },
)

const emit = defineEmits<{ upload: [file: File]; remove: [id: number] }>()

const { formatPersianDate, isImageFile } = useLoanFormatter()

const previewDoc = ref<LoanDocument | null>(null)
const dragActive = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const canManage = computed(() => props.mode === 'manage')

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

function openPreview(doc: LoanDocument) {
  if (doc.url && doc.url !== '#') {
    previewDoc.value = doc
  }
}
</script>

<template>
  <div class="doc-manager">
    <div
      v-if="canManage"
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

    <p v-if="canManage && error" class="error">{{ error }}</p>

    <ul v-if="documents.length" class="doc-list">
      <li v-for="doc in documents" :key="doc.id">
        <div class="doc-item" :class="{ 'has-preview': doc.url && doc.url !== '#' }">
          <button
            type="button"
            class="doc-main"
            :disabled="!doc.url || doc.url === '#'"
            @click="openPreview(doc)"
          >
            <span class="doc-icon">📄</span>
            <span class="doc-name">{{ doc.name }}</span>
            <span v-if="doc.url && doc.url !== '#'" class="doc-view">مشاهده 👁</span>
            <span class="doc-date">{{ formatPersianDate(doc.uploadedAt) }}</span>
          </button>

          <Button
            v-if="canManage"
            type="button"
            variant="ghost"
            size="sm"
            class="doc-remove"
            @click="emit('remove', doc.id)"
          >
            حذف
          </Button>
        </div>
      </li>
    </ul>

    <Teleport to="body">
      <div v-if="previewDoc" class="modal-overlay" @click.self="previewDoc = null">
        <div class="modal-box">
          <div class="modal-head">
            <span class="modal-title">{{ previewDoc.name }}</span>
            <Button variant="ghost" size="icon" class="modal-close" @click="previewDoc = null">×</Button>
          </div>
          <div class="modal-body">
            <img v-if="isImageFile(previewDoc.name)" :src="previewDoc.url" class="modal-img" />
            <div v-else class="modal-fallback">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p>پیش‌نمایش این نوع فایل ممکن نیست.</p>
            </div>
          </div>
          <div class="modal-foot">
            <a :href="previewDoc.url" target="_blank" rel="noopener" class="btn-open-tab">باز کردن در تب جدید</a>
            <Button variant="outline" @click="previewDoc = null">بستن</Button>
          </div>
        </div>
      </div>
    </Teleport>
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
.error { @apply mt-2 text-[0.8rem] text-red-500; }

.doc-list { @apply mt-3 m-0 flex list-none flex-col gap-2 p-0; }
.doc-item {
  @apply flex w-full items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2 py-1;
}
.doc-item.has-preview { @apply hover:border-blue-200 hover:bg-blue-50; }
.doc-main {
  @apply flex flex-1 items-center gap-3 border-none bg-transparent px-2 py-2 text-[0.85rem] text-gray-700 text-right cursor-default;
}
.doc-main:not(:disabled) { @apply cursor-pointer; }
.doc-main:disabled { @apply opacity-60; }
.doc-icon { @apply text-base; }
.doc-name { @apply flex-1 truncate font-medium text-gray-800; }
.doc-view { @apply shrink-0 rounded-md bg-blue-500 px-2 py-0.5 text-[0.7rem] font-medium text-white; }
.doc-date { @apply shrink-0 text-[0.75rem] text-gray-400; }
.doc-remove { @apply shrink-0 border-none bg-transparent text-[0.8rem] text-red-500 cursor-pointer; }
.doc-remove:hover { @apply underline; }

.modal-overlay { @apply fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4; }
.modal-box { @apply w-full max-w-2xl rounded-xl bg-white shadow-2xl; }
.modal-head { @apply flex items-center justify-between border-b border-gray-100 px-5 py-4; }
.modal-title { @apply truncate text-[0.95rem] font-semibold text-gray-900; }
.modal-close { @apply flex h-8 w-8 items-center justify-center rounded-lg border-none bg-gray-100 text-xl text-gray-500 cursor-pointer transition-colors hover:bg-gray-200 hover:text-gray-700; }
.modal-body { @apply flex items-center justify-center p-5; }
.modal-img { @apply max-h-[70vh] w-auto rounded-lg object-contain; }
.modal-fallback { @apply flex flex-col items-center gap-3 py-10 text-gray-400; }
.modal-fallback p { @apply m-0 text-[0.9rem]; }
.modal-foot { @apply flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4; }
.btn-open-tab { @apply inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-[0.85rem] font-medium text-white no-underline transition-colors hover:bg-blue-600; }
</style>