import { ReactElement, ReactNode, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { TabComponent } from "@/components/molecules/tabs/TabComponent"
import { TabsContent } from "@/components/ui/tabs"
import {
  cxoBudgetTabsList,
  cxoCashFlowTabsList,
  cxoCogsTabsList,
  cxoForecastTabsList,
  cxoProfitabilityTabsList,
  cxoVarianceTabsList,
} from "@/lib/cxo-tabs"
import { MainBoardType, TabKey } from "@/lib/types"
import { useCXOBoardsContext } from "@/contexts/cxo-boards-context"
import { DynamicCommonDashboard } from "../../consultant/common-dashboard/DynamicCommonDashboard"
import { DynamicManageForecastView } from "../../consultant/forecast/DynamicManageForecastView"

type TabsList = {
  label: string
  value: string
  apiKey: string
}[]

type TabsViewProps = {
  boardType: MainBoardType
}

export function TabsView({ boardType }: TabsViewProps) {
  const { boardId } = useParams()
  const {
    cxoBoardsState: { executedPrompt },
  } = useCXOBoardsContext()
  const [selectedTab, setSelectedTab] = useState<TabKey>(
    cxoProfitabilityTabsList[0].value as TabKey,
  )

  const getCommonResultsComponents = (
    tabsList: TabsList,
    identifier: string,
  ): Record<string, ReactElement> => ({
    overall: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: identifier,
          secondaryApiKey: tabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt,
        }}
      />
    ),
    actualMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: identifier,
          secondaryApiKey: tabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt,
        }}
      />
    ),
    forecastMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: identifier,
          secondaryApiKey: tabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt,
        }}
      />
    ),
    budget: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: identifier,
          secondaryApiKey: tabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt,
        }}
      />
    ),
    prompts: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: identifier,
          secondaryApiKey: tabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt,
        }}
      />
    ),
    forecast: (
      <DynamicManageForecastView boardId={Number(boardId)} isCardReadOnly />
    ),
  })

  const getTabsList = () => {
    switch (boardType) {
      case "PROFITABILITY":
        return cxoProfitabilityTabsList
      case "CASH_FLOW":
        return cxoCashFlowTabsList
      case "COGS":
        return cxoCogsTabsList
      case "BUDGET":
        return cxoBudgetTabsList
      case "VARIANCE_ANALYSIS":
        return cxoVarianceTabsList
      case "FORECAST":
        return cxoForecastTabsList
      default:
        return []
    }
  }

  const getResultsView = (value: string): ReactNode => {
    switch (boardType) {
      case "PROFITABILITY":
        return getCommonResultsComponents(
          cxoProfitabilityTabsList,
          "profitability-dashboard",
        )[value]
      case "CASH_FLOW":
        return getCommonResultsComponents(
          cxoCashFlowTabsList,
          "cashflow-dashboard",
        )[value]
      case "COGS":
        return getCommonResultsComponents(cxoCogsTabsList, "cogs-dashboard")[
          value
        ]
      case "BUDGET":
        return getCommonResultsComponents(cxoBudgetTabsList, "budget-variance")[
          value
        ]
      case "VARIANCE_ANALYSIS":
        return getCommonResultsComponents(
          cxoVarianceTabsList,
          "budget-variance",
        )[value]
      case "FORECAST":
        return getCommonResultsComponents(
          cxoForecastTabsList,
          "forecast-chat-response",
        )[value]
      default:
        return null
    }
  }

  useEffect(() => {
    let tempSelectedTab = cxoProfitabilityTabsList[0].value
    switch (boardType) {
      case "PROFITABILITY":
        tempSelectedTab = cxoProfitabilityTabsList[0].value
        break
      case "CASH_FLOW":
        tempSelectedTab = cxoCashFlowTabsList[0].value
        break
      case "COGS":
        tempSelectedTab = cxoCogsTabsList[0].value
        break
      case "BUDGET":
        tempSelectedTab = cxoBudgetTabsList[0].value
        break
      case "VARIANCE_ANALYSIS":
        tempSelectedTab = cxoVarianceTabsList[0].value
        break
      case "FORECAST":
        tempSelectedTab = cxoForecastTabsList[0].value
        break
      default:
        tempSelectedTab = cxoProfitabilityTabsList[0].value
    }
    setSelectedTab(tempSelectedTab as TabKey)
  }, [boardType])

  return (
    <TabComponent
      tabsList={getTabsList()}
      value={selectedTab}
      tabsListClassName="bg-slate-200 ml-8"
      tabClassName="w-full"
      onValueChange={(value) => {
        setSelectedTab(value as TabKey)
      }}
    >
      <>
        {getTabsList().map((tab) => (
          <TabsContent value={tab.value} key={tab.value}>
            {getResultsView(tab.value)}
          </TabsContent>
        ))}
      </>
    </TabComponent>
  )
}
