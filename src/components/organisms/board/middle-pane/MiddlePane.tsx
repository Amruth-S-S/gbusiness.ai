import { ReactElement, ReactNode, useEffect, useState } from "react"
import clsx from "clsx"
import { TabsContent } from "@/components/ui/tabs"
import { TabComponent } from "@/components/molecules/tabs/TabComponent"
import { getFromCookie, setToCookie } from "@/lib/utils"
import { CONSULTANT_MIDDLE_PANE_TAB_COOKIE_NAME } from "@/lib/constants"
import {
  analysisTabsList,
  budgetTabsList,
  cashFlowTabsList,
  cogsTabsList,
  forecastTabsList,
  profitabilityTabsList,
  ragTabsList,
  varianceTabsList,
} from "@/lib/tabs"
import { Paragraph } from "@/components/atoms/texts"
import { DynamicAnalysisDMT } from "../../views/consultant/analysis/analysis-dmt/DynamicAnalysisDMT"
import { DynamicSettingsView } from "../../views/consultant/analysis/analysis-ai-documentation/DynamicSettingsView"
import { DynamicConsultantPromptsView } from "../../views/consultant/prompts/DynamicConsultantPromptsView"
import { DynamicManageForecastView } from "../../views/consultant/forecast/DynamicManageForecastView"
import { DynamicSettingsForm } from "../../forms/settings-form/DynamicSettingsForm"
import { DynamicSimpleSettingsForm } from "../../forms/simple-settings-form/DynamicSimpleSettingsForm"
import { DynamicCommonDashboard } from "../../views/consultant/common-dashboard/DynamicCommonDashboard"
import { DynamicUploadDocumentsView } from "../../views/consultant/rag/upload-documnets/DynamicUploadDocumentsView"
import { DynamicChatView } from "../../views/consultant/rag/chat/DynamicChatView"
import { useBoardsStore } from "@/store/boards"

type MiddlePaneProps = {
  className?: string
}

export function MiddlePane({ className }: MiddlePaneProps) {
  const { selectedMainBoard, selectedBoard, executedPrompts } = useBoardsStore()
  const tabName = getFromCookie(CONSULTANT_MIDDLE_PANE_TAB_COOKIE_NAME)
  const [selectedTab, setSelectedTab] = useState(
    tabName ?? analysisTabsList[0].value,
  )
  const boardId = selectedBoard?.id ?? null

  const analysisResultsView: Record<string, ReactElement> = {
    managePrompts: (
      <DynamicConsultantPromptsView
        isCardReadOnly={false}
        boardId={boardId}
        info={{
          name: selectedTab,
          apiKey: analysisTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: analysisTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.secondaryApiKey as string,
        }}
      />
    ),
    promptsRepository: (
      <DynamicConsultantPromptsView
        boardId={boardId}
        isCardReadOnly
        info={{
          name: selectedTab,
          apiKey: analysisTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: analysisTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.secondaryApiKey as string,
        }}
      />
    ),
    dataManagementTables: <DynamicAnalysisDMT />,
    aiDocumentation: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: analysisTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    masterSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: analysisTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    timelineSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: analysisTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    kpiDefinition: <div>kpiDefinition</div>,
    otherParameterDefinitions: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: analysisTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
  }

  const ragResultsView: Record<string, ReactElement> = {
    uploadDocuments: <DynamicUploadDocumentsView />,
    chat: (
      <DynamicChatView
        boardId={boardId ?? 0}
        messageWrapperClassName="max-h-[70vh]"
      />
    ),
  }

  const forecastResultsView: Record<string, ReactElement> = {
    manageForecast: (
      <DynamicManageForecastView
        boardId={boardId}
        boardName={selectedBoard?.title}
        isCardReadOnly={false}
      />
    ),
    dataManagementTables: <DynamicAnalysisDMT />,
    forecastSettings: (
      <DynamicSettingsForm
        info={{
          name: selectedTab,
          apiKey: forecastTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    aiDocumentation: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: forecastTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    masterSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: forecastTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    timelineSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: forecastTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    kpiDefinition: <div>kpiDefinition</div>,
    otherParameterDefinitions: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: analysisTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
  }

  const profitabilityResultsView: Record<string, ReactElement> = {
    managePrompts: (
      <DynamicConsultantPromptsView
        isCardReadOnly={false}
        boardId={boardId}
        info={{
          name: selectedTab,
          apiKey: profitabilityTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: profitabilityTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.secondaryApiKey as string,
        }}
      />
    ),
    promptsRepository: (
      <DynamicConsultantPromptsView
        boardId={boardId}
        isCardReadOnly
        info={{
          name: selectedTab,
          apiKey: profitabilityTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: profitabilityTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.secondaryApiKey as string,
        }}
      />
    ),
    overall: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "profitability-dashboard",
          secondaryApiKey: profitabilityTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    actualMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "profitability-dashboard",
          secondaryApiKey: profitabilityTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    forecastMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "profitability-dashboard",
          secondaryApiKey: profitabilityTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    budget: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "profitability-dashboard",
          secondaryApiKey: profitabilityTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    profitabilitySettings: (
      <DynamicSimpleSettingsForm
        info={{
          name: selectedTab,
          apiKey: profitabilityTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    dataManagementTables: <DynamicAnalysisDMT />,
    aiDocumentation: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: profitabilityTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    masterSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: profitabilityTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    timelineSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: profitabilityTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    kpiDefinition: <div>kpiDefinition</div>,
    otherParameterDefinitions: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: profitabilityTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
  }

  const cashFlowResultsView: Record<string, ReactElement> = {
    managePrompts: (
      <DynamicConsultantPromptsView
        boardId={boardId}
        isCardReadOnly={false}
        info={{
          name: selectedTab,
          apiKey: cashFlowTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: cashFlowTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.secondaryApiKey as string,
        }}
      />
    ),
    promptsRepository: (
      <DynamicConsultantPromptsView
        boardId={boardId}
        isCardReadOnly
        info={{
          name: selectedTab,
          apiKey: cashFlowTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: cashFlowTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.secondaryApiKey as string,
        }}
      />
    ),
    overall: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "cashflow-dashboard",
          secondaryApiKey: cashFlowTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    actualMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "cashflow-dashboard",
          secondaryApiKey: cashFlowTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    forecastMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "cashflow-dashboard",
          secondaryApiKey: cashFlowTabsList.find(
            (tab) => tab.value === selectedTab,
          )?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    cashFlowSettings: (
      <DynamicSimpleSettingsForm
        info={{
          name: selectedTab,
          apiKey: cashFlowTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    dataManagementTables: <DynamicAnalysisDMT />,
    aiDocumentation: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cashFlowTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    masterSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cashFlowTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    timelineSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cashFlowTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    kpiDefinition: <div>kpiDefinition</div>,
    otherParameterDefinitions: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cashFlowTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
  }

  const cogsResultsView: Record<string, ReactElement> = {
    managePrompts: (
      <DynamicConsultantPromptsView
        boardId={boardId}
        isCardReadOnly={false}
        info={{
          name: selectedTab,
          apiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.secondaryApiKey as string,
        }}
      />
    ),
    promptsRepository: (
      <DynamicConsultantPromptsView
        boardId={boardId}
        isCardReadOnly
        info={{
          name: selectedTab,
          apiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          secondaryApiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.secondaryApiKey as string,
        }}
      />
    ),
    overall: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "cogs-dashboard",
          secondaryApiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    actualMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "cogs-dashboard",
          secondaryApiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    forecastMonthly: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "cogs-dashboard",
          secondaryApiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    budget: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: "cogs-dashboard",
          secondaryApiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
    cogsSettings: (
      <DynamicSimpleSettingsForm
        info={{
          name: selectedTab,
          apiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    dataManagementTables: <DynamicAnalysisDMT />,
    aiDocumentation: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    masterSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    timelineSettings: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
    kpiDefinition: <div>kpiDefinition</div>,
    otherParameterDefinitions: (
      <DynamicSettingsView
        info={{
          name: selectedTab,
          apiKey: cogsTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
        }}
      />
    ),
  }

  const varainceResultsView: Record<string, ReactElement> = {
    overall: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: varianceTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
  }

  const budgetResultsView: Record<string, ReactElement> = {
    overall: (
      <DynamicCommonDashboard
        info={{
          name: selectedTab,
          apiKey: budgetTabsList.find((tab) => tab.value === selectedTab)
            ?.apiKey as string,
          executedPrompt: executedPrompts,
          boardId,
        }}
      />
    ),
  }

  const getTabsList = () => {
    if (!selectedBoard?.id) {
      return []
    }
    switch (selectedMainBoard?.type) {
      case "ANALYSIS":
        return analysisTabsList
      case "FORECAST":
        return forecastTabsList
      case "PROFITABILITY":
        return profitabilityTabsList
      case "CASH_FLOW":
        return cashFlowTabsList
      case "COGS":
        return cogsTabsList
      case "VARIANCE_ANALYSIS":
        return varianceTabsList
      case "BUDGET":
        return budgetTabsList
      case "RAG":
        return ragTabsList
      default:
        return []
    }
  }

  const getResultsView = (value: string): ReactNode => {
    switch (selectedMainBoard?.type) {
      case "ANALYSIS":
        return analysisResultsView[value]
      case "FORECAST":
        return forecastResultsView[value]
      case "PROFITABILITY":
        return profitabilityResultsView[value]
      case "CASH_FLOW":
        return cashFlowResultsView[value]
      case "COGS":
        return cogsResultsView[value]
      case "VARIANCE_ANALYSIS":
        return varainceResultsView[value]
      case "BUDGET":
        return budgetResultsView[value]
      case "RAG":
        return ragResultsView[value]
      default:
        return null
    }
  }

  useEffect(() => {
    let tempSelectedTab = null

    switch (selectedMainBoard?.type) {
      case "ANALYSIS":
        tempSelectedTab = analysisTabsList[0].value
        break
      case "FORECAST":
        tempSelectedTab = forecastTabsList[0].value
        break
      case "PROFITABILITY":
        tempSelectedTab = profitabilityTabsList[0].value
        break
      case "CASH_FLOW":
        tempSelectedTab = cashFlowTabsList[0].value
        break
      case "COGS":
        tempSelectedTab = cogsTabsList[0].value
        break
      case "VARIANCE_ANALYSIS":
        tempSelectedTab = varianceTabsList[0].value
        break
      case "BUDGET":
        tempSelectedTab = budgetTabsList[0].value
        break
      case "RAG":
        tempSelectedTab = ragTabsList[0].value
        break
      default:
        tempSelectedTab = null
    }

    setSelectedTab(tempSelectedTab)
  }, [selectedMainBoard?.type])

  return (
    <div className={clsx(className)}>
      {getTabsList().length ? (
        <TabComponent
          tabsList={getTabsList()}
          value={selectedTab}
          tabsListClassName="bg-slate-200"
          onValueChange={(value) => {
            setToCookie(CONSULTANT_MIDDLE_PANE_TAB_COOKIE_NAME, value)
            setSelectedTab(value)
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
      ) : (
        <Paragraph
          text="Select a board in the left sidebar to continue"
          className="text flex items-center justify-center text-3xl font-semibold italic text-primary opacity-85"
        />
      )}
    </div>
  )
}
