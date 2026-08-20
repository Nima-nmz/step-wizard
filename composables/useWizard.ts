import { computed } from "vue";
import { useWizardStore } from "~/stores/wizardStore";

export function useWizard() {

const store = useWizardStore()

const currentStep=computed(()=>store.currentStep)
const isFirstStep=computed(()=>store.currentStep===1)
const isLastStep=computed(()=>store.currentStep===3)

const canGoNext=computed(()=>{
  switch(store.currentStep){
    case 1: return store.isStep1Valid
    // case 1: return store.isStep1PasswordValid 
    case 2:return store.isStep2Valid
    default: return false
  }
})

function nextStep(){
  if(store.currentStep < 3 && canGoNext.value){
    store.setStep((store.currentStep + 1) as 1 | 2 | 3)
  }
}
function prevStep(){
  if(store.currentStep > 1){
    store.setStep((store.currentStep - 1) as 1 | 2 | 3)
  }
}
function resetWizard(){
  store.clearStore()
}
return{currentStep,isFirstStep,isLastStep,canGoNext,nextStep,prevStep,resetWizard}
}