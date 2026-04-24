/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */

"use client"

import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export function NavMainSkeleton() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {[...Array(6)].map((_, i) => (
          <SidebarMenuItem key={`skeleton-${i}`}>
            <SidebarMenuButton>
              <Skeleton height={20} width={180} />
            </SidebarMenuButton>
            {i === 0 && (
              <SidebarMenuSub>
                {[...Array(4)].map((_, j) => (
                  <SidebarMenuSubItem key={`sub-skeleton-${i}-${j}`}>
                    <SidebarMenuSubButton>
                      <Skeleton height={16} width={160} />
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
