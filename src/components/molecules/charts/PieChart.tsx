import React, { CSSProperties } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"
import { PieDataset } from "@/lib/types"

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  data: {
    labels: string[]
    datasets: PieDataset[]
  }
  style?: CSSProperties
}

export function PieChart({ data, style }: PieChartProps) {
  return <Pie data={data} style={style} />
}
