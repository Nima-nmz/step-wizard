<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDashboard } from '~/composables/useDashboard'
import PageContainer from '~/components/ui/PageContainer.vue'
import SectionCard from '~/components/ui/SectionCard.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  CreditCardIcon,
  BuildingIcon,
  CopyIcon,
  CheckIcon,
  PencilIcon,
  UploadIcon,
  ArrowRightIcon,
  LoaderIcon,
  ShieldCheckIcon,
  CircleAlertIcon,
} from 'lucide-vue-next'

const {
  profile,
  loading,
  error,
  successMessage,
  editingProfile,
  editingBank,
  savingProfile,
  savingBank,
  uploadingAvatar,
  profileForm,
  bankForm,
  displayName,
  initials,
  formattedIban,
  idCardUrl,
  loadingIdCard,
  showIdCardModal,
  fetchProfile,
  startEditProfile,
  cancelEditProfile,
  startEditBank,
  cancelEditBank,
  saveProfile,
  saveBankInfo,
  handleAvatarUpload,
  clearMessages,
  fetchIdCard,
  closeIdCardModal,
} = useDashboard()

const avatarInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function copyIban() {
  if (!profile.value?.iban) return
  try {
    await navigator.clipboard.writeText(profile.value.iban)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

onMounted(fetchProfile)
</script>

<template>
  <PageContainer>
    <header class="page-header">
      <Button variant="ghost" size="sm" @click="$router.push('/loans')">
        <ArrowRightIcon class="size-4" />
        بازگشت
      </Button>
      <h1>داشبورد</h1>
      <p>مدیریت اطلاعات حساب کاربری</p>
    </header>

    <LoadingState :loading="loading" :error="error" loading-text="در حال دریافت اطلاعات..." @retry="fetchProfile">

      <div v-if="successMessage" class="alert alert-success" @click="clearMessages">
        <CheckIcon class="size-4" />
        {{ successMessage }}
      </div>

      <div v-if="error && !loading" class="alert alert-error" @click="clearMessages">
        <CircleAlertIcon class="size-4" />
        {{ error }}
      </div>

      <template v-if="profile">
        <SectionCard>
          <div class="profile-header">
            <div class="avatar-section">
              <div class="avatar-wrapper" @click="triggerAvatarUpload">
                <img v-if="profile.avatarUrl" :src="profile.avatarUrl" :alt="displayName" class="avatar-img" />
                <div v-else class="avatar-placeholder">
                  <span>{{ initials }}</span>
                </div>
                <div class="avatar-overlay">
                  <LoaderIcon v-if="uploadingAvatar" class="size-5 animate-spin" />
                  <UploadIcon v-else class="size-5" />
                </div>
                <input ref="avatarInput" type="file" accept="image/*" hidden @change="handleAvatarUpload" />
              </div>
              <div class="profile-info">
                <h2>{{ displayName }}</h2>
                <div class="profile-meta">
                  <Badge variant="outline">
                    <PhoneIcon class="size-3" />
                    {{ profile.phoneNumber }}
                  </Badge>
                  <Badge v-if="profile.email" variant="secondary">
                    <MailIcon class="size-3" />
                    {{ profile.email }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard v-if="profile.firstName || profile.lastName || profile.nationalId || profile.birthDate || profile.email" title="اطلاعات شخصی">
          <template #header-action>
            <Button v-if="!editingProfile" variant="ghost" size="sm" @click="startEditProfile">
              <PencilIcon class="size-4" />
              ویرایش
            </Button>
          </template>

          <div v-if="!editingProfile" class="info-grid">
            <div class="info-item">
              <span class="info-label">
                <UserIcon class="size-4" />
                نام
              </span>
              <span class="info-value">{{ profile.firstName || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">
                <UserIcon class="size-4" />
                نام خانوادگی
              </span>
              <span class="info-value">{{ profile.lastName || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">
                <CreditCardIcon class="size-4" />
                کد ملی
              </span>
              <span class="info-value ltr">{{ profile.nationalId || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">
                <CalendarIcon class="size-4" />
                تاریخ تولد
              </span>
              <span class="info-value">{{ profile.birthDate || '—' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">
                <MailIcon class="size-4" />
                ایمیل
              </span>
              <span class="info-value">{{ profile.email || '—' }}</span>
            </div>
          </div>

          <div v-else class="edit-form">
            <div class="form-grid">
              <div class="form-group">
                <Label>نام</Label>
                <Input v-model="profileForm.first_name" placeholder="نام" />
              </div>
              <div class="form-group">
                <Label>نام خانوادگی</Label>
                <Input v-model="profileForm.last_name" placeholder="نام خانوادگی" />
              </div>
              <div class="form-group">
                <Label>تاریخ تولد</Label>
                <Input v-model="profileForm.birth_date" type="date" />
              </div>
              <div class="form-group full-width">
                <Label>ایمیل</Label>
                <Input v-model="profileForm.email" type="email" placeholder="example@email.com" dir="ltr" />
              </div>
            </div>
            <div class="form-actions">
              <Button variant="secondary" @click="cancelEditProfile">انصراف</Button>
              <Button :loading="savingProfile" @click="saveProfile">ذخیره تغییرات</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="اطلاعات بانکی">
          <template #header-action>
            <Button v-if="!editingBank" variant="ghost" size="sm" @click="startEditBank">
              <PencilIcon class="size-4" />
              ویرایش
            </Button>
          </template>

          <div v-if="!editingBank">
            <div v-if="profile.iban" class="iban-display">
              <div class="iban-box">
                <div class="iban-header">
                  <BuildingIcon class="size-5" />
                  <span>{{ profile.bankName || 'بانک' }}</span>
                </div>
                <div class="iban-number">
                  <span class="ltr">{{ formattedIban }}</span>
                  <Button variant="ghost" size="icon-sm" @click="copyIban">
                    <CheckIcon v-if="copied" class="size-4 text-green-500" />
                    <CopyIcon v-else class="size-4" />
                  </Button>
                </div>
                <div v-if="profile.accountNumber" class="iban-account">
                  <span class="text-muted-foreground text-xs">شماره حساب:</span>
                  <span class="ltr text-sm">{{ profile.accountNumber }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-bank">
              <CreditCardIcon class="size-10 text-muted-foreground/50" />
              <p>هنوز اطلاعات بانکی ثبت نشده</p>
              <Button variant="outline" size="sm" @click="startEditBank">
                افزودن اطلاعات بانکی
              </Button>
            </div>
          </div>

          <div v-else class="edit-form">
            <div class="form-grid">
              <div class="form-group full-width">
                <Label>شماره شبا (IR + 24 رقم)</Label>
                <Input v-model="bankForm.iban" placeholder="IR123456789012345678901234" dir="ltr" maxlength="28" />
              </div>
              <div class="form-group">
                <Label>نام بانک</Label>
                <Input v-model="bankForm.bank_name" placeholder="مثلاً ملت، سامان..." />
              </div>
              <div class="form-group">
                <Label>شماره حساب</Label>
                <Input v-model="bankForm.account_number" placeholder="شماره حساب" dir="ltr" />
              </div>
            </div>
            <div class="form-actions">
              <Button variant="secondary" @click="cancelEditBank">انصراف</Button>
              <Button :loading="savingBank" @click="saveBankInfo">ذخیره اطلاعات بانکی</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="امنیت حساب">
          <div class="security-grid">
            <div class="security-item">
              <div class="security-icon">
                <ShieldCheckIcon class="size-5 text-green-500" />
              </div>
              <div class="security-info">
                <span class="security-label">احراز هویت</span>
                <span class="security-status">شماره موبایل تأیید شده</span>
              </div>
              <Badge variant="default-soft">فعال</Badge>
            </div>
          </div>
        </SectionCard>

        <SectionCard v-if="profile.idCardUrl" title="کارت ملی">
          <div class="id-card-section">
            <div class="id-card-info">
              <CreditCardIcon class="size-5 text-muted-foreground" />
              <span class="text-sm text-muted-foreground">تصویر کارت ملی شما در سیستم ثبت شده است</span>
            </div>
            <Button variant="outline" size="sm" :loading="loadingIdCard" @click="fetchIdCard">
              <CreditCardIcon class="size-4" />
              مشاهده کارت ملی
            </Button>
          </div>
        </SectionCard>
      </template>
    </LoadingState>

    <Teleport to="body">
      <div v-if="showIdCardModal" class="modal-overlay" @click.self="closeIdCardModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>تصویر کارت ملی</h3>
            <Button variant="ghost" size="icon-sm" @click="closeIdCardModal">
              <CircleAlertIcon class="size-4" />
            </Button>
          </div>
          <div class="modal-body">
            <img v-if="idCardUrl" :src="idCardUrl" alt="کارت ملی" class="id-card-image" />
          </div>
        </div>
      </div>
    </Teleport>
  </PageContainer>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.page-header {
  @apply mb-6;
}
.page-header h1 {
  @apply mt-2 text-[1.4rem] font-semibold;
}
.page-header p {
  @apply mt-1 text-[0.9rem] text-gray-500;
}

.alert {
  @apply mb-4 flex items-center gap-2 rounded-lg p-3.5 text-[0.875rem] cursor-pointer;
}
.alert-success {
  @apply bg-green-50 text-green-700 border border-green-200;
}
.alert-error {
  @apply bg-red-50 text-red-700 border border-red-200;
}

.profile-header {
  @apply flex items-center gap-5;
}
.avatar-section {
  @apply flex items-center gap-5;
}
.avatar-wrapper {
  @apply relative cursor-pointer;
}
.avatar-img {
  @apply h-20 w-20 rounded-full object-cover;
}
.avatar-placeholder {
  @apply flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white;
}
.avatar-overlay {
  @apply absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200;
}
.avatar-wrapper:hover .avatar-overlay {
  @apply opacity-100;
}
.profile-info h2 {
  @apply text-xl font-semibold text-gray-900;
}
.profile-meta {
  @apply mt-2 flex flex-wrap gap-2;
}

.info-grid {
  @apply grid gap-4 sm:grid-cols-2;
}
.info-item {
  @apply flex flex-col gap-1 rounded-lg bg-gray-50 px-4 py-3;
}
.info-item.full-width {
  @apply sm:col-span-2;
}
.info-label {
  @apply flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-wide text-gray-400;
}
.info-value {
  @apply text-[0.95rem] font-medium text-gray-800;
}
.info-value.ltr {
  direction: ltr;
  text-align: right;
}

.edit-form {
  @apply mt-2;
}
.form-grid {
  @apply grid gap-4 sm:grid-cols-2;
}
.form-group {
  @apply flex flex-col gap-1.5;
}
.form-group.full-width {
  @apply sm:col-span-2;
}
.form-actions {
  @apply mt-5 flex justify-end gap-3;
}

.iban-display {
  @apply mt-2;
}
.iban-box {
  @apply rounded-xl border border-gray-200 bg-gray-50 p-5;
}
.iban-header {
  @apply mb-3 flex items-center gap-2 text-sm font-medium text-gray-600;
}
.iban-number {
  @apply flex items-center justify-between rounded-lg bg-white px-4 py-3 font-mono text-lg tracking-wider;
}
.iban-account {
  @apply mt-3 flex items-center gap-2 border-t border-gray-200 pt-3;
}

.empty-bank {
  @apply flex flex-col items-center gap-3 py-8 text-gray-500;
}
.empty-bank p {
  @apply text-sm;
}

.security-grid {
  @apply flex flex-col gap-3;
}
.security-item {
  @apply flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-3;
}
.security-icon {
  @apply flex h-10 w-10 items-center justify-center rounded-full bg-white;
}
.security-info {
  @apply flex flex-1 flex-col;
}
.security-label {
  @apply text-sm font-medium text-gray-800;
}
.security-status {
  @apply text-xs text-gray-500;
}

@media (max-width: 480px) {
  .profile-header {
    @apply flex-col items-start gap-4;
  }
  .avatar-section {
    @apply flex-col items-start gap-4;
  }
  .iban-number {
    @apply text-base;
  }
}

.id-card-section {
  @apply flex items-center justify-between;
}
.id-card-info {
  @apply flex items-center gap-3;
}

.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/50;
}
.modal-content {
  @apply w-full max-w-lg rounded-xl bg-white p-6 shadow-xl;
}
.modal-header {
  @apply flex items-center justify-between mb-4;
}
.modal-header h3 {
  @apply text-lg font-semibold;
}
.modal-body {
  @apply flex justify-center;
}
.id-card-image {
  @apply max-h-[60vh] rounded-lg border border-gray-200;
}
</style>
