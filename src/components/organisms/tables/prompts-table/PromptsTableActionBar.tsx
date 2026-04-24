"use client"

import type { Table } from "@tanstack/react-table"
import { Download } from "lucide-react"
import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { exportTableToCSV } from "@/lib/export"
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "../data-table/DataTableActionBar"
import type { Prompt } from "@/services"

const actions = ["export"] as const

type Action = (typeof actions)[number]

interface PromptsTableActionBarProps {
  table: Table<Prompt>
}

export function PromptsTableActionBar({ table }: PromptsTableActionBarProps) {
  const { rows } = table.getFilteredSelectedRowModel()
  const [isPending, startTransition] = React.useTransition()
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null)

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  )

  const onPromptsExport = React.useCallback(() => {
    setCurrentAction("export")
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      })
    })
  }, [table])

  //   const onPromptsDelete = React.useCallback(() => {
  //     setCurrentAction("delete")
  //     startTransition(async () => {
  //       rows.forEach((row) => {
  //         deletePromptById(row.original.id).then(() => {
  //           //   fetchPrompts(apiKey, boardId)
  //         })
  //       })
  //       table.toggleAllRowsSelected(false)
  //     })
  //   }, [rows, table])

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Export tasks"
          isPending={getIsActionPending("export")}
          onClick={onPromptsExport}
        >
          <Download />
        </DataTableActionBarAction>
        {/* <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          isPending={getIsActionPending("delete")}
          onClick={onPromptsDelete}
        >
          <Trash2 />
        </DataTableActionBarAction> */}
      </div>
    </DataTableActionBar>
  )
}
