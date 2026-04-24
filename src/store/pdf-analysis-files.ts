import { create } from "zustand"
import { PdfAnalysisFile } from "@/hooks/use-pdf-analysis-files"

interface PdfAnalysisFilesState {
  isLoading: boolean
  error: string | null
  data: PdfAnalysisFile[]
}

export type UpdatePdfAnalysisFilesStore = (
  state: Partial<PdfAnalysisFilesState>,
) => void

interface PdfAnalysisFilesStoreActions {
  updatePdfAnalysisFilesStore: UpdatePdfAnalysisFilesStore
}

type PdfAnalysisFilesStore = PdfAnalysisFilesState &
  PdfAnalysisFilesStoreActions

const initialState: PdfAnalysisFilesState = {
  isLoading: true,
  error: null,
  data: [],
}

export const usePdfAnalysisFilesStore = create<PdfAnalysisFilesStore>(
  (set) => ({
    ...initialState,
    updatePdfAnalysisFilesStore: (state: Partial<PdfAnalysisFilesState>) => {
      set(state, false)
    },
  }),
)
