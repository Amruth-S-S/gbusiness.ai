/* eslint-disable no-shadow */
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Pencil, Plus, Trash2, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { useParams } from "next/navigation"
import { TooltipButton } from "@/components/organisms/tootltip-button/TooltipButton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { fetchCollectionsData } from "@/hooks/use-collections"
import { baseUrl, digitalOceanBaseUrl } from "@/lib/constants"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { MainBoardType } from "@/lib/types"
import { cn, iterateErrorResponse } from "@/lib/utils"
import { useCollectionsStore } from "@/store/collections"
import { useDeleteDialog } from "../delete-dialog-provider/DeleteDialogProvider"
import { openModal } from "@/hooks/use-modal"
import { useModalContext } from "@/contexts/modal-context"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { useBoardsStore } from "@/store/boards"
import { NavMainSkeleton } from "./NavMainSkeleton"

type NavMainProps = {
  mainboards: {
    id: number | string
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    key: string
    type: MainBoardType
    boards?: {
      id: number | string
      title: string
      url: string
      key: string
    }[]
  }[]
}

type CollectionDeleteResponse = {
  message: string
}

export function NavMain({ mainboards }: NavMainProps) {
  const params = useParams()

  const { mainBoardId } = params
  const { boardId } = params

  const { setModalState } = useModalContext()
  const { lockScroll } = useScrollLock()
  const { isMobile } = useSidebar()
  const { confirmDelete } = useDeleteDialog()
  const collectionsStore = useCollectionsStore()
  const { fetchTreeInfo, isLoading } = useBoardsStore()

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const [openMainboardId, setOpenMainboardId] = useState<
    string | number | null
  >(Array.isArray(mainBoardId) ? mainBoardId[0] : mainBoardId || null)

  const deleteCollection = async (id: string | number) => {
    const url = new URL(`collections/${id}`, digitalOceanBaseUrl)
    const { data: res, error } = await fetchWrapper<CollectionDeleteResponse>(
      url.href,
      {
        method: "DELETE",
      },
    )
    if (res) {
      fetchCollectionsData(collectionsStore.updateCollectionsStore)
    } else if (error && typeof error === "object") {
      iterateErrorResponse(error as Record<string, any>)
    }
  }

  const deleteBoard = async (id: string | number) => {
    const url = new URL(`main-boards/boards/${id}`, baseUrl)
    const { data: res, error } = await fetchWrapper<CollectionDeleteResponse>(
      url.href,
      {
        method: "DELETE",
      },
    )
    if (res) {
      fetchTreeInfo()
    } else if (error && typeof error === "object") {
      iterateErrorResponse(error as Record<string, any>)
    }
  }

  const dropdownMenuItemClickHandler = (
    type: "EDIT" | "DELETE" | "ADD",
    id: string | number | null,
    mainBoardType: MainBoardType,
    mainBoardId?: number | string,
    name?: string,
  ) => {
    setOpenDropdownId(null)

    if (type === "EDIT" || type === "ADD") {
      openModal(setModalState, lockScroll, {
        modalState: {
          isActive: true,
          isOpen: true,
          contentName: "FORM__BOARD",
          heading: type === "ADD" ? "Create board" : "Edit board",
          data: {
            mainBoardType,
            mainBoardId,
            boardId: id,
            name,
          },
        },
      })
    }

    if (type === "DELETE" && id) {
      const dialog = confirmDelete({
        title: "Delete item?",
        description: "This action cannot be undone.",
        onConfirm: async () => {
          dialog.setLoading(true)
          try {
            if (mainBoardType === MainBoardType.RAG) {
              await deleteCollection(id)
            } else {
              await deleteBoard(id)
            }
          } finally {
            dialog.close()
          }
        },
      })
    }
  }

  if (isLoading) {
    return <NavMainSkeleton />
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {mainboards.map((mainboard) => (
          <Collapsible
            key={mainboard.key}
            asChild
            open={openMainboardId === mainboard.id.toString()}
            onOpenChange={(isOpen) =>
              setOpenMainboardId(isOpen ? mainboard.id.toString() : null)
            }
          >
            <SidebarMenuItem className="group/menu-item">
              <SidebarMenuButton
                tooltip={mainboard.title}
                isActive={mainboard.id.toString() === mainBoardId}
              >
                {!!mainboard.boards?.length && (
                  <CollapsibleTrigger
                    asChild
                    className="hidden group-hover/menu-item:block"
                  >
                    <SidebarMenuAction
                      asChild
                      className="data-[state=open]:rotate-90 left-2 data-[state=open]:top-1.5 right-0 top-2"
                    >
                      <span className="flex items-center">
                        <ChevronRightIcon />
                        <span className="sr-only">Toggle</span>
                      </span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                )}
                {mainboard.icon && (
                  <mainboard.icon
                    className={cn(
                      mainboard.boards?.length &&
                        "group-hover/menu-item:hidden",
                    )}
                  />
                )}
                <span
                  className={cn(
                    mainboard.boards?.length && "group-hover/menu-item:ml-6",
                  )}
                >
                  <Translate>{mainboard.title}</Translate>
                </span>
              </SidebarMenuButton>
              <SidebarMenuAction
                className="opacity-0 group-hover/menu-item:opacity-100"
                onClick={() =>
                  dropdownMenuItemClickHandler(
                    "ADD",
                    null,
                    mainboard.type,
                    mainboard.id,
                  )
                }
              >
                <Plus className="text-muted-foreground w-4 h-4 opacity-0 group-hover/menu-item:opacity-100" />
                <span className="sr-only">Add</span>
              </SidebarMenuAction>

              {mainboard.boards?.length ? (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {mainboard.boards.map((board) => (
                      <SidebarMenuSubItem
                        key={board.key}
                        className="group/menu-sub-item"
                      >
                        <SidebarMenuSubButton
                          href={`/consultant/mainboard/${mainboard.id}/board/${board.id}`}
                          isActive={
                            board.id.toString() === boardId &&
                            mainBoardId === mainboard.id.toString()
                          }
                        >
                          <TooltipButton
                            tooltip={<Translate>{board.title}</Translate>}
                            tooltipTriggerClassName="text-sm cursor-pointer"
                          >
                            <Translate>{board.title}</Translate>
                          </TooltipButton>
                        </SidebarMenuSubButton>

                        <DropdownMenu
                          open={openDropdownId === board.key}
                          onOpenChange={(isOpen) =>
                            setOpenDropdownId(isOpen ? board.key : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <DotsHorizontalIcon />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            className="rounded-3xl z-[9999] border-none bg-gray-100 px-2 py-3"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                dropdownMenuItemClickHandler(
                                  "EDIT",
                                  board.id,
                                  mainboard.type,
                                  mainboard.id as number,
                                  board.title,
                                )
                              }
                            >
                              <Pencil className="mr-2 text-muted-foreground w-4 h-4" />
                              <span>
                                <Translate>Rename</Translate>
                              </span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                dropdownMenuItemClickHandler(
                                  "DELETE",
                                  board.id,
                                  mainboard.type,
                                  2,
                                )
                              }
                              className="text-red-500"
                            >
                              <Trash2 className="mr-2 w-4 h-4" />
                              <span>
                                <Translate>Delete</Translate>
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
