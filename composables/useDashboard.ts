import { ref, reactive, computed } from 'vue'
import type { UserProfile, UpdateProfilePayload, UpdateBankPayload } from '~/types/user'
import { getUserProfile, updateProfile, updateAvatar, updateBankInfo, getIdCard } from '~/services/useUser.service'
import { useImageCompressor } from '~/composables/useImageCompressor'
import { useWizardStore } from '~/stores/wizardStore'

export function useDashboard() {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref('')
  const successMessage = ref('')
  const wizardStore = useWizardStore()

  const editingProfile = ref(false)
  const editingBank = ref(false)
  const savingProfile = ref(false)
  const savingBank = ref(false)
  const uploadingAvatar = ref(false)

  const idCardUrl = ref<string | null>(null)
  const loadingIdCard = ref(false)
  const showIdCardModal = ref(false)

  const profileForm = reactive<UpdateProfilePayload>({
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
  })

  const bankForm = reactive<UpdateBankPayload>({
    iban: '',
    bank_name: '',
    account_number: '',
  })

  const { compress } = useImageCompressor()

  const displayName = computed(() => {
    if (!profile.value) return 'کاربر'
    return `${profile.value.firstName} ${profile.value.lastName}`.trim() || 'کاربر'
  })

  const initials = computed(() => {
    if (!profile.value) return 'ک'
    const f = profile.value.firstName?.[0] || ''
    const l = profile.value.lastName?.[0] || ''
    return (f + l) || 'ک'
  })

  const formattedIban = computed(() => {
    if (!profile.value?.iban) return ''
    const iban = profile.value.iban.replace(/^IR/, '')
    return `IR${iban.replace(/(.{4})/g, '$1 ').trim()}`
  })

  function mergeWithWizardStore(serverProfile: UserProfile): UserProfile {
    const pi = wizardStore.personalInfo
    return {
      ...serverProfile,
      firstName: serverProfile.firstName || pi.firstName || '',
      lastName: serverProfile.lastName || pi.lastName || '',
      nationalId: serverProfile.nationalId || pi.nationalId || '',
      birthDate: serverProfile.birthDate || pi.birthDate || '',
      email: serverProfile.email || pi.email || null,
      phoneNumber: serverProfile.phoneNumber || wizardStore.phoneNumber || '',
    }
  }

  async function fetchProfile() {
    loading.value = true
    error.value = ''
    try {
      const raw = await getUserProfile()
      profile.value = mergeWithWizardStore(raw)
    } catch (e: any) {
      error.value = e?.data?.message || 'خطا در دریافت اطلاعات پروفایل'
    } finally {
      loading.value = false
    }
  }

  function startEditProfile() {
    if (!profile.value) return
    profileForm.first_name = profile.value.firstName
    profileForm.last_name = profile.value.lastName
    profileForm.email = profile.value.email || ''
    profileForm.birth_date = profile.value.birthDate
    editingProfile.value = true
  }

  function cancelEditProfile() {
    editingProfile.value = false
  }

  function startEditBank() {
    if (!profile.value) return
    bankForm.iban = profile.value.iban || ''
    bankForm.bank_name = profile.value.bankName || ''
    bankForm.account_number = profile.value.accountNumber || ''
    editingBank.value = true
  }

  function cancelEditBank() {
    editingBank.value = false
  }

  async function saveProfile() {
    savingProfile.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const result = await updateProfile(profileForm)
      profile.value = result.user
      editingProfile.value = false
      successMessage.value = 'اطلاعات پروفایل با موفقیت بروزرسانی شد'
    } catch (e: any) {
      if (e?.status === 422 && e?.data?.errors) {
        const firstError = Object.values(e.data.errors)[0]
        error.value = Array.isArray(firstError) ? firstError[0] : String(firstError)
      } else {
        error.value = e?.data?.message || 'خطا در بروزرسانی اطلاعات'
      }
    } finally {
      savingProfile.value = false
    }
  }

  async function saveBankInfo() {
    savingBank.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const result = await updateBankInfo(bankForm)
      profile.value = result.user
      editingBank.value = false
      successMessage.value = 'اطلاعات بانکی با موفقیت بروزرسانی شد'
    } catch (e: any) {
      if (e?.status === 422 && e?.data?.errors) {
        const firstError = Object.values(e.data.errors)[0]
        error.value = Array.isArray(firstError) ? firstError[0] : String(firstError)
      } else {
        error.value = e?.data?.message || 'خطا در بروزرسانی اطلاعات بانکی'
      }
    } finally {
      savingBank.value = false
    }
  }

  async function handleAvatarUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      error.value = 'فقط فایل‌های تصویری مجاز هستند'
      return
    }

    uploadingAvatar.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const compressed = await compress(file, { maxWidth: 400, quality: 0.8 })
      const result = await updateAvatar(compressed)
      profile.value = result.user
      successMessage.value = 'عکس پروفایل با موفقیت بروزرسانی شد'
    } catch (e: any) {
      error.value = e?.data?.message || 'خطا در آپلود عکس پروفایل'
    } finally {
      uploadingAvatar.value = false
      input.value = ''
    }
  }

  function clearMessages() {
    error.value = ''
    successMessage.value = ''
  }

  async function fetchIdCard() {
    loadingIdCard.value = true
    try {
      const result = await getIdCard()
      idCardUrl.value = result.idCardUrl
      showIdCardModal.value = true
    } catch (e: any) {
      error.value = e?.data?.message || 'خطا در دریافت تصویر کارت ملی'
    } finally {
      loadingIdCard.value = false
    }
  }

  function closeIdCardModal() {
    showIdCardModal.value = false
    idCardUrl.value = null
  }

  return {
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
  }
}
