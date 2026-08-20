import { ref } from 'vue'
import { useWizardStore } from '~/stores/wizardStore'

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  outputType?: 'image/jpeg' | 'image/webp'
}

export function useImageCompressor() {
  const store = useWizardStore()
  const error = ref<string | null>(null)

  async function compress(file: File, options: CompressOptions = {}): Promise<File> {
    const { maxWidth = 1200, maxHeight = 1200, quality = 0.7, outputType = 'image/jpeg' } = options

    store.setCompressing(true)
    error.value = null

    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = (e) => { img.src = e.target?.result as string }

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          store.setCompressing(false)
          if (!blob) {
            error.value = 'فشرده‌سازی ناموفق بود'
            reject(new Error('Compression failed'))
            return
          }
          const compressedFile = new File([blob], file.name, { type: outputType, lastModified: Date.now() })
          resolve(compressedFile)
        }, outputType, quality)
      }

      img.onerror = () => {
        store.setCompressing(false)
        error.value = 'بارگذاری عکس ناموفق بود'
        reject(new Error('Image load failed'))
      }

      reader.readAsDataURL(file)
    })
  }

  return { compress, error }
}
