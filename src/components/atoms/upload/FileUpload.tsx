import React, { ChangeEvent, useRef } from "react"
import { MdUploadFile } from "react-icons/md"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  classNameWrapper?: string
  className?: string
  dropMessage: string
  handleOnDrop: (acceptedFiles: FileList | null) => void
}

const FileUpload = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    { classNameWrapper, dropMessage, handleOnDrop, accept, disabled, ...props },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    // Function to handle drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }

    // Function to handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer.files.length > 0) {
        handleOnDrop(e.dataTransfer.files)
      }
    }

    // Function to handle file selection manually
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      handleOnDrop(e.target.files)
    }

    // Function to simulate a click on the file input element
    const handleButtonClick = () => {
      inputRef.current?.click()
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "mb-4 border-2 border-dashed bg-muted",
          !disabled && "hover:cursor-pointer hover:border-muted-foreground/50",
          classNameWrapper,
        )}
      >
        <CardContent
          className="flex flex-col items-center justify-center gap-2 px-2 py-4 text-xs"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center gap-5 pb-5 text-muted-foreground">
            <MdUploadFile size={48} />
            <span className="text-center text-base">
              <Translate>{dropMessage}</Translate>
            </span>
            <Input
              {...props}
              value={undefined}
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
              accept={accept}
            />
          </div>
        </CardContent>
      </Card>
    )
  },
)

export default FileUpload
