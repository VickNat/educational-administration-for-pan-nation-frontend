"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-semibold select-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-in-out group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 hover:from-primary/80 hover:to-secondary/80",
        className
      )}
      {...props}
    />
  )
}

export { Label }