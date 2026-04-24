import React from "react"
import "chartjs-adapter-moment"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

export const options: ChartOptions<"line"> = {
  responsive: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
      },
    },
  },
}

const values = [
  {
    x: new Date("2020-01-01"),
    y: 100.2,
  },
  {
    x: new Date("2020-01-02"),
    y: 102.2,
  },
  {
    x: new Date("2020-01-03"),
    y: 105.3,
  },
  {
    x: new Date("2020-01-11"),
    y: 104.4,
  },
]

export const data = {
  datasets: [
    {
      data: values,
    },
  ],
}

export function TimeSeriesChart() {
  return <Line options={options} data={data} />
}
