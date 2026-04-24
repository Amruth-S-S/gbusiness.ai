"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { MdClose } from "react-icons/md"
import { FaArrowLeftLong } from "react-icons/fa6"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import clsx from "clsx"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    heading?: string
    headingClassName?: string
    backBtnClick?: () => void
    childrenWrapperClassName?: string
  }
>(
  (
    {
      className,
      children,
      heading,
      headingClassName,
      backBtnClick,
      childrenWrapperClassName,
      ...props
    },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "fixed top-0 z-10 flex w-full items-center bg-white p-4",
            heading ? "justify-between" : "justify-end",
          )}
        >
          <div className="flex items-center gap-2">
            {!!backBtnClick && (
              <Button
                variant="destructive"
                className="p-0"
                onClick={backBtnClick}
              >
                <FaArrowLeftLong />
              </Button>
            )}

            <DialogHeader className={cn(!heading && "sr-only")}>
              <DialogTitle
                className={cn(
                  headingClassName,
                  "line-clamp-1",
                  !heading && "sr-only",
                )}
              >
                <Translate>{heading ?? ""}</Translate>
              </DialogTitle>
              <DialogDescription className="sr-only" />
            </DialogHeader>
          </div>
          <DialogPrimitive.Close className="h-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <MdClose className="h-4 w-4" size={20} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <div
          className={clsx(
            "max-h-full overflow-y-auto mt-[60px] mpb-[60px]",
            childrenWrapperClassName,
          )}
        >
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2",
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
