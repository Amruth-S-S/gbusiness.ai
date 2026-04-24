import { ChangeEvent, useState } from "react"
import { CellContext, RowData } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

interface EditableCellProps<TData extends RowData, TValue = string> {
  row: any
  column: CellContext<TData, TValue>["column"]
  table: CellContext<TData, TValue>["table"]
}

export const DataTableEditableCell = <TData extends RowData, TValue>({
  row,
  column,
  table,
}: EditableCellProps<TData, TValue>) => {
  const initialValue = row.getValue(column.id) as string
  const [value, setValue] = useState(initialValue)

  const onUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    if (
      (Object.hasOwn(row.original, "name") || row.depth === 0) &&
      !Object.hasOwn(row.original, "keyName")
    ) {
      table.options.meta?.updateData(row.index, column.id, value)
    } else {
      table.options.meta?.updateSubRowData(row.original.id, column.id, value)
    }
  }

  return (
    <Input
      value={value}
      onChange={onUpdate}
      onBlur={onBlur}
      disabled={row.original?.isDisabled}
      className="bg-gray-50"
    />
  )
}
