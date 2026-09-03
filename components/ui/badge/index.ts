import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200',
        secondary:
          'border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 ',
        destructive:
          'border-transparent bg-rose-500 text-white  dark:bg-rose-600 ',
        outline:
          'border-slate-300 text-slate-700  dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
        success:
          'border-transparent bg-emerald-500 text-white dark:bg-emerald-600',
        warning:
          'border-transparent bg-amber-500 text-white  dark:bg-amber-600',
        info:
          'border-transparent bg-sky-500 text-white  dark:bg-sky-600',
        ghost:
          'border-transparent bg-muted/50 text-muted-foreground ',
        
        "default-soft":
          "bg-primary/10 text-primary hover:bg-primary/15 active:bg-primary/20 border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30",

        "destructive-soft":
            "bg-destructive/10 text-destructive hover:bg-destructive/15 active:bg-destructive/20 border border-destructive/20 dark:bg-destructive/20 dark:text-destructive dark:hover:bg-destructive/30",

        "outline-soft":
          "border border-input/60 bg-muted/30 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-muted/10 dark:border-input/40 dark:hover:bg-accent/40",

        "secondary-soft":
          "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 border border-border/40 dark:bg-secondary/30",

        "ghost-soft":
          "bg-accent/30 text-accent-foreground hover:bg-accent/60 active:bg-accent/80 dark:bg-accent/20 dark:hover:bg-accent/40",

        "link-soft":
          "text-muted-foreground underline-offset-4 hover:underline hover:text-primary",

        "success-soft":
          "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40",

        "warning-soft":
          "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/40",
        
        "info-soft":
          "bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
