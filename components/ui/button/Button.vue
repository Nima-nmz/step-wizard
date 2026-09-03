<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "."

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  loading: false,
})
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :disabled="loading || ($attrs as any).disabled"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <span v-if="loading" class="btn-loading-spinner" />
    <slot />
  </Primitive>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.btn-loading-spinner {
  @apply h-4 w-4 shrink-0 rounded-full border-2 border-current border-t-transparent;
  animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
</style>
