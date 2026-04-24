"use client"

import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

type PopoverWrapperProps<T extends ElementType = "button"> = {
  trigger: ReactNode
  children: ReactNode
  popoverProps?: ComponentProps<typeof Popover>
  triggerProps?: ComponentProps<typeof PopoverTrigger>
  contentProps?: ComponentProps<typeof PopoverContent>
  contentClassName?: string
} & ComponentPropsWithoutRef<T>

export function PopoverWrapper<T extends ElementType = "button">({
  trigger,
  children,
  popoverProps,
  triggerProps,
  contentProps,
  contentClassName,
}: PopoverWrapperProps<T>) {
  return (
    <Popover {...popoverProps}>
      <PopoverTrigger {...triggerProps} asChild>
        <button type="button" className="p-0 m-0">
          {trigger}
        </button>
      </PopoverTrigger>
      <PopoverContent className={contentClassName} {...contentProps}>
        {children}
      </PopoverContent>
    </Popover>
  )
}
