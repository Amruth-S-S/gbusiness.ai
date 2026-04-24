import { useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { X } from "lucide-react"
import FileUpload from "@/components/atoms/upload/FileUpload"
import { useModalContext } from "@/contexts/modal-context"
import { closeModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { post } from "@/services/utils"

export function AnalysisDMTFileUpload() {
  const { modalState, setModalState } = useModalContext()
  const { id } = modalState.data as { id: number }

  const dateObj = new Date()
  const month = dateObj.getUTCMonth() + 1
  const year = dateObj.getUTCFullYear()

  const { unlockScroll } = useScrollLock()
  const [monthYear, setMonthYear] = useState(
    `${year}-${String(month).padStart(2, "0")}`,
  )

  const [files, setFiles] = useState<FileList | null>(null)

  const handleDrop = (uploadedFiles: FileList) => {
    setFiles(uploadedFiles)
  }

  const handleFileUploadDrop = (acceptedFiles: FileList | null) => {
    if (acceptedFiles !== null) {
      handleDrop(acceptedFiles)
    }
  }

  const removeFile = () => {
    setFiles(null)
  }

  const uploadBtnClickHandler = () => {
    if (files) {
      const formData = new FormData()
      formData.set("file", files[0])
      const [selectedYear, selectedMonth] = monthYear.split("-")
      formData.append("month_year", `${selectedMonth}${selectedYear}`)
      if (id) {
        post(
          `/main-boards/boards/data-management-table/status/upload/${id}`,
          formData,
        ).then(() => closeModal(setModalState, unlockScroll, true))
      }
    }
  }

  return (
    <div className="mb-5 mt-4 space-y-2 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Label>
          <Translate>Select Month Year:</Translate>
        </Label>
        <Input
          type="month"
          className="w-fit"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
        />
      </div>

      {files ? (
        <div className="flex items-center justify-between rounded border border-gray-300 p-3">
          <span className="truncate">{files[0].name}</span>
          <button
            onClick={removeFile}
            className="ml-4 rounded p-1 hover:bg-gray-100"
            aria-label="Remove file"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-2">
          <FileUpload
            dropMessage="Click or drag file to this area to upload"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            handleOnDrop={handleFileUploadDrop}
            classNameWrapper="mb-0"
          />
          <Label className="text-center font-medium text-gray-500">
            <Translate>Upload csv file with less than 50Mb size</Translate>
          </Label>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={uploadBtnClickHandler}
          className="mt-2 w-fit"
          disabled={!files}
        >
          <Translate>Upload</Translate>
        </Button>
      </div>
    </div>
  )
}
