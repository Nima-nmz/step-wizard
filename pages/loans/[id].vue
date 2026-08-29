<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useLoanDetail } from '~/composables/useLoanDetail'
import PageContainer from '~/components/ui/PageContainer.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
import SectionCard from '~/components/ui/SectionCard.vue'
import LoadingButton from '~/components/ui/LoadingButton.vue'
import LoanDetailHeader from '~/components/loan/LoanDetailHeader.vue'
import LoanDocumentUpload from '~/components/loan/LoanDocumentUpload.vue'
import LoanDocumentViewer from '~/components/loan/LoanDocumentViewer.vue'
import LoanGuarantorForm from '~/components/loan/LoanGuarantorForm.vue'
import LoanGuarantorCard from '~/components/loan/LoanGuarantorCard.vue'
import LoanTimeline from '~/components/loan/LoanTimeline.vue'

const route = useRoute()
const router = useRouter()
const loanId = Number(route.params.id)

const {
  application, timeline, loading, loadError,
  uploading, uploadError, submittingGuarantor, guarantorErrors,
  submittingFinal, finalError, cancelling, canSubmitFinal,
  fetchAll, uploadDocument, removeDocument, submitGuarantor, submitFinal, cancel,
} = useLoanDetail(loanId)
</script>

<template>
  <PageContainer>
    <button class="back-link" @click="router.push('/loans')">← بازگشت به لیست</button>

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

        <SectionCard v-if="application.status === 'draft'" title="مدارک ضمانت">
          <LoanDocumentUpload
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
          <LoadingButton variant="success" :loading="submittingFinal" :disabled="!canSubmitFinal" @click="submitFinal">
            {{ submittingFinal ? 'در حال ارسال...' : 'ارسال نهایی درخواست' }}
          </LoadingButton>
          <p v-if="!canSubmitFinal" class="hint">برای ارسال نهایی، حداقل یک مدرک و اطلاعات ضامن لازمه.</p>
        </SectionCard>

        <SectionCard v-if="application.status !== 'draft' && application.documents.length" title="مدارک ارسالی">
          <LoanDocumentViewer
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
  @apply mb-4 inline-block cursor-pointer border-none bg-transparent p-0 text-[0.85rem] text-blue-500;
}
.back-link:hover { @apply underline; }
.guarantor-done {
  @apply rounded-lg bg-green-50 p-3 text-[0.85rem] text-green-700;
}
.hint {
  @apply mt-[0.6rem] text-center text-[0.8rem] text-gray-400;
}
</style>
