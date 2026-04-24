import { DropdownMenuComponent } from "@/components/atoms/controls/DropdownMenuComponent"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { fetchCollectionsData } from "@/hooks/use-collections"
import { baseUrl } from "@/lib/constants"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { MainBoardType } from "@/lib/types"
import { iterateErrorResponse } from "@/lib/utils"
import { useBoardsStore } from "@/store/boards"
import { useCollectionsStore } from "@/store/collections"
import { useState } from "react"

type AddMainBoardDropdownProps = {
  options: {
    label: string
    value: MainBoardType
  }[]
}

export function AddMainBoardDropdown({ options }: AddMainBoardDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { updateCollectionsStore } = useCollectionsStore()
  const { fetchTreeInfo, isLoading: isBoardsLoading } = useBoardsStore()

  if (isBoardsLoading) {
    return (
      <Skeleton className="w-[145px] h-9 rounded-full mx-auto bg-[#ebebeb]" />
    )
  }

  const addMainBoard = async (type: MainBoardType) => {
    setIsLoading(true)
    try {
      const payload = {
        userId: user?.userId,
        clientUserId: user?.userId,
        mainBoardType: type,
        name: options.find((option) => option.value === type)?.label,
      }
      const url = new URL("main-boards/", baseUrl)
      const { data: res, error } = await fetchWrapper(url.href, {
        method: "POST",
        body: payload,
      })
      if (res) {
        fetchCollectionsData(updateCollectionsStore)
        fetchTreeInfo()
      } else if (error && typeof error === "object") {
        iterateErrorResponse(error)
      }
    } catch (error) {
      if (error && typeof error === "object") {
        iterateErrorResponse(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto">
      <DropdownMenuComponent
        dropDownTrigger={
          isLoading ? (
            <Skeleton className="w-[144px] h-9 rounded-full mx-auto bg-[#ebebeb]" />
          ) : (
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-[144px]"
            >
              Add Main Board
            </Button>
          )
        }
        options={options}
        menuItemClickHandler={(value) => addMainBoard(value as MainBoardType)}
      />
    </div>
  )
}
