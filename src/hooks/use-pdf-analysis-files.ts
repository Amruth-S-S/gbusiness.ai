import { useEffect } from "react"
import axios from "axios"
import { digitalOceanBaseUrl } from "@/lib/constants"
import {
  UpdatePdfAnalysisFilesStore,
  usePdfAnalysisFilesStore,
} from "@/store/pdf-analysis-files"

export interface PdfAnalysisFile {
  filename: string
  size: number
  storage_path: string
  metadata: unknown
}

type UsePdfAnalysisFiles = (boardId?: number | null) => void

export const fetchPdfAnalysisFilesData = (
  updatePdfAnalysisFilesStore: UpdatePdfAnalysisFilesStore,
  boardId: number,
) => {
  const raw = window.localStorage.getItem("userInfo")
  let userId: string | null = null
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      userId = parsed.userId
    } catch {
      // invalid JSON—just ignore
    }
  }

  axios
    .get(
      `${digitalOceanBaseUrl}/organizations/${boardId}/files?user_id=${userId}`,
    )
    .then((res) => {
      const response = res.data
      if (response) {
        updatePdfAnalysisFilesStore({
          data: response,
          isLoading: false,
          error: null,
        })
      }
    })
    .catch((err) => {
      updatePdfAnalysisFilesStore({
        data: [],
        isLoading: false,
        error: err,
      })
    })
}

export const getInitialPdfAnalysisFilesState = () => ({
  isLoading: true,
  data: [],
  error: null,
})

export const usePdfAnalysisFiles: UsePdfAnalysisFiles = (boardId) => {
  const { updatePdfAnalysisFilesStore } = usePdfAnalysisFilesStore()

  useEffect(() => {
    if (boardId) {
      fetchPdfAnalysisFilesData(updatePdfAnalysisFilesStore, boardId)
    }
  }, [boardId])
}
