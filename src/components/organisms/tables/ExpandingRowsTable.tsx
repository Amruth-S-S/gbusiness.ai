import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { HiChevronRight, HiChevronUp } from "react-icons/hi"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { DataTable } from "@/components/molecules/tables/data-table/DataTable"
import { DataTableColumnHeader } from "@/components/molecules/tables/data-table/DataTableColumnHeader"
import { DynamicRowData } from "@/lib/types"
import { cn } from "@/lib/utils"

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

const generateColumns = (data: DynamicRowData[]) => {
  if (data.length) {
    const columns = Object.keys(data[0])
    const tempColumns: ColumnDef<DynamicRowData>[] = []
    columns.forEach((col, index) => {
      if (col !== "subRows") {
        tempColumns.push({
          accessorKey: col,
          header: CustomDataTableColumnHeader,
          enableSorting: false,
          ...(index === 0 && {
            header: ({ table }) => (
              <div className="flex items-center gap-2">
                <button
                  {...{
                    onClick: table.getToggleAllRowsExpandedHandler(),
                  }}
                >
                  {table.getIsAllRowsExpanded() ? (
                    <HiChevronUp size={20} />
                  ) : (
                    <HiChevronRight size={20} />
                  )}
                </button>{" "}
                <Translate>{col}</Translate>
              </div>
            ),
            cell: ({ row, getValue }) => (
              <div
                style={{
                  paddingLeft: `${row.depth * 2}rem`,
                }}
              >
                <div className="flex items-center gap-2">
                  {row.getCanExpand() && (
                    <button
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: { cursor: "pointer" },
                      }}
                    >
                      {row.getIsExpanded() ? (
                        <HiChevronUp size={20} />
                      ) : (
                        <HiChevronRight size={20} />
                      )}
                    </button>
                  )}{" "}
                  {getValue<boolean>()}
                </div>
              </div>
            ),
          }),
        })
      }
    })
    return tempColumns
  }
  return []
}

type ExpandingRowsTableProps = {
  hierarchyData: DynamicRowData[]
  className?: string
}

export function ExpandingRowsTable({
  hierarchyData,
  className,
}: ExpandingRowsTableProps) {
  const [hierarchyTableColumns, setHierarchyTableColumns] = useState<
    ColumnDef<DynamicRowData>[]
  >([])

  useEffect(() => {
    setHierarchyTableColumns(generateColumns(hierarchyData))
  }, [hierarchyData])

  return (
    <div className={cn("mx-4 my-5 sm:mx-6 lg:mx-8", className)}>
      <DataTable
        columns={hierarchyTableColumns}
        data={hierarchyData}
        hidePagination
        hideToolbar
        hideViewOptions
        tableWrapperClassName="rounded-md border"
      />
    </div>
  )
}
