"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function LogoAnchor() {
  const [isLoaded, setIsLoaded] = React.useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Link href="/consultant">
              <SidebarMenuButton
                size="lg"
                className="relative data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {!isLoaded && (
                  <Skeleton height={32} width={180} borderRadius={4} />
                )}

                <div className="relative w-[180px] h-[32px]">
                  <Image
                    src="/logo-name.svg"
                    alt="Logo"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,..."
                    quality={100}
                    fill
                    className={cn(
                      "object-contain transition-opacity duration-300",
                      !isLoaded ? "opacity-0 absolute" : "opacity-100",
                    )}
                    onLoad={() => setIsLoaded(true)}
                  />
                </div>
              </SidebarMenuButton>
            </Link>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
