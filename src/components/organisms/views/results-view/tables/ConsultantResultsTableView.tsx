import { useEffect, useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  Column,
  Row,
  SimpleTable,
} from "@/components/molecules/tables/SimpleTable"
import { Button } from "@/components/ui/button"
import { downloadExcel } from "@/lib/utils"
import type { Table } from "@/lib/types"

type ResultsTableViewProps = {
  table?: Table | null
}

export function ConsultantResultsTableView({ table }: ResultsTableViewProps) {
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
    <div className="mx-6 my-5 max-h-full overflow-y-auto rounded-lg bg-white text-black sm:mx-12 lg:mx-24">
      {!!rows.length && !!columns.length && (
        <>
          <SimpleTable rows={rows} columns={columns} />
          <Button
            onClick={() => downloadExcel(rows, columns)}
            disableAnimation
            className="float-end my-5 mr-5"
          >
            <Translate>Download as excel</Translate>
          </Button>
        </>
      )}
    </div>
  )
}
