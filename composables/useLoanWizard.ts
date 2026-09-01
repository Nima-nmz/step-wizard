import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoanStore } from '~/stores/Loanstore'
import { getLoanProducts, calculateLoanInstallment, applyLoan } from '~/services/Useloan.service'
import { useAsyncOperation } from '~/composables/useAsyncOperation'

export function useLoanWizard() {
  const router = useRouter()
  const store = useLoanStore()

  const productsOp = useAsyncOperation()
  const calcOp = useAsyncOperation()
  const applyOp = useAsyncOperation()

  const selectedProductId = ref<number | null>(null)
  const amount = ref<number | null>(null)
  const durationMonths = ref<number | null>(null)

  const selectedProduct = computed(() =>
    store.products.find((p) => p.id === selectedProductId.value) || null,
  )

  async function fetchProducts() {
    await productsOp.execute(async () => {
      const products = await getLoanProducts()
      store.setProducts(products)
    }, 'دریافت طرح‌های وام با خطا مواجه شد.')
  }

  function selectProduct(id: number) {
    selectedProductId.value = id
    store.setCalculation(null)
    calcOp.error.value = ''
  }

  async function calculate() {
    if (!selectedProduct.value || !amount.value || !durationMonths.value) return
    store.setCalculation(null)
    await calcOp.execute(async () => {
      const result = await calculateLoanInstallment({
        productId: selectedProduct.value!.id,
        amount: amount.value!,
        durationMonths: durationMonths.value!,
      })
      store.setCalculation(result)
    }, 'محاسبه قسط با خطا مواجه شد.')
  }

  async function submitApplication() {
    if (!selectedProduct.value || !amount.value || !durationMonths.value) return
    await applyOp.execute(async () => {
      const application = await applyLoan({
        productId: selectedProduct.value!.id,
        amount: amount.value!,
        durationMonths: durationMonths.value!,
      })
      store.setCurrentApplication(application)
      router.push(`/loans/${application.id}`)
    }, 'ثبت درخواست با خطا مواجه شد.')
  }

  watch([amount, durationMonths], () => {
    if (store.calculation) store.setCalculation(null)
  })

  onMounted(fetchProducts)

  return {
    products: computed(() => store.products),
    productsLoading: productsOp.loading,
    loadError: productsOp.error,
    selectedProductId,
    selectedProduct,
    amount,
    durationMonths,
    calculating: calcOp.loading,
    calcError: calcOp.error,
    calculation: computed(() => store.calculation),
    applying: applyOp.loading,
    fetchProducts,
    selectProduct,
    calculate,
    submitApplication,
  }
}
