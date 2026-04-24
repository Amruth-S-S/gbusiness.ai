"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useCollections } from "@/hooks/use-collections"
import { getMainBoards } from "@/lib/main-boards"
import { useCollectionsStore } from "@/store/collections"
import { LogoAnchor } from "./LogoAnchor"
import { NavUser } from "./NavUser"
import { NavMain } from "./organisms/nav-main/NavMain"
import { useBoardsStore } from "@/store/boards"
import { AddMainBoardDropdown } from "./molecules/dropdowns/add-main-board-dropdown/AddMainBoardDropdown"
import { MainBoardType } from "@/lib/types"

export function ConsultantSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  useCollections()
  const collectionsStore = useCollectionsStore()
  const { treeNodes } = useBoardsStore()
  const navMainItems = getMainBoards(treeNodes, collectionsStore)

  const defaultOptions: {
    label: string
    value: MainBoardType
  }[] = [
    {
      label: "Analysis",
      value: MainBoardType.ANALYSIS,
    },
    {
      label: "Document Analysis",
      value: MainBoardType.RAG,
    },
    {
      label: "Forecast",
      value: MainBoardType.FORECAST,
    },
  ]

  const excludedTypes = navMainItems.map((board) => board.type)

  const options = defaultOptions.filter(
    (option) => !excludedTypes.includes(option.value),
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <LogoAnchor />
      </SidebarHeader>
      <SidebarContent>
        {!!options.length && <AddMainBoardDropdown options={options} />}
        <NavMain mainboards={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
