<script setup lang="ts">
import { ref } from 'vue'
import { useWizardStore } from '~/stores/wizardStore'
import { useImageCompressor } from '~/composables/useImageCompressor'
import { storeToRefs } from 'pinia'

const store = useWizardStore()
const { validationErrors } = storeToRefs(store)
const { compress, error: compressError } = useImageCompressor()

const dragActive = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function clearFile() {
  store.setIdCardFile(null)
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) return

  try {
    const compressed = await compress(file, { maxWidth: 1200, quality: 0.7 })
    store.setIdCardFile(compressed)
  } catch {
    store.setValidationErrors({ national_id_image: 'فشرده‌سازی ناموفق بود' })
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  dragActive.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  dragActive.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  dragActive.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    compress(file).then(store.setIdCardFile)
  }
}
</script>

<template>
  <div class="step-card">
    <h3>مرحله ۲: اطلاعات شخصی و کارت ملی</h3>

    <div class="form-grid">
      <div class="form-group">
        <label>نام</label>
        <input v-model="store.personalInfo.firstName"
          :class="{ 'has-error': validationErrors.first_name }"
          @input="store.updatePersonalInfo('firstName', ($event.target as HTMLInputElement).value)" />
        <span v-if="validationErrors.first_name" class="error">{{ validationErrors.first_name }}</span>
      </div>

      <div class="form-group">
        <label>نام خانوادگی</label>
        <input v-model="store.personalInfo.lastName"
          :class="{ 'has-error': validationErrors.last_name }"
          @input="store.updatePersonalInfo('lastName', ($event.target as HTMLInputElement).value)" />
        <span v-if="validationErrors.last_name" class="error">{{ validationErrors.last_name }}</span>
      </div>

      <div class="form-group">
        <label>کد ملی</label>
        <input v-model="store.personalInfo.nationalId" maxlength="10"
          :class="{ 'has-error': validationErrors.national_id }"
          @input="store.updatePersonalInfo('nationalId', ($event.target as HTMLInputElement).value)" />
        <span v-if="validationErrors.national_id" class="error">{{ validationErrors.national_id }}</span>
      </div>

      <div class="form-group">
        <label>تاریخ تولد</label>
        <input v-model="store.personalInfo.birthDate" type="date"
          :class="{ 'has-error': validationErrors.birth_date }"
          @input="store.updatePersonalInfo('birthDate', ($event.target as HTMLInputElement).value)" />
        <span v-if="validationErrors.birth_date" class="error">{{ validationErrors.birth_date }}</span>
      </div>

      <div class="form-group full-width">
        <label>ایمیل (اختیاری)</label>
        <input v-model="store.personalInfo.email" type="email"
          @input="store.updatePersonalInfo('email', ($event.target as HTMLInputElement).value)" />
      </div>
    </div>

    <div class="upload-section" :class="{ 'drag-active': dragActive, 'has-error': validationErrors.national_id_image }"
      @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop"
      @click="triggerFileInput">
      <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileSelect" />

      <div v-if="store.idCardPreview" class="preview">
        <img :src="store.idCardPreview" alt="پیش‌نمایه کارت ملی" />
        <button type="button" @click.stop="clearFile" class="remove-btn" aria-label="حذف عکس">حذف</button>
      </div>

      <div v-else class="upload-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>عکس کارت ملی را اینجا رها کنید یا کلیک کنید</p>
        <span>حداکثر ۵ مگابایت - به صورت خودکار فشرده می‌شود</span>
      </div>

      <span v-if="validationErrors.national_id_image" class="error">{{ validationErrors.national_id_image }}</span>
    </div>

    <div v-if="store.isCompressing" class="compressing">
      <span class="spinner" />
      در حال فشرده‌سازی عکس...
    </div>
    <div v-if="compressError" class="error">{{ compressError }}</div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.step-card {
  @apply rounded-xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)];
}
.step-card h3 {
  @apply mb-5 text-[1.15rem] font-semibold text-gray-900;
}
.form-grid {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.form-group {
  @apply mb-4;
}
.form-group label {
  @apply mb-2 block text-[0.9rem] font-medium text-gray-700;
}
.form-group input {
  @apply w-full rounded-lg border-[1.5px] border-gray-300 bg-white p-3 text-base font-[inherit] box-border transition-[border-color,box-shadow] duration-200;
}
.form-group input:hover {
  @apply border-gray-300;
}
.form-group input:focus {
  @apply border-blue-500 outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.15)];
}
.form-group input.has-error {
  @apply border-red-500;
}
.form-group input.has-error:focus {
  @apply shadow-[0_0_0_3px_rgba(239,68,68,0.15)];
}
.full-width {
  @apply col-span-full;
}
.error {
  @apply mt-1.5 block text-[0.8rem] text-red-500;
}
.upload-section {
  @apply mt-6 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-[border-color,background-color] duration-200;
}
.upload-section:hover {
  @apply border-gray-400 bg-gray-50;
}
.upload-section.drag-active {
  @apply border-blue-500 bg-blue-50;
}
.upload-section.has-error {
  @apply border-red-500 bg-red-50;
}
.upload-placeholder svg {
  @apply mb-4 text-gray-400;
}
.upload-placeholder p {
  @apply my-2 font-medium text-gray-700;
}
.upload-placeholder span {
  @apply text-[0.875rem] text-gray-500;
}
.preview {
  @apply relative inline-block;
}
.preview img {
  @apply block max-w-[200px] max-h-[200px] rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.15)] object-cover;
}
.remove-btn {
  @apply absolute -top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-white bg-red-500 text-[0] text-white cursor-pointer transition-[background-color,transform] duration-200;
  inset-inline-end: -8px;
}
.remove-btn::before {
  content: '×';
  @apply text-[16px] leading-none;
}
.remove-btn:hover {
  @apply bg-red-600;
}
.remove-btn:active {
  @apply scale-[0.92];
}
.compressing {
  @apply mt-4 flex items-center gap-2 text-[0.9rem] text-blue-500;
}
.spinner {
  @apply h-[14px] w-[14px] shrink-0 rounded-full border-2 border-blue-500/25 border-t-blue-500;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@media (max-width: 480px) {
  .step-card { @apply p-5; }
  .upload-section { @apply p-5; }
}
</style>
