"use client"

import { ReactElement, useEffect, useState } from "react"
import { TbFileExcel, TbFileTypePpt } from "react-icons/tb"
import { TabComponent } from "@/components/molecules/tabs/TabComponent"
import { TabsContent } from "@/components/ui/tabs"
import { Chart, Table } from "@/lib/types"
import { cn, downloadExcel } from "@/lib/utils"
import { DynamicResultsChartsView } from "../results-view/charts/DynamicResultsChartsView"
import { DynamicResultsTableView } from "../results/table/DynamicResultsTableView"
import { DynamicResultsOthersView } from "../results-view/others/DynamicResultsOthersView"
import { DropdownMenuComponent } from "@/components/atoms/controls/DropdownMenuComponent"
import { Button } from "@/components/ui/button"
import { downloadPPT } from "@/lib/results-charts-view"
import { Column, Row } from "@/components/molecules/tables/SimpleTable"

const tabsList = [
  {
    label: "Charts",
    value: "charts",
  },
  {
    label: "Tables",
    value: "tables",
  },
  {
    label: "Messages",
    value: "others",
  },
]

type PromptsResultViewProps = {
  tabClassName?: string
  tabsListClassName?: string
  charts: Chart[]
  table: Table | null
  message: string[]
  promptText?: string
}

export function PromptsResultView({
  tabClassName,
  tabsListClassName,
  charts,
  table,
  message,
  promptText,
}: PromptsResultViewProps) {
  const [tabDefaultValue, setTabDefaultValue] = useState(tabsList[0].value)

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

  const resultsView: Record<string, ReactElement> = {
    charts: <DynamicResultsChartsView charts={charts} />,
    tables: <DynamicResultsTableView table={table} />,
    others: <DynamicResultsOthersView message={message} />,
  }

  useEffect(() => {
    if (!charts?.length && table && Object.keys(table).length) {
      setTabDefaultValue(tabsList[1].value)
    } else if (!charts?.length && table && !Object.keys(table).length) {
      setTabDefaultValue(tabsList[2].value)
    } else {
      setTabDefaultValue(tabsList[0].value)
    }
  }, [charts, table, message])

  type DownloadFileType = "EXCEL" | "PPT"

  const downloadMenuClickHandler = (value: DownloadFileType) => {
    if (value === "EXCEL") {
      downloadExcel(rows, columns)
    }
    if (value === "PPT") {
      downloadPPT(promptText, charts, table)
    }
  }

  return (
    <>
      <div className="flex justify-end mr-6">
        <DropdownMenuComponent
          options={[
            {
              label: "Download as Excel",
              value: "EXCEL",
              icon: <TbFileExcel size={20} />,
            },
            {
              label: "Download as PPT",
              value: "PPT",
              icon: <TbFileTypePpt size={20} />,
            },
          ]}
          dropDownTrigger={<Button>Download Report</Button>}
          menuItemClickHandler={(value) =>
            downloadMenuClickHandler(value as DownloadFileType)
          }
        />
      </div>
      <TabComponent
        tabsList={tabsList}
        value={tabDefaultValue}
        onValueChange={(value) => setTabDefaultValue(value)}
        tabClassName={cn(tabClassName)}
        tabsListClassName={cn(tabsListClassName, "mr-4 sm:mr-6 xl:mr-8")}
      >
        {tabsList?.map((tab) => (
          <TabsContent value={tab.value} key={tab.value}>
            {resultsView[tab.value]}
          </TabsContent>
        ))}
      </TabComponent>
    </>
  )
}
