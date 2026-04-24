import { useEffect, useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  Column,
  Row,
  SimpleTable,
} from "@/components/molecules/tables/SimpleTable"
import { Table } from "@/lib/types"
import { reactElementToString } from "@/lib/utils"

type ActualForecastTableProps = {
  table?: Table | null
}

export function ActualVsForecastTable({ table }: ActualForecastTableProps) {
  const [rows, setRows] = useState<Row[]>([])
  const [columns, setColumns] = useState<Column[]>([])

  useEffect(() => {
    if (table) {
      const tempRows: Row[] = []
      table.data?.forEach((data: any) => {
        tempRows.push({
          cells: data?.map((cell: string | number) => ({
            cellValue: <Translate>{cell.toString()}</Translate>,
            cellClassName: "",
          })),
          rowClassName: "",
        })
      })
      setRows(tempRows)

      const tempColumns: Column[] = []
      table.columns?.forEach((column) => {
        tempColumns.push({
          columnName: reactElementToString(
            <Translate>{column.toString()}</Translate>,
          ),
          columnClassName: "w-[200px]",
        })
      })
      setColumns(tempColumns)
    }
  }, [table])

  return <SimpleTable rows={rows} columns={columns} />
}
