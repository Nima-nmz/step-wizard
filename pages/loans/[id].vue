<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWizardStore } from '~/stores/wizardStore'
import { useLoanDetail } from '~/composables/useLoanDetail'
import PageContainer from '~/components/ui/PageContainer.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
import SectionCard from '~/components/ui/SectionCard.vue'
import { Button } from '@/components/ui/button'
import LoanDetailHeader from '~/components/loan/LoanDetailHeader.vue'
import LoanDocumentViewer from '~/components/loan/LoanDocumentViewer.vue'
import LoanGuarantorForm from '~/components/loan/LoanGuarantorForm.vue'
import LoanGuarantorCard from '~/components/loan/LoanGuarantorCard.vue'
import LoanTimeline from '~/components/loan/LoanTimeline.vue'
import { ArrowRightIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useWizardStore()
const loanId = Number(route.params.id)
const isAdmin = computed(() => store.role === 'admin')

const {
  application, timeline, loading, loadError,
  uploading, uploadError, submittingGuarantor, guarantorErrors,
  submittingFinal, finalError, cancelling, submittingAdmin, canSubmitFinal,
  fetchAll, uploadDocument, removeDocument, submitGuarantor, submitFinal, cancel, handleAdminApprove, handleAdminReject,
} = useLoanDetail(loanId)
</script>

<template>
  <PageContainer>
         <Button variant="info-soft" class="back-link" @click="router.push(isAdmin ? '/admin' : '/loans')">
        <ArrowRightIcon/>
        بازگشت به لیست </Button>

    <LoadingState :loading="loading" :error="loadError" loading-text="در حال دریافت اطلاعات..." @retry="fetchAll">
      <template v-if="application">
        <LoanDetailHeader
          :amount="application.amount"
          :duration-months="application.durationMonths"
          :status="application.status"
          :cancelling="cancelling"
          :error="finalError"
          @cancel="cancel"
        />

        <SectionCard v-if="isAdmin && application.status !== 'draft'" title="عملیات ادمین">
          <div class="flex mx-8 gap-3 w-70">
            <Button variant="success" :disabled="application.status === 'approved' || submittingAdmin" :loading="submittingAdmin" @click="handleAdminApprove">
              تأیید درخواست
            </Button>
            <Button variant="destructive" @click="handleAdminReject('رد شده')">
              رد درخواست
            </Button>
          </div>
        </SectionCard>

        <SectionCard v-if="application.status === 'draft'" title="مدارک ضمانت">
          <LoanDocuments 
            v-if="!isAdmin"
            mode="manage"
            :documents="application.documents"
            :uploading="uploading"
            :error="uploadError"
            @upload="uploadDocument"
            @remove="removeDocument"
          />
        </SectionCard>

        <SectionCard v-if="application.status === 'draft'" title="اطلاعات ضامن">
          <div v-if="application.guarantor" class="guarantor-done">
            <p>✓ اطلاعات ضامن ({{ application.guarantor.fullName }}) ثبت شد.</p>
          </div>
          <LoanGuarantorForm
            v-else
            :submitting="submittingGuarantor"
            :errors="guarantorErrors"
            @submit="submitGuarantor"
          />
        </SectionCard>

        <SectionCard v-if="application.status === 'draft'">
          <Button variant="success" :loading="submittingFinal" :disabled="!canSubmitFinal" @click="submitFinal">
            {{ submittingFinal ? 'در حال ارسال...' : 'ارسال نهایی درخواست' }}
          </Button>
          <p v-if="!canSubmitFinal" class="hint">برای ارسال نهایی، حداقل یک مدرک و اطلاعات ضامن لازمه.</p>
        </SectionCard>

        <SectionCard v-if="application.status !== 'draft' && application.documents.length" title="مدارک ارسالی">
          <LoanDocuments
            mode="view"
            :documents="application.documents"
          />
        </SectionCard>

        <SectionCard v-if="application.status !== 'draft' && application.guarantor" title="اطلاعات ضامن">
          <LoanGuarantorCard
            :guarantor="application.guarantor"
          />
        </SectionCard>

        <SectionCard v-if="application.status !== 'draft'" title="تاریخچه وضعیت">
          <LoanTimeline :timeline="timeline" />
        </SectionCard>
      </template>
    </LoadingState>
  </PageContainer>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.back-link {
  @apply cursor-pointer mb-4 text-[0.85rem] text-blue-500;
}
.guarantor-done {
  @apply rounded-lg bg-green-50 p-3 text-[0.85rem] text-green-700;
}
.hint {
  @apply mt-[0.6rem] text-center text-[0.8rem] text-gray-400;
}
</style>
