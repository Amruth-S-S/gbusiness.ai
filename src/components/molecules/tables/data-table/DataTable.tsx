"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  type ExpandedState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table"

import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { FilterColumn } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DataTableToolbar } from "./DataTableToolbar"
import { DataTablePagination } from "./DataTablePagination"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    addSubRows: (rowIndex: number, columnId: string, value: any) => void
    updateSubRowData: (
      rowIndex: number,
      columnId: string,
      value: unknown,
    ) => void
    removeSubRow: (subRowIndex: number) => void
    removeRow: (rowIndex: number) => void
    removeSelectedRows: (selectedRows: number[]) => void
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  subRowColumns?: any
  data: TData[]
  filterInputPlaceholder?: string
  filterColumnValue?: string
  filterColumns?: FilterColumn[]
  showRowsSelectedText?: boolean
  onActionBtnClick?: () => void
  actionBtnLabel?: string
  actionBtnIcon?: React.ReactElement
  setData?: (update: (prevData: TData[]) => TData[]) => void
  onSecondaryActionBtnClick?: () => void
  secondaryActionBtnIcon?: React.ReactElement
  secondaryActionBtnLabel?: string
  hideViewOptions?: boolean
  tBodyWrapperClassName?: string
  hidePagination?: boolean
  hideToolbar?: boolean
  tableWrapperClassName?: string
  isCustomSubRows?: boolean
  wrapperClassName?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterInputPlaceholder,
  filterColumnValue,
  filterColumns,
  showRowsSelectedText,
  subRowColumns,
  onActionBtnClick,
  actionBtnLabel,
  actionBtnIcon,
  setData,
  onSecondaryActionBtnClick,
  secondaryActionBtnIcon,
  secondaryActionBtnLabel,
  hideViewOptions,
  tBodyWrapperClassName,
  hidePagination,
  hideToolbar,
  tableWrapperClassName,
  isCustomSubRows,
  wrapperClassName,
}: DataTableProps<TData, TValue>) {
  // Helper function to translate strings
  const translateIfString = (value: any) =>
    typeof value === "string" ? <Translate>{value}</Translate> : value

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
      pagination: { pageSize: data.length, pageIndex: 0 },
    },
    paginateExpandedRows: false,
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getSubRows: (row: any) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        if (setData) {
          setData((prev) =>
            prev?.map((row: TData, index: number) => {
              if (index === rowIndex) {
                return {
                  ...prev[rowIndex]!,
                  [columnId]: Number.isNaN(value) ? value : Number(value),
                }
              }
              return row
            }),
          )
        }
      },
      updateSubRowData: (
        rowIndex: number,
        columnId: string,
        value: unknown,
      ) => {
        if (setData) {
          setData((prev) =>
            prev?.map((row: any) => {
              const updatedSubRows = row?.subRows?.map((subRow: any) => {
                if (subRow.id === rowIndex) {
                  return { ...subRow, [columnId]: value }
                }
                return subRow
              })
              return { ...row, subRows: updatedSubRows }
            }),
          )
        }
      },
      addSubRows: (rowIndex: number, columnId: string, value: any) => {
        if (setData) {
          setData((prev) =>
            prev?.map((row: any, index: number) => {
              if (index === rowIndex) {
                return {
                  ...prev[rowIndex]!,
                  [columnId]: [...row[columnId], value],
                }
              }
              return row
            }),
          )
        }
      },
      removeSubRow: (subRowIndex: number) => {
        if (setData) {
          setData((prev) =>
            prev?.map((row: any) => {
              const updatedSubRows = row.subRows.filter(
                (subRow: any) => subRow.id !== subRowIndex,
              )
              if (updatedSubRows.length !== row.subRows.length) {
                return { ...row, subRows: updatedSubRows }
              }
              return row
            }),
          )
        }
      },
      removeRow: (rowIndex: number) => {
        if (setData) {
          setData((prev: any) => prev.filter((row: any) => row.id !== rowIndex))
        }
      },
      removeSelectedRows: (selectedRows: number[]) => {
        if (setData) {
          setData((prev: TData[]) =>
            prev.filter(
              (_row: TData, index: number) => !selectedRows.includes(index),
            ),
          )
        }
      },
    },
  })

  return (
    <>
      {!hideToolbar && (
        <DataTableToolbar
          table={table}
          filterColumnValue={filterColumnValue}
          filterInputPlaceholder={translateIfString(filterInputPlaceholder)}
          filterColumns={filterColumns}
          onActionBtnClick={onActionBtnClick}
          actionBtnIcon={actionBtnIcon}
          actionBtnLabel={translateIfString(actionBtnLabel)}
          onSecondaryActionBtnClick={onSecondaryActionBtnClick}
          secondaryActionBtnIcon={secondaryActionBtnIcon}
          secondaryActionBtnLabel={translateIfString(secondaryActionBtnLabel)}
          hideViewOptions={hideViewOptions}
        />
      )}

      <Table
        className={cn("", tableWrapperClassName)}
        // wrapperClassName={wrapperClassName}
      >
        <TableHeader className="sticky top-0 z-10 table table-fixed bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="table w-full table-fixed">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    width: !Number.isNaN(header.getSize())
                      ? header.getSize()
                      : "auto",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          className={cn(
            "table w-full table-fixed overflow-y-auto",
            tBodyWrapperClassName,
          )}
        >
          {(isCustomSubRows ? table.getCoreRowModel() : table.getRowModel())
            .rows.length ? (
            (isCustomSubRows
              ? table.getCoreRowModel()
              : table.getRowModel()
            ).rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="table w-full table-fixed"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: !Number.isNaN(cell.column.getSize())
                          ? cell.column.getSize()
                          : "auto",
                      }}
                      className="truncate"
                      title={
                        typeof cell.getValue() === "string"
                          ? (cell.getValue() as string)
                          : ""
                      }
                    >
                      {typeof cell.getValue() === "string" ? (
                        <Translate>{cell.getValue() as string}</Translate>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>

                {row.getIsExpanded() &&
                  subRowColumns &&
                  isCustomSubRows &&
                  row.originalSubRows && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        <DataTable
                          columns={subRowColumns}
                          data={row.originalSubRows}
                          setData={setData}
                          hideViewOptions
                          hidePagination
                          hideToolbar
                          wrapperClassName="rounded-none"
                        />
                      </TableCell>
                    </TableRow>
                  )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Translate>No results.</Translate>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!hidePagination && (
        <DataTablePagination
          table={table}
          showRowsSelectedText={showRowsSelectedText}
        />
      )}
    </>
  )
}
