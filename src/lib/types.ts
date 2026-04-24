import { ComponentType, ReactNode } from "react"

export type ComponentProps = {
  className: string
  oCNStyles: boolean
}

export interface CustomResponse<T> {
  data?: T
  errRes?: string
}

export type User = {
  accessToken: string
  userId: string
  role: "ADMIN" | "END_USER" | "CONSULTANT"
  userName: string
  email: string
  subscription: string
  customerOtherDetails: any
}

export interface BCFBoard {
  id: number
  name: string
  created_at: string
  updated_at: string
  main_board_id: number
  is_active: boolean
}

export interface BCF {
  id: number
  name: string
  main_board_id: number
  created_at: string
  updated_at: string
  bcfBoards: BCFBoard[]
}

export interface MainBoard {
  id: number
  client_user_id: number
  name: string
  created_at: string
  updated_at: string
  bcf: BCF[]
}

export enum MainBoardType {
  USE_CASES = "USE_CASES",
  ANALYSIS = "ANALYSIS",
  FORECAST = "FORECAST",
  WHAT_IF_FRAMEWORK = "WHAT_IF_FRAMEWORK",
  KPI_DEFINITION = "KPI_DEFINITION",
  PROFITABILITY = "PROFITABILITY",
  CASH_FLOW = "CASH_FLOW",
  COGS = "COGS",
  BUDGET = "BUDGET",
  VARIANCE_ANALYSIS = "VARIANCE_ANALYSIS",
  RAG = "RAG",
}

export type TreeItem = {
  id: string
  name: string
  children?: TreeItem[]
  rightNode?: ReactNode
  isSelected?: boolean
  type?: MainBoardType
}

export interface Prompt {
  id: number
  board_id: number
  prompt_out: string
  prompt_text: string
  created_at: string
  updated_at: string
  input_text: string
}

export type TreeBoard = {
  name: string
  isSelected: boolean
  isActive: boolean
}

export type Collection = TreeBoard & { id: number }

export type TreeInfo = {
  name: string
  isSelected: boolean
  mainBoardId: number
  clientUserId: number
  boards: Record<string, TreeBoard>
  mainBoardType: MainBoardType
}

export type Table = {
  title: string
  columns: string[]
  data: any
}

export type ChartType = "bar" | "pie" | "line"

export type DataFormat = {
  labels: string[]
  categories: string[]
  values: number[][]
  isStacked: boolean
}

export type Chart = {
  chart_type: ChartType
  data_format: DataFormat
  insight?: string[]
  title: string
}

export type Tension = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5
interface Dataset {
  label: string
  data: number[]
  backgroundColor: string | string[]
  borderColor: string | string[]
  tension: Tension
  yAxisID?: string
}

export type ChartData = {
  labels: string[]
  datasets: Dataset[]
  annotation?: { label: string; value: number }
}

export type ExecutedPrompts = {
  message: string[]
  table: Table | null
  statusCode: number
  detail: string
  startTime: string
  endTime: string
  durationSeconds: number
  charts: Chart[]
  prompt_text?: string
}

export interface BarLineDataset {
  label: string
  data: number[]
  backgroundColor: string | string[]
  borderColor: string | string[]
}

export interface PieDataset {
  data: number[]
  backgroundColor: string[]
  hoverBackgroundColor?: string[]
}

export type DocumentList = {
  name: string
  size: number
  file: File
  type: string
}
export interface Board {
  id: number
  main_board_id: number
  name: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface AnalysisDMT {
  id: number
  boardId: number
  tableName: string
  tableDescription: string
  tableColumnTypeDetail: string
  createdAt: string
  updatedAt: string
  approved: boolean
  files: {
    id: number
    monthYear: string
    approved: boolean
    filename: string
    fileDownloadLink: string
    createdAt: string
    updatedAt: string
  }[]
}

export interface AnalysisDMTWithStatus {
  id: number
  data_management_table_id: number
  month_year: string
  approved: boolean
  filename: string
  file_download_link: string
  created_at: string
  updated_at: string
}

export interface FilterColumn {
  label: string
  value: string
  options: {
    label: string
    value: string
    icon?: ComponentType<{ className?: string }>
  }[]
}

export interface ConfigurationDetail {
  id: number
  keyName: string
  valueName: string
  isDisabled: boolean
}

export interface SettingsData {
  id: number
  boardId: number
  configurationDetails: {
    [key: string]: string
  }
  name: string
  createdAt: string
  updatedAt: string
}

export type TabKey =
  | "dataManagementTables"
  | "managePrompts"
  | "promptsRepository"
  | "aiDocumentation"
  | "masterSettings"
  | "timelineSettings"
  | "kpiDefinition"
  | "otherParameterDefinitions"
  | "prompts"

// Forecast types
export interface Forecast {
  forecast_response_id: number
  board_id: number
  name: string
  first_level_filter: string
  second_level_filter: string
  financial_year_start: string
  forecast_period: number
  output_response: ForecastResponse
  publish_to_cfo: boolean
  created_at: string
  updated_at: string
}

interface ActualVsForecastTable {
  columns: string[]
  data: Array<string | number>
  title: string
}

interface ChartResponse {
  title: string
  chart_type: ChartType
  data_format: {
    labels: string[]
    categories: string[]
    values: number[][]
    isStacked: boolean
  }
  annotation?: {
    label: string
    value: number
  }
}

export interface WeightCoefficientsTable {
  columns: string[]
  data: Array<Array<string | number>>
  title: string
}

export interface IndependentVariableTable {
  columns: string[]
  data: Array<Array<string | number>>
  editable_columns: string[]
  title: string
}

export interface ItemMetaData {
  actual_vs_forecast: {
    table: ActualVsForecastTable
  }
  actual_vs_forecast_chart: ChartResponse
  weight_coefficients: {
    table: WeightCoefficientsTable
  }
  independent_variable: {
    table: IndependentVariableTable
  }
  abs_sum_coef: number
  label: string
}

export interface ForecastResponse {
  item_metadata: ItemMetaData[]
  hierarchy_table: { data: DynamicRowData[]; title: string }
  total_level_line_chart: ChartResponse
  item_level_line_chart: ChartResponse
  totalLevelLineChart: ChartData
  itemLevelLineChart: ChartData
  meta_info: Record<string, string>
}

export type DynamicRowData = {
  [key: string]: string | number
}

export interface CommonDashboardResponse {
  Success: boolean
  hierarchy_table: { data: DynamicRowData[]; title: string }
  charts: Chart[]
  message: string
  table: ActualVsForecastTable
  meta_info: Record<string, string>
}

export type ProfitabilityDashboardResponse = CommonDashboardResponse

export type CashFlowDashboardResponse = CommonDashboardResponse

export type CogsDashboardResponse = CommonDashboardResponse

export type Chat = {
  id: number
  message: string
  timestamp: string
  collection_id: number
  session_id: string
  sender: "user" | "assistant"
}
