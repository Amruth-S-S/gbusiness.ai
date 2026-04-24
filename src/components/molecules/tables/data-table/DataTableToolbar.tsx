"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { HiPlus } from "react-icons/hi"
import { ReactElement } from "react"
import { MdSave } from "react-icons/md"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FilterColumn } from "@/lib/types"
import { DataTableViewOptions } from "./DataTableViewOptions"
import { DataTableFacetedFilter } from "./DataTableFacetedFilter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumns?: FilterColumn[]
  filterInputPlaceholder?: string
  filterColumnValue?: string
  onActionBtnClick?: () => void
  actionBtnLabel?: string
  actionBtnIcon?: ReactElement
  onSecondaryActionBtnClick?: () => void
  secondaryActionBtnIcon?: ReactElement
  secondaryActionBtnLabel?: string
  hideViewOptions?: boolean
}

export function DataTableToolbar<TData>({
  table,
  filterColumns,
  filterInputPlaceholder,
  filterColumnValue,
  onActionBtnClick,
  actionBtnLabel = "New",
  actionBtnIcon,
  onSecondaryActionBtnClick,
  secondaryActionBtnIcon,
  secondaryActionBtnLabel = "Save",
  hideViewOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        {filterColumnValue && (
          <Input
            placeholder={filterInputPlaceholder}
            value={
              (table
                .getColumn(filterColumnValue)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filterColumnValue)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {!!filterColumns &&
          filterColumns?.map(({ label, options, value }) => {
            const column = table.getColumn(value)
            return (
              column && (
                <DataTableFacetedFilter
                  column={column}
                  title={label}
                  options={options}
                />
              )
            )
          })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {!hideViewOptions && <DataTableViewOptions table={table} />}
      {onActionBtnClick && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-x-2"
          onClick={onActionBtnClick}
        >
          {actionBtnIcon ?? <HiPlus />}
          <Translate>{actionBtnLabel}</Translate>
        </Button>
      )}
      {onSecondaryActionBtnClick && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-x-2"
          onClick={onSecondaryActionBtnClick}
        >
          {secondaryActionBtnIcon ?? <MdSave />}
          {secondaryActionBtnLabel}
        </Button>
      )}
    </div>
  )
}
