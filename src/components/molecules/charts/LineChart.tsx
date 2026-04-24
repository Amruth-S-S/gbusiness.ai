import React, { CSSProperties } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import annotationPlugin from "chartjs-plugin-annotation"
import { BarLineDataset } from "@/lib/types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
)

interface LineChartProps {
  data: {
    labels: string[]
    datasets: BarLineDataset[]
  }
  style?: CSSProperties
  options?: ChartOptions<"line">
}

export const defaultOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

export function LineChart({ data, style, options }: LineChartProps) {
  return (
    <Line
      options={options ?? defaultOptions}
      data={data}
      style={style}
      width="100%"
    />
  )
}
