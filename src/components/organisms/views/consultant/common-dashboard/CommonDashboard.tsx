/* eslint-disable camelcase */
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CommonDashboardResponse } from "@/lib/types"
import { get } from "@/services/utils"
import { ExpandingRowsTable } from "@/components/organisms/tables/ExpandingRowsTable"
import { Separator } from "@/components/ui/separator"
import { DynamicPromptEntryForm } from "@/components/organisms/forms/dynamic-prompt-form/DynamicPromptEntryForm"
import { ActualVsForecastTable } from "@/components/organisms/tables/ActualVsForecastTable"
import { Heading } from "@/components/atoms/texts"
import { DynamicResultsChartsView } from "../../results-view/charts/DynamicResultsChartsView"
import { DynamicPromptsResultView } from "../../prompts-result-view/DynamicPromptsResultsView"
import { CXOPromptsPanel } from "../../cxo/prompts-panel/CXOPromptsPanel"
import { MetaInfoRightPanel } from "../../right-panel/MetaInfoRightPanel"
import { CommonDashboardProps } from "./DynamicCommonDashboard"

type CommonDashboardState = {
  isLoading: boolean
  data: CommonDashboardResponse | null
  error: string | null
}
const allowedTabNames = [
  "overall",
  "actualMonthly",
  "forecastMonthly",
  "budget",
  "prompts",
]

export function CommonDashboard({
  info: { apiKey, name, secondaryApiKey, executedPrompt, boardId: bId },
}: CommonDashboardProps) {
  const { boardId } = useParams()
  const [commonDashboard, setCommonDashboard] = useState<CommonDashboardState>({
    isLoading: true,
    data: null,
    error: null,
  })
  const { charts, message, table, prompt_text } = executedPrompt

  useEffect(() => {
    if (allowedTabNames.includes(name)) {
      const url = `/main-boards/boards/${apiKey}/${
        secondaryApiKey !== undefined ? `${secondaryApiKey}/` : ""
      }${boardId ?? bId}`

      get(url)
        .then((res) => {
          const { data } = res
          setCommonDashboard({ isLoading: false, data, error: null })
        })
        .catch((err) => {
          setCommonDashboard({
            isLoading: false,
            data: null,
            error: err.message,
          })
        })
    }
  }, [apiKey])

  const showResults = charts?.length || table?.columns || message.length

  return (
    <div className="max-h-[calc(100vh_-_190px)] w-full overflow-y-auto">
      {commonDashboard.data?.hierarchy_table && (
        <>
          <Heading
            type="h4"
            text={commonDashboard.data.hierarchy_table.title}
            className="mx-4 my-5 mt-2 sm:mx-6 lg:mx-8"
          />
          <ExpandingRowsTable
            hierarchyData={commonDashboard.data?.hierarchy_table.data}
          />
        </>
      )}
      {commonDashboard.data?.charts &&
        !!commonDashboard.data?.charts.length && (
          <>
            {commonDashboard.data?.hierarchy_table && (
              <Separator className="bg-gray-800" />
            )}
            <DynamicResultsChartsView
              charts={commonDashboard.data?.charts}
              hideZoomControls
            />
          </>
        )}
      {commonDashboard.data &&
        Object.hasOwn(commonDashboard.data, "table") &&
        commonDashboard.data?.table && (
          <>
            {commonDashboard.data?.charts.length && (
              <Separator className="bg-gray-800" />
            )}
            <div className="mx-4 my-5 sm:mx-6 lg:mx-8">
              <Heading
                type="h4"
                text={commonDashboard.data.table.title}
                className="mb-2"
              />
              <ActualVsForecastTable table={commonDashboard.data?.table} />
            </div>
          </>
        )}
      {name === "prompts" && !!showResults && (
        <DynamicPromptsResultView
          charts={charts}
          table={table}
          message={message}
          promptText={prompt_text}
          tabClassName="mt-0 h-[calc(100vh_-_370px)] overflow-y-auto"
          tabsListClassName="float-end mr-4 sm:mr-6 lg:mr-8"
        />
      )}
      {name === "prompts" && (
        <>
          <DynamicPromptEntryForm />
          <CXOPromptsPanel />
        </>
      )}
      {commonDashboard.data?.meta_info && (
        <MetaInfoRightPanel metaInfo={commonDashboard.data?.meta_info} />
      )}
    </div>
  )
}
