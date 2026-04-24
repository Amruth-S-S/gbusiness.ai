import { useState } from "react"
import toast from "react-hot-toast"
import { FaRedo } from "react-icons/fa"
import { Translate } from "gbusiness-ai-react-auto-translate"
import axios from "axios"
import FileUpload from "@/components/atoms/upload/FileUpload"
import { Label } from "@/components/ui/label"
import { digitalOceanBaseUrl } from "@/lib/constants"
import { closeModal } from "@/hooks/use-modal"
import { useModalContext } from "@/contexts/modal-context"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { Heading, Paragraph } from "@/components/atoms/texts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchPdfAnalysisFilesData } from "@/hooks/use-pdf-analysis-files"
import { formatFileSize } from "@/lib/utils"
import { usePdfAnalysisFilesStore } from "@/store/pdf-analysis-files"
import { useBoardsStore } from "@/store/boards"

export function RagFileUpload() {
  const { selectedBoard } = useBoardsStore()
  const { setModalState } = useModalContext()
  const { unlockScroll } = useScrollLock()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const boardId = selectedBoard?.id ?? null

  const uploadBtnClickHandler = (files: FileList) => {
    setUploadedFile(files[0])
  }

  const handleFileUploadDrop = (acceptedFiles: FileList | null) => {
    if (acceptedFiles !== null) {
      uploadBtnClickHandler(acceptedFiles)
    }
  }
  const { updatePdfAnalysisFilesStore } = usePdfAnalysisFilesStore()

  const showLoader = (show: boolean) => {
    const element = document.getElementById("circles-with-bar-loader")
    if (element) {
      element.style.display = show ? "flex" : "none"
    }
  }

  const uploadFile = async () => {
    if (uploadedFile && boardId) {
      showLoader(true)
      setIsLoading(true)
      const formData = new FormData()
      formData.set("file", uploadedFile)
      formData.append("collection_id", boardId.toString())
      const url = new URL("/submit-job", digitalOceanBaseUrl)
      axios
        .post(url.href, formData)
        .then((res) => {
          if (res.data) {
            toast.success("Uploaded successfully")
            fetchPdfAnalysisFilesData(updatePdfAnalysisFilesStore, boardId)
          }
          closeModal(setModalState, unlockScroll)
        })
        .finally(() => {
          setIsLoading(false)
          showLoader(false)
        })
    }
  }

  return (
    <div className="space-y-2 px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex flex-col justify-center items-center gap-2">
        {!uploadedFile ? (
          <>
            <FileUpload
              dropMessage="Click or drag file to this area to upload"
              accept=".pdf"
              handleOnDrop={handleFileUploadDrop}
              classNameWrapper="mb-0"
              disabled={isLoading}
            />
            <Label className="text-center font-medium text-gray-500">
              <Translate>Upload PDF file with less than 25Mb size</Translate>
            </Label>
          </>
        ) : (
          <>
            <Card className="w-full px-4 py-3 flex justify-between">
              <div>
                <Heading
                  text={uploadedFile.name}
                  type="h4"
                  className="text-base"
                />
                <Paragraph
                  text={formatFileSize(uploadedFile.size)}
                  className="text-xs text-gray-600"
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  setUploadedFile(null)
                }}
              >
                <FaRedo />
              </Button>
            </Card>
            <Button className="self-end mt-3" onClick={uploadFile}>
              <Translate>Upload</Translate>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
