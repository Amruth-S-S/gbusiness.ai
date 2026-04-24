// hooks/use-create-board-form.ts
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useState } from "react"
import toast from "react-hot-toast"
import { useModalContext } from "@/contexts/modal-context"
import { closeModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { baseUrl, digitalOceanBaseUrl } from "@/lib/constants"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { iterateErrorResponse } from "@/lib/utils"
import { useCollectionsStore } from "@/store/collections"
import { fetchCollectionsData } from "@/hooks/use-collections"
import { useBoardsStore } from "@/store/boards"

const createBoardFormSchema = z.object({
  boardName: z.string().min(1, { message: "Board name is required" }),
})

const errorHandler = (error: Error) => {
  if (error instanceof Error) {
    toast.error(error.message)
  } else if (error && typeof error === "object") {
    iterateErrorResponse(error as Record<string, any>)
  } else {
    toast.error("Something went wrong")
  }
}

export type CreateBoardFormValues = z.infer<typeof createBoardFormSchema>

export function useCreateBoardForm() {
  const { selectedMainBoard, fetchTreeInfo } = useBoardsStore()
  const { updateCollectionsStore } = useCollectionsStore()
  const {
    modalState: { data },
    setModalState,
  } = useModalContext()
  const { unlockScroll } = useScrollLock()
  const [isLoading, setIsLoading] = useState(false)

  const modalData = data as {
    mainBoardId: number
    name: string
    boardId: number
    mainBoardType: string
  }

  const defaultValues: Partial<CreateBoardFormValues> = {
    boardName: modalData?.name ?? "",
  }

  const form = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createBoardFormSchema),
    defaultValues,
  })

  const createBoard = async (
    name: string,
    mainBoardType: string,
    mainBoardId: number,
  ) => {
    const payload = { name, mainBoardType, mainBoardId }
    const url = new URL("/main-boards/boards/", baseUrl)
    const { data: res, error } = await fetchWrapper(url.href, {
      method: "POST",
      body: payload,
    })

    if (res) {
      fetchTreeInfo()
      closeModal(setModalState, unlockScroll)
    } else if (error) {
      errorHandler(error)
    }
  }

  const editBoard = async (
    name: string,
    mainBoardId: number,
    boardId: number | string,
  ) => {
    const payload = {
      name,
      mainBoardId,
      mainBoardType: modalData.mainBoardType,
    }
    const url = new URL(`main-boards/boards/${boardId}`, baseUrl)
    const { data: res, error } = await fetchWrapper(url.href, {
      method: "PUT",
      body: payload,
    })
    if (res) {
      fetchTreeInfo()
      closeModal(setModalState, unlockScroll)
    } else if (error) {
      errorHandler(error)
    }
  }

  const createCollection = async (boardName: string) => {
    const vectorSize = "384"
    const distance = "COSINE"
    const url = new URL("collections", digitalOceanBaseUrl)
    url.searchParams.append("collection_name", boardName)
    url.searchParams.append("vector_size", vectorSize)
    url.searchParams.append("distance", distance)

    const { data: res, error } = await fetchWrapper(url.href, {
      method: "POST",
    })
    if (res) {
      fetchCollectionsData(updateCollectionsStore)
      closeModal(setModalState, unlockScroll)
    } else if (error) {
      errorHandler(error)
    }
  }

  const onSubmit = async (formData: CreateBoardFormValues) => {
    setIsLoading(true)
    try {
      if (selectedMainBoard?.type === "RAG") {
        if (modalData?.boardId) {
          // Handle deletion if needed
        } else {
          await createCollection(formData.boardName)
        }
      } else if (modalData?.boardId) {
        await editBoard(
          formData.boardName,
          modalData.mainBoardId,
          modalData.boardId,
        )
      } else if (modalData.mainBoardType) {
        await createBoard(
          formData.boardName,
          modalData.mainBoardType,
          modalData.mainBoardId,
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { form, onSubmit, isLoading }
}
