import React, { CSSProperties } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js"
import { BarLineDataset } from "@/lib/types"

interface BarChartProps {
  data: {
    labels: string[]
    datasets: BarLineDataset[]
  }
  style?: CSSProperties
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
)

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

export function BarChart({ data, style }: BarChartProps) {
  return <Bar options={options} data={data} style={style} width="100%" />
}
