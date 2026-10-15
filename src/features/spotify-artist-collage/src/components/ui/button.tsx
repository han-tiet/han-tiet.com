import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 desktop:gap-3 whitespace-nowrap rounded-md desktop:rounded-[0.5rem] text-sm desktop:text-[1.25rem] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-zinc-950 focus-visible:ring-zinc-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:focus-visible:border-zinc-300 dark:focus-visible:ring-zinc-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60 dark:bg-red-900 dark:hover:bg-red-900/90 dark:focus-visible:ring-red-900/20 dark:dark:focus-visible:ring-red-900/40 dark:dark:bg-red-900/60",
        outline:
          "border bg-white shadow-xs hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-200/30 dark:border-zinc-200 dark:hover:bg-zinc-200/50 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:dark:bg-zinc-800/30 dark:dark:border-zinc-800 dark:dark:hover:bg-zinc-800/50",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-100/50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:dark:hover:bg-zinc-800/50",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
      },
      size: {
        default:
          "h-9 px-4 py-2 has-[>svg]:px-3 desktop:h-[3.25rem] desktop:px-6 desktop:py-3 desktop:has-[>svg]:px-[1.25rem]",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 desktop:h-12 desktop:gap-[0.5rem] desktop:px-[1.25rem] desktop:has-[>svg]:px-[1rem]",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 desktop:h-15 desktop:px-9 desktop:has-[>svg]:px-6",
        icon: "size-9 desktop:size-[3.25rem]",
        "icon-sm": "size-8 desktop:size-12",
        "icon-lg": "size-10 desktop:size-15",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
