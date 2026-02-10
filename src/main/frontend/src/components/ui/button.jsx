import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

import "./ui-components.css";

const buttonVariants = cva(
  "ui-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "ui-button--default bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "ui-button--destructive bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "ui-button--outline border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "ui-button--secondary bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "ui-button--ghost hover:bg-accent hover:text-accent-foreground",
        link: "ui-button--link text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "ui-button--size-default h-9 px-4 py-2",
        sm: "ui-button--size-sm h-8 rounded-md px-3 text-xs",
        lg: "ui-button--size-lg h-10 rounded-md px-8",
        icon: "ui-button--size-icon h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
