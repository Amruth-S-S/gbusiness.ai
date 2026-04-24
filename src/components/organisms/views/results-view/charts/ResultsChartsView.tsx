/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import { HiZoomIn, HiZoomOut } from "react-icons/hi"
import { useState } from "react"
import { ChartOptions } from "chart.js"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Heading } from "@/components/atoms/texts"
import { BarChart } from "@/components/molecules/charts/BarChart"
import { LineChart } from "@/components/molecules/charts/LineChart"
import { PieChart } from "@/components/molecules/charts/PieChart"
import { Chart, ChartData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  cn,
  generateNewChartDataConfig,
  generateRandomColor,
} from "@/lib/utils"

const AnalysisChart = ({
  chart_type,
  data_format,
  insight,
  isZoomed,
  hideZoomControls,
  lineChartOptions,
  chartDataConfig,
  title,
}: Chart & {
  isZoomed: boolean
  hideZoomControls?: boolean
  lineChartOptions?: ChartOptions<"line">
  chartDataConfig: ChartData
  title: string
}) => {
  const pieChartDataConfig = {
    labels: data_format.labels,
    datasets: [
      {
        data: data_format.values as unknown as number[],
        backgroundColor: data_format.values?.map(
          () => generateRandomColor().backgroundColor,
        ),
      },
    ],
  }

  const renderChart = () => {
    switch (chart_type) {
      case "bar":
        return <BarChart data={chartDataConfig} />
      case "pie":
        return <PieChart data={pieChartDataConfig} />
      case "line":
        return <LineChart data={chartDataConfig} options={lineChartOptions} />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col justify-between space-x-4 rounded-xl bg-white p-4 text-black max-xl:w-full chart-container",
        isZoomed && "w-full",
        hideZoomControls && "w-full",
      )}
    >
      <Heading text={title} type="h4" className="my-2 w-fit" />
      <div
        className={cn(
          "relative flex h-full min-h-[400px] justify-center max-lg:w-full",
          isZoomed ? "min-h-[400px] w-full" : "lg:flex-1",
          hideZoomControls && "w-full",
          "aspect-[4/3]",
          "min-h-[300px] max-h-[500px]",
        )}
      >
        {renderChart()}
      </div>

      {!!insight?.length && (
        <div className="mt-6 border-t-2 pt-2">
          <Heading text="Insights:" type="h4" />
          <ul className="mt-2 text-sm text-gray-700">
            {insight?.map((item, index) => (
              <li key={`insight${index}`}>
                <Translate>{item}</Translate>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

type ResultsChartsViewProps = {
  charts: Chart[]
  hideZoomControls?: boolean
  lineChartOptions?: ChartOptions<"line">
  chartDataConfig?: ChartData
  className?: string
  isMultiAxisLineChart?: boolean
}

export function ResultsChartsView({
  charts,
  hideZoomControls,
  lineChartOptions,
  chartDataConfig,
  className,
  isMultiAxisLineChart,
}: ResultsChartsViewProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const zoomControls = [
    {
      id: "zoomIn",
      icon: <HiZoomIn size={20} />,
    },
    {
      id: "zoomOut",
      icon: <HiZoomOut size={20} />,
    },
  ]

  const zoomControlClickHandler = (id: string) => {
    setIsZoomed(id === "zoomIn")
  }

  return (
    <div className={className}>
      <div className="mx-4 my-4 hidden justify-end space-x-5 sm:mx-6 lg:mx-8 lg:flex">
        {charts &&
          !hideZoomControls &&
          zoomControls?.map((zoomControl) => (
            <Button
              onClick={() => zoomControlClickHandler(zoomControl.id)}
              key={zoomControl.id}
            >
              {zoomControl.icon}
            </Button>
          ))}
      </div>
      <div
        className={cn(
          "mx-4 my-5 grid gap-6 sm:mx-6 lg:mx-8",
          isZoomed
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {charts?.map((chart, index) => (
          <AnalysisChart
            key={`chart${index}`}
            chart_type={chart.chart_type}
            data_format={chart.data_format}
            insight={chart.insight}
            isZoomed={isZoomed}
            hideZoomControls={hideZoomControls}
            lineChartOptions={lineChartOptions}
            chartDataConfig={
              chartDataConfig ??
              generateNewChartDataConfig(
                chart.data_format,
                chart.chart_type,
                !!isMultiAxisLineChart,
              )
            }
            title={chart.title}
          />
        ))}
      </div>
    </div>
  )
}
