import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-ring btn-hover-lift btn-press disabled:pointer-events-none disabled:opacity-50 select-none overflow-hidden",
  {
    variants: {
      variant: {
        default: "btn-primary font-semibold shadow-md text-white",
        destructive: "btn-destructive text-white font-semibold shadow-md",
        outline: "btn-outline border-2 font-semibold shadow-sm",
        secondary: "btn-secondary font-semibold shadow-sm",
        tertiary: "btn-tertiary font-semibold shadow-md",
        ghost: "btn-ghost font-medium",
        link: "btn-link font-medium underline-offset-4 hover:underline",
        neumorphic: "neumorphic-enhanced font-semibold",
        glass: "glass font-semibold shadow-md",
        clay: "clay font-semibold shadow-md",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={style}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }