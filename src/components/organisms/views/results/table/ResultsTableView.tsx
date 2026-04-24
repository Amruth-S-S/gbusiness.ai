import { useEffect, useState } from "react"
import {
  Column,
  Row,
  SimpleTable,
} from "@/components/molecules/tables/SimpleTable"
import type { Table } from "@/lib/types"

type ResultsTableViewProps = {
  table?: Table | null
}

export function ResultsTableView({ table }: ResultsTableViewProps) {
  const [rows, setRows] = useState<Row[]>([])
  const [columns, setColumns] = useState<Column[]>([])

  useEffect(() => {
    if (table) {
      const tempRows: Row[] = []
      table.data?.forEach((data: any) => {
        tempRows.push({
          cells: data?.map((cell: string) => ({
            cellValue: cell,
            cellClassName: "",
          })),
          rowClassName: "",
        })
      })
      setRows(tempRows)

      const tempColumns: Column[] = []
      table.columns?.forEach((column) => {
        tempColumns.push({
          columnName: column,
          columnClassName: "w-[200px]",
        })
      })
      setColumns(tempColumns)
    }
  }, [table])

  return (
    <div className="mx-6 my-5 h-full overflow-y-auto sm:mx-6 lg:mx-8">
      {!!rows.length && !!columns.length && (
        <div className="flex flex-col">
          <SimpleTable rows={rows} columns={columns} />
        </div>
      )}
    </div>
  )
}
