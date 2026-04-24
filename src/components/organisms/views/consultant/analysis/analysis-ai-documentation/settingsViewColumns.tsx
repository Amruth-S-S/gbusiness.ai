"use client"

import { ColumnDef, Table } from "@tanstack/react-table"
import { MdDelete, MdEdit, MdOutlineCheck, MdSave } from "react-icons/md"
import { useState } from "react"
import { HiChevronDown, HiChevronUp, HiPlus } from "react-icons/hi"
import toast from "react-hot-toast"
import { DataTableColumnHeader } from "@/components/molecules/tables/data-table/DataTableColumnHeader"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/molecules/modal/AlertModal"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableEditableCell } from "@/components/molecules/tables/data-table/DataTableEditableCell"
import { post, put, remove } from "@/services/utils"
import { TabKey } from "@/lib/types"
import { useMiddlePaneStore } from "@/store/middle-pane"

export interface SettingsSubColumnData {
  id: number
  keyName: string
  valueName: string
  isDisabled: boolean
  board_id?: number
}

export interface SettingsColumnData {
  id?: number
  board_id?: number
  name: string
  isDisabled: boolean
  subRows?: SettingsSubColumnData[]
}

type AccumulatorType = {
  [key: string]: string
}

type SelectedTable = {
  id: number | undefined
  table: Table<SettingsColumnData>
}

export const settingsColumns = (
  tabName: TabKey,
  apiKey: string,
  hideDeleteBtn?: boolean,
  hideAddBtn?: boolean,
): ColumnDef<SettingsColumnData>[] => {
  const [selectedTable, setSelectedTable] = useState<SelectedTable | null>(null)
  // ↓ Use Zustand instead of context:
  const { fetchData } = useMiddlePaneStore()

  const alertActionBtnClickHandler = async () => {
    if (selectedTable?.id && selectedTable.id.toString().length < 10) {
      remove(`/main-boards/boards/${apiKey}`, selectedTable.id).then(() =>
        fetchData(tabName, apiKey),
      )
    } else if (selectedTable?.id) {
      selectedTable?.table.options.meta?.removeRow(selectedTable.id)
      setSelectedTable(null)
    }
  }

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
          className="min-w-[200px]"
        />
      ),
      cell: DataTableEditableCell,
      enableSorting: false,
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
      cell: ({ row, table }) => (
        <div className="flex items-center gap-x-1">
          <Button
            variant="destructive"
            onClick={() => {
              table.options.meta?.updateData(
                row.index,
                "isDisabled",
                !row.original.isDisabled,
              )
              if (
                row.original.name &&
                !row.original.isDisabled &&
                row.original.id?.toString() &&
                row.original.id?.toString().length < 10
              ) {
                put(`/main-boards/boards/${apiKey}/${row.original.id}`, {
                  board_id: row.original.board_id,
                  configuration_details: JSON.stringify(
                    row.original.subRows?.reduce(
                      (acc: AccumulatorType, obj) => {
                        acc[obj.keyName] = obj.valueName
                        return acc
                      },
                      {},
                    ),
                  ),
                  name: row.original.name,
                }).then(() => fetchData(tabName, apiKey))
              }
            }}
            title={
              row.original.isDisabled
                ? "Edit Setting Name"
                : "Update Setting Name"
            }
          >
            {row.original.isDisabled ? (
              <MdEdit size={18} className="flex-shrink-0 text-blue-500" />
            ) : (
              <MdOutlineCheck
                size={18}
                className="flex-shrink-0 text-primary"
              />
            )}
          </Button>
          {!hideDeleteBtn && (
            <Button
              variant="destructive"
              onClick={() => setSelectedTable({ id: row.original.id, table })}
              title="Delete Setting Name"
            >
              <MdDelete size={18} className="flex-shrink-0 text-red-500" />
            </Button>
          )}
          {!hideAddBtn && (
            <Button
              variant="destructive"
              onClick={() => {
                table.options.meta?.addSubRows(row.index, "subRows", {
                  id: new Date().getTime(),
                  isDisabled: true,
                  keyName: "",
                  valueName: "",
                })
              }}
              title="Add Setting"
            >
              <HiPlus size={18} className="flex-shrink-0 text-primary" />
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => {
              if (
                row.original.name &&
                row.original.subRows?.filter(
                  (subRow) => subRow.keyName && subRow.valueName,
                ).length
              ) {
                if (
                  row.original.id?.toString() &&
                  row.original.id?.toString().length > 10
                ) {
                  post(`/main-boards/boards/${apiKey}/`, {
                    board_id: row.original.board_id,
                    configuration_details: JSON.stringify(
                      row.original.subRows?.reduce(
                        (acc: AccumulatorType, obj) => {
                          acc[obj.keyName] = obj.valueName
                          return acc
                        },
                        {},
                      ),
                    ),
                    name: row.original.name,
                  }).then(() => fetchData(tabName, apiKey))
                } else {
                  put(`/main-boards/boards/${apiKey}/${row.original.id}`, {
                    board_id: row.original.board_id,
                    configuration_details: JSON.stringify(
                      row.original.subRows?.reduce(
                        (acc: AccumulatorType, obj) => {
                          acc[obj.keyName] = obj.valueName
                          return acc
                        },
                        {},
                      ),
                    ),
                    name: row.original.name,
                  }).then(() => fetchData(tabName, apiKey))
                }
              } else {
                toast.success("Please fill all the fields", {
                  style: {
                    border: "1px solid #713200",
                    padding: "16px",
                    color: "#713200",
                  },
                  iconTheme: {
                    primary: "#713200",
                    secondary: "#FFFAEE",
                  },
                  position: "top-right",
                })
              }
            }}
            title="Save Setting"
          >
            <MdSave size={18} className="flex-shrink-0 text-green-600" />
          </Button>
          {row.getCanExpand() && (
            <Button
              variant="destructive"
              onClick={() => row.toggleExpanded()}
              title={row.getCanExpand() ? "Expand" : "Collapse"}
            >
              {row.getIsExpanded() ? (
                <HiChevronUp size={20} />
              ) : (
                <HiChevronDown size={20} />
              )}
            </Button>
          )}

          <AlertModal
            isOpen={!!selectedTable?.id}
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

export const settingsSubColumns = (
  hideDeleteBtn?: boolean,
): ColumnDef<SettingsSubColumnData>[] => {
  const [selectedTable, setSelectedTable] = useState<number | null | undefined>(
    null,
  )

  const alertActionBtnClickHandler = async () => {}

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="ml-3 translate-y-[2px] lg:ml-7"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="ml-3 translate-y-[2px] lg:ml-7"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 30,
    },
    {
      accessorKey: "keyName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Key"
          className="min-w-[200px]"
        />
      ),
      enableSorting: false,
      cell: DataTableEditableCell,
    },
    {
      accessorKey: "valueName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={hideDeleteBtn ? "Description" : "Value"}
          className="min-w-[500px]"
        />
      ),
      enableSorting: false,
      cell: DataTableEditableCell,
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
      cell: ({ row, table }) => (
        <div className="flex items-center gap-x-1">
          <Button
            variant="destructive"
            onClick={() =>
              setTimeout(() => {
                table.options.meta?.updateSubRowData(
                  row.original.id,
                  "isDisabled",
                  !row.original.isDisabled,
                )
              }, 100)
            }
            title={
              row.original.isDisabled
                ? "Edit Configuration"
                : "Update Configuration"
            }
          >
            {row.original.isDisabled ? (
              <MdEdit size={18} className="flex-shrink-0 text-blue-500" />
            ) : (
              <MdOutlineCheck
                size={18}
                className="flex-shrink-0 text-primary"
              />
            )}
          </Button>
          {!hideDeleteBtn && (
            <Button
              variant="destructive"
              onClick={() => table.options.meta?.removeSubRow(row.original.id)}
              title="Delete Configuration"
            >
              <MdDelete size={18} className="flex-shrink-0 text-red-500" />
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
