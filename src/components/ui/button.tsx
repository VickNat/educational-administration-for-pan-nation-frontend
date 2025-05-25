import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 dark:focus-visible:ring-primary/70 aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md hover:from-primary/90 hover:to-secondary/90 active:scale-95",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/80 text-white shadow-md hover:bg-destructive/90 focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/50 dark:bg-destructive/70 active:scale-95",
        outline:
          "border-2 border-primary/20 bg-transparent shadow-sm hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary dark:bg-input/20 dark:border-primary/30 dark:hover:bg-primary/10 text-primary active:scale-95",
        secondary:
          "bg-gradient-to-r from-secondary to-primary/80 text-secondary-foreground shadow-md hover:from-secondary/90 hover:to-primary/70 active:scale-95",
        ghost:
          "hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary dark:hover:bg-primary/20 text-primary active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }