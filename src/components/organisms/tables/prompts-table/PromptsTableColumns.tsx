import type { ColumnDef, FilterFn } from "@tanstack/react-table"
import { CalendarIcon, Edit, Play, Text, Trash2 } from "lucide-react"
import { format } from "date-fns"
import React from "react"
import { Button } from "@/components/ui/button"
import type { DataTableRowAction } from "@/types/data-table"
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader"
import { Prompt } from "@/services"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const dateRangeFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true

  const rowDate = new Date(row.getValue(columnId)).getTime()

  if (Array.isArray(filterValue)) {
    let [from, to] = filterValue

    from = new Date(from).setHours(0, 0, 0, 0)
    to = new Date(to).setHours(23, 59, 59, 999)

    return rowDate >= from && rowDate <= to
  }

  if (typeof filterValue === "number") {
    const start = new Date(filterValue).setHours(0, 0, 0, 0)
    const end = new Date(filterValue).setHours(23, 59, 59, 999)
    return rowDate >= start && rowDate <= end
  }

  return true
}

interface GetPromptsTableColumnsProps {
  onRun: (prompt: Prompt) => void
  onEdit: (prompt: Prompt) => void
  onDelete: (prompt: Prompt) => void
  isPromptManagementDisabled?: boolean
}

export function getPromptsTableColumns({
  onRun,
  onEdit,
  onDelete,
  isPromptManagementDisabled,
}: GetPromptsTableColumnsProps): ColumnDef<Prompt>[] {
  return [
    {
      id: "prompt_text",
      accessorKey: "prompt_text",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prompt Text" />
      ),
      cell: ({ row }) => {
        const text = row.getValue("prompt_text") as string
        const isMobile =
          typeof window !== "undefined" && window.innerWidth < 768

        if (isMobile) {
          return (
            <Dialog>
              <DialogTrigger asChild>
                <span className="line-clamp-2 max-w-36 text-ellipsis w-full cursor-pointer text-muted-foreground">
                  {text}
                </span>
              </DialogTrigger>
              <DialogContent className="fixed !bottom-0 !left-0 !right-0 h-[70vh] !translate-y-0 !translate-x-0 max-h-[90vh] rounded-t-2xl border-t bg-background shadow-lg">
                <DialogHeader>
                  <DialogTitle className="hidden">Prompt Text</DialogTitle>
                </DialogHeader>
                <div className="mt-2 overflow-y-auto max-h-[38vh] whitespace-pre-wrap m-4 break-words px-1 text-muted-foreground text-sm">
                  {text}
                </div>
              </DialogContent>
            </Dialog>
          )
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="line-clamp-2 text-ellipsis max-w-[400px] w-full text-muted-foreground">
                  {text}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs sm:max-w-md">
                {text}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      meta: {
        label: "Prompt Text",
        placeholder: "Filter Prompt Text",
        variant: "text",
        icon: Text,
      },
      enableHiding: false,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) =>
        format(new Date(cell.getValue<string>()), "dd MMM yyyy, hh:mm a"),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      filterFn: dateRangeFilter,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const prompt = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onRun(prompt)}
            >
              <Play className="h-4 w-4" />
            </Button>

            {!isPromptManagementDisabled && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onEdit(prompt)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => onDelete(prompt)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )
      },
      size: 100,
    },
  ]
}
