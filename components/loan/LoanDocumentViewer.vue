<script setup lang="ts">
import { ref } from 'vue'
import type { LoanDocument } from '~/types/loan'
import { useLoanFormatter } from '~/composables/useLoanFormatter'

defineProps<{
  documents: LoanDocument[]
}>()

const previewDoc = ref<LoanDocument | null>(null)
const { formatPersianDate, isImageFile } = useLoanFormatter()
</script>

<template>
  <div>
    <ul class="doc-list">
      <li v-for="doc in documents" :key="doc.id">
        <button
          class="doc-item"
          :class="{ 'has-preview': doc.url && doc.url !== '#' }"
          :disabled="!doc.url || doc.url === '#'"
          @click="doc.url && doc.url !== '#' ? previewDoc = doc : null"
        >
          <span class="doc-icon">📄</span>
          <span class="doc-name">{{ doc.name }}</span>
          <span v-if="doc.url && doc.url !== '#'" class="doc-view">مشاهده 👁</span>
          <span class="doc-date">{{ formatPersianDate(doc.uploadedAt) }}</span>
        </button>
      </li>
    </ul>

    <Teleport to="body">
      <div v-if="previewDoc" class="modal-overlay" @click.self="previewDoc = null">
        <div class="modal-box">
          <div class="modal-head">
            <span class="modal-title">{{ previewDoc.name }}</span>
            <button class="modal-close" @click="previewDoc = null">×</button>
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
            <button class="btn-modal-close" @click="previewDoc = null">بستن</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
.doc-list { @apply m-0 flex list-none flex-col gap-2 p-0; }
.doc-list li { @apply list-none; }
.doc-item {
  @apply flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-[0.85rem] text-gray-700 transition-colors duration-200 cursor-default text-right;
}
.doc-item.has-preview { @apply cursor-pointer hover:border-blue-200 hover:bg-blue-50; }
.doc-item:disabled { @apply opacity-60; }
.doc-icon { @apply text-base; }
.doc-name { @apply flex-1 truncate font-medium text-gray-800; }
.doc-view { @apply shrink-0 rounded-md bg-blue-500 px-2 py-0.5 text-[0.7rem] font-medium text-white; }
.doc-date { @apply shrink-0 text-[0.75rem] text-gray-400; }

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
.btn-modal-close { @apply inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-600 cursor-pointer transition-colors hover:bg-gray-50; }
</style>
