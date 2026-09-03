import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500/30 dark:bg-emerald-600 dark:hover:bg-emerald-700",
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500/30 dark:bg-amber-600 dark:hover:bg-amber-700",
        info:
          "bg-[#2B7FFF]/85 text-white hover:bg-[#2B7FFF]/100 focus-visible:ring-sky-500/30 dark:bg-sky-600 dark:hover:bg-sky-700",
        
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
      size: {
        "default": "h-9 px-4 py-2 has-[>svg]:px-3",
        "xs": "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        "sm": "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        "lg": "h-10 rounded-md px-6 has-[>svg]:px-4",
        "icon": "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
