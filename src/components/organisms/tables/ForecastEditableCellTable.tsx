import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Heading } from "@/components/atoms/texts"
import { DataTable } from "@/components/molecules/tables/data-table/DataTable"
import {
  DynamicRowData,
  IndependentVariableTable,
  WeightCoefficientsTable,
} from "@/lib/types"
import { DataTableEditableCell } from "@/components/molecules/tables/data-table/DataTableEditableCell"
import { DataTableColumnHeader } from "@/components/molecules/tables/data-table/DataTableColumnHeader"
import { useForecastStore } from "@/store/forecast"
import { Separator } from "@/components/ui/separator"
import { reactElementToString } from "@/lib/utils"
import { ActualVsForecastTable } from "./ActualVsForecastTable"

type EditableCellTableProps = {
  weightCoefficients: WeightCoefficientsTable
  independentVariable: IndependentVariableTable
  id: number
}

const CustomDataTableColumnHeader = ({
  column,
}: {
  column: CellContext<any, any>["column"]
}) => (
  <DataTableColumnHeader
    column={column}
    title={column.id}
    className="min-w-[200px]"
  />
)

export function ForecastEditableCellTable({
  weightCoefficients,
  independentVariable,
  id,
}: EditableCellTableProps) {
  const { forecastResponse, updateForecastStore } = useForecastStore()
  const [independentVariableColumns, setIndependentVariableColumns] = useState<
    ColumnDef<DynamicRowData>[]
  >([])
  const [independentVariableRows, setIndependentVariableRows] = useState<any>(
    [],
  )

  const generateColumns = (
    columns: string[],
    isCellEditable?: boolean,
    editableColumns?: string[],
  ) => {
    const tempColumns: ColumnDef<DynamicRowData>[] = []
    columns.forEach((col, index) => {
      tempColumns.push({
        accessorKey: col,
        header: CustomDataTableColumnHeader,
        ...(index !== 0 &&
          editableColumns?.includes(col) &&
          isCellEditable && { cell: DataTableEditableCell }),
        enableSorting: false,
      })
    })
    return tempColumns
  }

  function generateRows(
    dataRows: Array<Array<string | number>>,
    columns: string[],
  ): { [key: string]: string | number }[] {
    return dataRows?.map((row) => {
      const obj: { [key: string]: any } = {}
      columns.forEach((column, index) => {
        obj[column] = reactElementToString(
          <Translate>{row[index].toString()}</Translate>,
        )
      })
      return obj
    })
  }

  useEffect(() => {
    setIndependentVariableColumns(
      generateColumns(
        independentVariable.columns,
        true,
        independentVariable.editable_columns,
      ),
    )
    setIndependentVariableRows(
      generateRows(independentVariable.data, independentVariable.columns),
    )
  }, [])

  useEffect(() => {
    if (forecastResponse) {
      updateForecastStore({
        forecastResponse: {
          ...forecastResponse,
          item_metadata: forecastResponse.item_metadata?.map((item, index) => {
            if (id === index) {
              return {
                ...item,
                independent_variable: {
                  table: {
                    columns: item.independent_variable.table.columns,
                    data: independentVariableRows?.map((i: DynamicRowData) =>
                      Object.values(i),
                    ),
                    editable_columns:
                      item.independent_variable.table.editable_columns,
                    title: item.independent_variable.table.title,
                  },
                },
              }
            }
            return item
          }),
        },
      })
    }
  }, [independentVariableRows])

  return (
    <div className="mb-8">
      <Heading
        text="Weight Coefficient:"
        type="h4"
        className="mb-2 pb-2 text-base font-medium"
      />
      <ActualVsForecastTable table={weightCoefficients} />
      <Separator className="my-5 bg-gray-800" />
      <Heading
        text="Independent Variable:"
        type="h4"
        className="mb-2 pb-2 text-base font-medium"
      />
      <DataTable
        columns={independentVariableColumns}
        data={independentVariableRows}
        setData={setIndependentVariableRows}
        tableWrapperClassName="rounded-md border"
        hidePagination
        hideViewOptions
      />
    </div>
  )
}
