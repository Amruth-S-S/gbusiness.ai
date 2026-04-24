"use client"

import { ReactNode, useRef, useState, useEffect } from "react"
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface TooltipButtonProps {
  tooltip: ReactNode
  children: ReactNode
  tooltipTriggerClassName?: string
}

export function TooltipButton({
  tooltip,
  children,
  tooltipTriggerClassName,
}: TooltipButtonProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isOverflowed, setIsOverflowed] = useState(false)

  useEffect(() => {
    if (ref.current) {
      const element = ref.current
      setIsOverflowed(
        element.scrollWidth > element.clientWidth ||
          element.scrollHeight > element.clientHeight,
      )
    }
  }, [children])

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip disableHoverableContent={!isOverflowed}>
        <TooltipTrigger asChild>
          <span
            ref={ref}
            className={cn(
              "inline-block overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none text-sm max-w-[80%]",
              tooltipTriggerClassName,
            )}
          >
            {children}
          </span>
        </TooltipTrigger>
        {isOverflowed && (
          <TooltipPortal>
            <TooltipContent>
              {typeof tooltip === "string" ? <p>{tooltip}</p> : tooltip}
              <TooltipArrow className="fill-gray-600" />
            </TooltipContent>
          </TooltipPortal>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
