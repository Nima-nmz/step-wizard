export function useLoanFormatter() {
  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
  }

  function formatPersianDate(dateStr: string | Date): string {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('fa-IR')
  }

  function isImageFile(fileName: string): boolean {
    return /\.(jpe?g|png|gif|webp|bmp)$/i.test(fileName)
  }

  return {
    formatAmount,
    formatPersianDate,
    isImageFile,
  }
}
