/* eslint-disable react/no-array-index-key */

"use client"

import Link from "next/link"
import { Fragment, useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDimensions } from "@/hooks/use-dimensions"

const DEFAULT_ITEMS_TO_DISPLAY = 3

export type BreadcrumbItemProps = {
  href?: string
  label: string
}

type BreadcrumbComponentProps = {
  className?: string
  itemsToDisplay?: number
  items: BreadcrumbItemProps[]
}

export function BreadcrumbComponent({
  className,
  itemsToDisplay,
  items,
}: BreadcrumbComponentProps) {
  const [open, setOpen] = useState(false)
  const {
    dimensionsState: { winInnerW },
  } = useDimensions()
  const isDesktop = winInnerW >= 768

  if (!items.length) {
    return null
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.length > (itemsToDisplay ?? DEFAULT_ITEMS_TO_DISPLAY) ? (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {items.slice(1, -2)?.map((item, index) => (
                      <DropdownMenuItem key={index}>
                        <Link href={item.href ? item.href : "#"}>
                          <Translate>{item.label}</Translate>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>
                        <Translate>Navigate to</Translate>
                      </DrawerTitle>
                      <DrawerDescription>
                        <Translate>Select a page to navigate to.</Translate>
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {items.slice(1, -2)?.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href ? item.href : "#"}
                          className="py-1 text-sm"
                        >
                          <Translate>{item.label}</Translate>
                        </Link>
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">
                          <Translate>Close</Translate>
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        {items
          .slice(-(itemsToDisplay ?? DEFAULT_ITEMS_TO_DISPLAY) + 1)
          .map((item, index) =>
            item.href ? (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="max-w-20 truncate md:max-w-none"
                  >
                    <Link href={item.href}>
                      <Translate>{item.label}</Translate>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ) : (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                  <Translate>{item.label}</Translate>
                </BreadcrumbPage>
              </BreadcrumbItem>
            ),
          )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
