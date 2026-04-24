/* eslint-disable react/no-array-index-key */
import clsx from "clsx"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type Column = {
  columnName: string
  columnClassName: string
}

export type Cell = {
  cellClassName: string
  cellValue: string | number
}

export type Row = {
  cells: Cell[]
  rowClassName: string
}

type SimpleTableProps = {
  tableCaption?: string
  columns: Column[]
  rows: Row[]
}

export function SimpleTable({ tableCaption, columns, rows }: SimpleTableProps) {
  return (
    <Table
      className="w-full table-fixed border"
      // wrapperClassName="max-h-[440px]"
    >
      {!!tableCaption && <TableCaption>{tableCaption}</TableCaption>}
      <TableHeader
        className={clsx("sticky top-0 z-10 rounded-t-lg bg-gray-300")}
      >
        <TableRow className="table-row rounded-t-lg hover:bg-inherit">
          {columns?.map(({ columnName, columnClassName }, index) => (
            <TableHead
              className={cn(
                "table-cell w-auto !rounded-b-none text-black first:rounded-l-lg last:rounded-r-lg",
                columnClassName,
              )}
              key={columnName + index}
              title={columnName}
            >
              <p className="line-clamp-3">{columnName}</p>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="!table-row-group bg-white">
        {rows?.map(({ cells, rowClassName }, rowIndex) => (
          <TableRow
            className={cn(rowClassName, "table-row w-full")}
            key={rowIndex}
          >
            {cells?.map(({ cellValue, cellClassName }, cellIndex) => (
              <TableCell
                className={cn(
                  cellClassName,
                  "table-cell w-auto whitespace-break-spaces",
                )}
                key={cellValue.toString() + cellIndex}
                title={cellValue.toString()}
              >
                <p className="line-clamp-3">{cellValue}</p>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
