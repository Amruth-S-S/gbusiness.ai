import axios from "axios"
import { Translate } from "gbusiness-ai-react-auto-translate"
import toast from "react-hot-toast"
import { TbFileUpload } from "react-icons/tb"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModalContext } from "@/contexts/modal-context"
import { openModal } from "@/hooks/use-modal"
import {
  PdfAnalysisFile,
  fetchPdfAnalysisFilesData,
  usePdfAnalysisFiles,
} from "@/hooks/use-pdf-analysis-files"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { digitalOceanBaseUrl } from "@/lib/constants"
import { formatFileSize } from "@/lib/utils"
import { usePdfAnalysisFilesStore } from "@/store/pdf-analysis-files"
import { useBoardsStore } from "@/store/boards"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/organisms/tables/data-table/DataTable"

export function UploadDocumentsView() {
  const { setModalState } = useModalContext()
  const { lockScroll } = useScrollLock()

  const { selectedBoard } = useBoardsStore()
  const boardId = selectedBoard?.id
  usePdfAnalysisFiles(boardId)
  const { data, updatePdfAnalysisFilesStore } = usePdfAnalysisFilesStore()

  const deleteClickHandler = (file: PdfAnalysisFile) => {
    if (boardId) {
      axios
        .delete(
          `${digitalOceanBaseUrl}/organizations/${boardId}/files/${file.filename}`,
        )
        .then(() => {
          fetchPdfAnalysisFilesData(updatePdfAnalysisFilesStore, boardId)
          toast.success("File deleted successfully")
        })
        .catch(() => toast.error("Something went wrong"))
    }
  }

  const columns: ColumnDef<PdfAnalysisFile>[] = [
    {
      accessorKey: "filename",
      header: "Filename",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("filename")}</div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatFileSize(row.getValue("size"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteClickHandler(row.original)}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col space-y-4">
      <Button
        onClick={() =>
          openModal(setModalState, lockScroll, {
            modalState: {
              isOpen: true,
              isActive: true,
              contentName: "VIEW__RAG_FILE_UPLOAD",
              heading: "Upload file",
            },
          })
        }
        className="gap-2 w-fit ml-auto"
      >
        <Translate>Upload Document</Translate>
        <TbFileUpload size={18} className="flex-shrink-0 text-white" />
      </Button>
      <DataTable columns={columns} data={data} className="max-h-[75vh]" />
    </div>
  )
}
