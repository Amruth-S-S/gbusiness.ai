import { useMemo } from "react"
import type { Prompt } from "@/services"
import { usePromptsStore } from "@/store/prompts"
import { DataTable } from "../data-table/DataTable"
import { getPromptsTableColumns } from "./PromptsTableColumns"

type PromptsTableProps = {
  onNewBtnClick?: () => void
  onRun: (prompt: Prompt) => void
  onEdit: (prompt: Prompt) => void
  onDelete: (prompt: Prompt) => void
  isPromptManagementDisabled?: boolean
}

export function PromptsTable({
  onNewBtnClick,
  onRun,
  onEdit,
  onDelete,
  isPromptManagementDisabled,
}: PromptsTableProps) {
  const { data: promptsData } = usePromptsStore()

  const columns = useMemo(
    () =>
      getPromptsTableColumns({
        onRun,
        onEdit,
        onDelete,
        isPromptManagementDisabled,
      }),
    [onRun, onEdit, onDelete],
  )

  return (
    <DataTable
      className="w-full"
      data={promptsData}
      columns={columns}
      enableRowSelection={false}
      onNewBtnClick={onNewBtnClick}
    />
  )
}
