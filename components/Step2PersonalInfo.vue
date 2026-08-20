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
.step-card {
  padding: 1.75rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.step-card h3 {
  margin: 0 0 1.25rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:hover {
  border-color: #c7cbd1;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-group input.has-error {
  border-color: #ef4444;
}
.form-group input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.full-width {
  grid-column: 1 / -1;
}

.error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.375rem;
  display: block;
}

/* ---------- بخش آپلود ---------- */
.upload-section {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.upload-section:hover {
  border-color: #9ca3af;
  background: #fafafa;
}

.upload-section.drag-active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-section.has-error {
  border-color: #ef4444;
  background: #fef2f2;
}

.upload-placeholder svg {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  margin: 0.5rem 0;
  font-weight: 500;
  color: #374151;
}

.upload-placeholder span {
  font-size: 0.875rem;
  color: #6b7280;
}

.preview {
  position: relative;
  display: inline-block;
}

.preview img {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  display: block;
}

/* استفاده از inset-inline به‌جای right فیزیکی تا در RTL درست جا بگیره */
.remove-btn {
  position: absolute;
  top: -8px;
  inset-inline-end: -8px;
  background: #ef4444;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-size: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.remove-btn::before {
  content: '×';
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  background: #dc2626;
}

.remove-btn:active {
  transform: scale(0.92);
}

.compressing {
  margin-top: 1rem;
  color: #3b82f6;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(59, 130, 246, 0.25);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .step-card {
    padding: 1.25rem;
  }
  .upload-section {
    padding: 1.25rem;
  }
}
</style>
