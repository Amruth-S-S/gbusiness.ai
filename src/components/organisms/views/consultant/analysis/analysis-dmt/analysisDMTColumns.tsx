"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MdDelete, MdEdit } from "react-icons/md"
import { TbFileUpload } from "react-icons/tb"
import { HiChevronDown, HiChevronUp } from "react-icons/hi"
import { useState } from "react"
import toast from "react-hot-toast"
import { DataTableColumnHeader } from "@/components/molecules/tables/data-table/DataTableColumnHeader"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { closeModal, openModal } from "@/hooks/use-modal"
import { useModalContext } from "@/contexts/modal-context"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { AlertModal } from "@/components/molecules/modal/AlertModal"
import { put, remove } from "@/services/utils"
import { useMiddlePaneStore } from "@/store/middle-pane"

export interface AnalysisDMTSubRowsColumnData {
  id: number
  monthYear: string
  approved: boolean
  fileName: string
  updatedAt: string
}

export interface AnalysisDMTColumnData {
  id: number
  tableName: string
  tableDescription: string
  approved: boolean
  subRows: AnalysisDMTSubRowsColumnData[]
}

export const analysisDMTColumns = (): ColumnDef<
  AnalysisDMTColumnData,
  unknown
>[] => {
  const { setModalState } = useModalContext()
  const { lockScroll } = useScrollLock()
  const [selectedTable, setSelectedTable] = useState<number | null | undefined>(
    null,
  )
  const fetchData = useMiddlePaneStore((state) => state.fetchData)

  const alertActionBtnClickHandler = async () => {
    try {
      if (selectedTable) {
        const { data, errRes } = (await remove(
          "/main-boards/boards/data-management-table",
          selectedTable,
        )) as any
        if (data) {
          setSelectedTable(null)
          fetchData("dataManagementTables", "data-management-table")
        }
        if (errRes) {
          toast.error(
            Object.hasOwn(errRes, "detail")
              ? errRes.detail
              : "Something went wrong",
            {
              position: "top-right",
            },
          )
        }
      }
    } catch (error) {
      if (error && typeof error === "object") {
        toast.error("Something went wrong")
      }
    }
  }

  return [
    {
      accessorKey: "tableName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Table Name"
          className="min-w-[200px]"
        />
      ),
    },
    {
      accessorKey: "tableDescription",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Table Description"
          className="min-w-[500px]"
        />
      ),
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Actions"
          className="pl-4"
        />
      ),
      size: "auto" as unknown as number,
      cell: ({ row }) => (
        <div className="flex items-center gap-x-1">
          <Button
            variant="destructive"
            onClick={() =>
              openModal(setModalState, lockScroll, {
                modalState: {
                  isOpen: true,
                  isActive: true,
                  contentName: "VIEW__ANALYSIS_DMT_FILE_UPLOAD",
                  heading: "Upload file",
                  data: {
                    id: row.original.id,
                  },
                },
              })
            }
          >
            <TbFileUpload size={18} className="flex-shrink-0 text-gray-500" />
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              openModal(setModalState, lockScroll, {
                modalState: {
                  isOpen: true,
                  isActive: true,
                  contentName: "FORM__ANALYSIS_DMT",
                  heading: "Edit Table",
                  data: {
                    id: row.original.id,
                    tableName: row.original.tableName,
                    tableDescription: row.original.tableDescription,
                  },
                },
              })
            }
          >
            <MdEdit size={18} className="flex-shrink-0 text-blue-500" />
          </Button>
          <Button
            variant="destructive"
            onClick={() => setSelectedTable(row.original.id)}
          >
            <MdDelete size={18} className="flex-shrink-0 text-red-500" />
          </Button>

          {row.getCanExpand() && (
            <Button variant="destructive" onClick={() => row.toggleExpanded()}>
              {row.getIsExpanded() ? (
                <HiChevronUp size={20} />
              ) : (
                <HiChevronDown size={20} />
              )}
            </Button>
          )}
          <AlertModal
            isOpen={!!selectedTable}
            onCancelClick={() => setSelectedTable(null)}
            onActionClick={alertActionBtnClickHandler}
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete table and its data"
          />
        </div>
      ),
    },
  ]
}

export interface AnalysisDMTSubRowsColumnData extends AnalysisDMTColumnData {
  monthYear: string
  fileName: string
}

export const analysisDMTSubRowColumns = (): ColumnDef<
  AnalysisDMTSubRowsColumnData,
  unknown
>[] => {
  const { unlockScroll } = useScrollLock()
  const { setModalState } = useModalContext()
  const { fetchData } = useMiddlePaneStore()

  return [
    {
      accessorKey: "monthYear",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Month Year"
          className="pl-4"
        />
      ),
    },
    {
      accessorKey: "fileName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="File Name"
          className="pl-4"
        />
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Uploaded On"
          className="pl-4"
        />
      ),
    },
    {
      accessorKey: "approved",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          className="pl-4"
        />
      ),
      cell: ({ row }) => (
        <Switch
          id="airplane-mode"
          className="ml-5"
          checked={!!row.original.approved}
          disabled={!!row.original.approved}
          onClick={() =>
            put(
              `/main-boards/boards/data-management-table/status/approve/${row.original.id}?new_approval_status=${true}`,
            ).then(() => {
              fetchData("dataManagementTables", "data-management-table")
              toast.success("Approved successfuly")
              closeModal(setModalState, unlockScroll, true)
            })
          }
        />
      ),
    },
  ]
}
