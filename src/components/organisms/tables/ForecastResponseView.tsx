/* eslint-disable react/no-array-index-key */
import { ChartOptions } from "chart.js"
import { ForecastResponse } from "@/lib/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/atoms/texts"
import { DynamicResultsChartsView } from "../views/results-view/charts/DynamicResultsChartsView"
import { ForecastEditableCellTable } from "./ForecastEditableCellTable"
import { ExpandingRowsTable } from "./ExpandingRowsTable"
import { MetaInfoRightPanel } from "../views/right-panel/MetaInfoRightPanel"

type ForecastResponseViewProps = {
  forecastResponse: ForecastResponse
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Item Level Line Chart",
    },
  },
  scales: {
    "y-axis-1": {
      type: "linear" as const,
      display: true,
      position: "left" as const,
    },
    "y-axis-2": {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
}

export function ForecastResponseView({
  forecastResponse,
}: ForecastResponseViewProps) {
  const totalLevelLineChartOptions: ChartOptions<"line"> = {
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      title: {
        display: true,
        text: "Total Level Line Chart",
      },
      ...(forecastResponse.total_level_line_chart.annotation?.value && {
        annotation: {
          annotations: [
            {
              type: "line",
              scaleID: "y-axis-1",
              value: forecastResponse.total_level_line_chart.annotation?.value,
              borderColor: "black",
              borderWidth: 3,
              label: {
                display: true,
                content: `${forecastResponse.total_level_line_chart.annotation?.label}: ${forecastResponse.total_level_line_chart.annotation?.value}`,
                position: "end",
              },
            },
          ],
        },
      }),
    },
  }

  return (
    <div className="mt-5">
      {forecastResponse.hierarchy_table && (
        <>
          <Heading
            type="h4"
            text={forecastResponse.hierarchy_table.title}
            className="mx-4 my-5 mt-2 sm:mx-6 lg:mx-8"
          />
          <ExpandingRowsTable
            hierarchyData={forecastResponse.hierarchy_table.data}
          />
        </>
      )}
      {forecastResponse.meta_info && (
        <MetaInfoRightPanel metaInfo={forecastResponse.meta_info} />
      )}
      <Separator className="mt-9 bg-gray-800" />
      {forecastResponse.total_level_line_chart &&
        Object.hasOwn(
          forecastResponse.total_level_line_chart,
          "chart_type",
        ) && (
          <DynamicResultsChartsView
            charts={[forecastResponse.total_level_line_chart]}
            hideZoomControls
            lineChartOptions={totalLevelLineChartOptions}
            isMultiAxisLineChart
          />
        )}
      <Separator className="bg-gray-800" />
      {forecastResponse.item_level_line_chart &&
        Object.hasOwn(forecastResponse.item_level_line_chart, "chart_type") && (
          <DynamicResultsChartsView
            charts={[forecastResponse.item_level_line_chart]}
            hideZoomControls
            lineChartOptions={lineChartOptions}
            isMultiAxisLineChart
          />
        )}
      <Separator className="bg-gray-800" />
      <div className="p-4 xl:p-6">
        {forecastResponse.item_metadata?.map((response, index) => (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            key={response.label + index}
          >
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="text-xl text-primary">
                {response.label}
              </AccordionTrigger>
              <AccordionContent>
                {response.weight_coefficients &&
                  response.independent_variable && (
                    <ForecastEditableCellTable
                      weightCoefficients={response.weight_coefficients.table}
                      independentVariable={response.independent_variable.table}
                      id={index}
                    />
                  )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  )
}
