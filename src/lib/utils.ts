"use client"

import { type ClassValue, clsx } from "clsx"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx"
import Cookies from "js-cookie"
import { ChangeEvent, ReactElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { UseFormReturn } from "react-hook-form"
import { Column, Row } from "@/components/molecules/tables/SimpleTable"
import { pastelColors } from "./colors"
import { ChartType, DataFormat, Tension } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function iterateErrorResponse(obj: Record<string, any>): void {
  if (typeof obj === "string") {
    toast.error(obj, { position: "top-right" })
  } else if (typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      toast.error(value, { position: "top-right" })

      if (typeof value === "object" && value !== null) {
        iterateErrorResponse(value)
      }
    })
  }
}

export function formatDateTime(dateInput: string): string {
  const date = new Date(dateInput)
  const n = date.toDateString()
  const time = date.toLocaleTimeString()
  return `${n} ${time}`
}

export function downloadExcel(rows: Row[], columns: Column[]) {
  const ws = XLSX.utils.aoa_to_sheet([
    columns?.map((column) => column.columnName),
    ...rows.map((row) => row.cells?.map((cell) => cell.cellValue)),
  ])

  // Calculate column widths based on content
  const colWidths = columns?.map((_, columnIndex) => {
    const maxContentLength = rows.reduce((max, row) => {
      const { cellValue } = row.cells[columnIndex]
      const contentLength = cellValue ? String(cellValue).length : 0
      return Math.max(max, contentLength)
    }, 0)

    // Add some padding or constant factor to improve readability
    const padding = 5 // You can adjust this value based on your preference

    // Determine the alignment based on column index
    const alignment = columnIndex === 1 ? { horizontal: "left" } : undefined

    // Determine the cell type based on column index
    const cellType = columnIndex === 1 ? "s" : undefined

    return { wch: maxContentLength + padding, s: { alignment, t: cellType } }
  })

  ws["!cols"] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1")

  XLSX.writeFile(wb, "prompt_results.xlsx")
}

export function convertToMonthWords(monthYearString: string) {
  const month = monthYearString.slice(0, 2)
  const year = monthYearString.slice(2)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const numericMonth = parseInt(month, 10)

  if (numericMonth >= 1 && numericMonth <= 12) {
    const monthName = monthNames[numericMonth - 1]

    return `${monthName} ${year}`
  }
  return "Invalid month"
}

export function getFromCookie(key: string) {
  const data = Cookies.get(key)
  if (data) {
    return JSON.parse(data)
  }
  return null
}

export function setToCookie(key: string, payload: unknown) {
  Cookies.set(key, JSON.stringify(payload), { path: "/" })
}

export function removeFromCookie(key: string) {
  Cookies.remove(key)
}

export const getAvatarText = (name?: string) => {
  if (name) {
    const matches = name.match(/(\b\S)?/g)

    if (matches) {
      const cleanedText = matches.join("").match(/(^\S|\S$)?/g)

      if (cleanedText) {
        return cleanedText.join("").toUpperCase()
      }
    }
  }

  return ""
}

export const paginationOptions = {
  styles: {
    pageButtons: {
      buttons: {
        default: {
          color: "grey",
          stroke: "grey",
          backgroundColor: "none",
          border: "none",
          marginTop: "3px",
          borderRadius: "5px",
        },
      },
      activeButton: {
        default: {
          backgroundColor: "#2e72fd",
          border: "none",
          color: "white",
          boxShadow: "rgb(55 55 55 / 17%) 0px 2px 5px 1px",
        },
      },
      actionButtons: { default: { border: "none" } },
      disabledButtons: { visibility: "hidden" },
      firstVisibleButtonOverride: {},
      lastVisibleButtonOverride: {},
    },
  },
  rowsPerPageSelect: false,
  displayNumberOfVisibleRows: false,
  // positions: { pageButtons: { position: "bottom-center" } },
  rowsPerPage: 5,
}

function getRandomPastelColor() {
  const randomIndex = Math.floor(Math.random() * pastelColors.length)
  return pastelColors[randomIndex]
}

export function generateChartDataConfig(
  data: DataFormat,
  isMultiAxisLineChart: boolean,
) {
  return {
    labels: data.labels,
    datasets: data.categories?.map((category, index) => {
      const color = getRandomPastelColor()
      return {
        label: category,
        data: isMultiAxisLineChart
          ? data.values?.map((value: any) => value[index])
          : (data.values?.flat() as unknown as number[]),
        backgroundColor: color,
        borderColor: color,
        tension: 0.1 as Tension,
        ...(isMultiAxisLineChart && {
          yAxisID: index === 0 ? "y-axis-1" : "y-axis-2",
        }),
      }
    }),
  }
}

interface Color {
  backgroundColor: string
  borderColor: string
}

export const generateRandomColor = (): Color => {
  const randomRGBA = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const a = 0.8
    return {
      rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
      rgb: `rgba(${r}, ${g}, ${b})`,
    }
  }

  const col = randomRGBA()
  const backgroundColor = col.rgba
  const borderColor = col.rgb

  return { backgroundColor, borderColor }
}

export function generateNewChartDataConfig(
  data: DataFormat,
  chartType: ChartType,
  isMultiAxisLineChart: boolean,
): { labels: string[]; datasets: any[] } {
  const categoryColors: Color[] = data.categories?.map(() =>
    generateRandomColor(),
  )
  const datasets = data.categories?.map((category, index) => {
    const color = generateRandomColor()
    const colors = data.values?.flat()?.map(() => generateRandomColor())
    const backgroundColors = colors?.map((clr: Color) => clr.backgroundColor)
    const borderColors = colors?.map((clr: Color) => clr.borderColor)
    let modifiedData: (number | null)[] = data.values?.map(
      (i: number[]) => i[index],
    )

    // Check if all values in the category array are the same
    const isSameValues = data.values?.every((val, i, arr) => val === arr[0])
    // Check if there are zero values in the category array
    const hasZeroValues = modifiedData?.some((val) => val === 0)

    let modifiedBackgroundColor =
      data.categories?.length > 1 ? backgroundColors : color.backgroundColor
    let modifiedBorderColor =
      data.categories?.length > 1 ? borderColors : color.borderColor

    if (chartType === "line" && !isMultiAxisLineChart) {
      modifiedBackgroundColor = categoryColors[index].backgroundColor
      modifiedBorderColor = categoryColors[index].borderColor
      if (!data.values.some((i) => Array.isArray(i) && i.length === 1)) {
        modifiedData = data.values[index]?.map((i: number) => (!i ? null : i))
      }
    } else if (chartType === "line" && isMultiAxisLineChart) {
      modifiedBackgroundColor = categoryColors[index].backgroundColor
      modifiedBorderColor = categoryColors[index].borderColor
    } else if (
      chartType === "bar" &&
      data.categories.length > 1 &&
      data.values?.some((i) => Array.isArray(i) && i.length === 1)
    ) {
      modifiedData = data.values[index]
    }

    // If all values are the same or there are zero values, flatten the data
    if (isSameValues || hasZeroValues) {
      modifiedData = data.values.flat()?.map((i: number) => (!i ? 0 : i))
    }

    return {
      label: category,
      data: modifiedData,
      backgroundColor: modifiedBackgroundColor,
      borderColor: modifiedBorderColor,
      tension: 0.1 as Tension,
      borderJoinStyle: "round",
      ...(isMultiAxisLineChart && {
        yAxisID: index === 0 ? "y-axis-1" : "y-axis-2",
      }),
      borderWidth: 1,
    }
  })

  return {
    labels: data.labels,
    datasets,
  }
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"

  const units = ["Bytes", "KB", "MB", "GB", "TB"]
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / 1024 ** unitIndex

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

export function reactElementToString(element: ReactElement): string {
  return renderToStaticMarkup(element)
}

export function getCurrentYear(): number {
  return new Date().getFullYear()
}

type GetClassName = (
  className?: string | null,
  overrideDefaultStyles?: boolean | null,
  defaultStyles?: string | null,
) => string

export const getClassName: GetClassName = (
  className,
  overrideDefaultStyles,
  defaultStyles,
) =>
  clsx(
    `${
      overrideDefaultStyles
        ? `${className || "" || ""}`
        : `${className || ""} ${defaultStyles || ""}`
    }`,
  )

const camelToKebabCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()

export const convertBodyToKebabCase = (
  body: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = {}

  Object.keys(body).forEach((key) => {
    const kebabKey = camelToKebabCase(key)
    result[kebabKey] = body[key]
  })

  return result
}

const camelToSnakeCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()

export const convertBodyToSnakeCase = (
  body: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = {}

  Object.keys(body).forEach((key) => {
    const snakeKey = camelToSnakeCase(key)
    result[snakeKey] = body[key]
  })

  return result
}

function toCamelCase(str: string): string {
  return str.replace(/[-_](\w)/g, (_, char) => char.toUpperCase())
}

export function convertBodyToCamelCase(input: any): any {
  if (input === null || typeof input !== "object") {
    return input
  }

  if (Array.isArray(input)) {
    return input.map(convertBodyToCamelCase)
  }

  return Object.entries(input).reduce(
    (acc, [key, value]) => {
      const camelKey = toCamelCase(key)
      acc[camelKey] = convertBodyToCamelCase(value)
      return acc
    },
    {} as Record<string, any>,
  )
}

const snakeToCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

const isPlainObject = (val: any): val is Record<string, any> =>
  typeof val === "object" && val !== null && !Array.isArray(val)

export const convertBodyToCamelCaseFromSnake = <T>(body: unknown): T => {
  if (Array.isArray(body)) {
    return body.map((item) => convertBodyToCamelCaseFromSnake(item)) as T
  }

  if (isPlainObject(body)) {
    const result: Record<string, any> = {}

    Object.keys(body).forEach((key) => {
      const camelKey = snakeToCamelCase(key)
      result[camelKey] = convertBodyToCamelCaseFromSnake(body[key])
    })

    return result as T
  }

  return body as T
}

export const passwordRules = [
  {
    test: (val: string) => val.length >= 8,
    message: "Minimum 8 characters",
  },
  {
    test: (val: string) => val.length <= 32,
    message: "Maximum 32 characters",
  },
  {
    test: (val: string) => /[a-z]/.test(val),
    message: "At least one lowercase letter (a-z)",
  },
  {
    test: (val: string) => /[A-Z]/.test(val),
    message: "At least one uppercase letter (A-Z)",
  },
  {
    test: (val: string) => /[0-9]/.test(val),
    message: "At least one number (0-9)",
  },
  {
    test: (val: string) => /[^A-Za-z0-9]/.test(val),
    message: "At least one special character (!@#$%^&*)",
  },
]

export const allowNumbersOnChange = (
  e: ChangeEvent<HTMLInputElement>,
  form: UseFormReturn<any>,
  fieldName: string,
) => {
  const rawValue = e.target.value
  const cleanedValue = rawValue.replace(/\D/g, "")

  e.target.value = cleanedValue

  form.setValue(fieldName, cleanedValue, { shouldValidate: true })
}

export const defaultNavItems = [
  {
    label: "Consultant",
    path: "/consultant",
  },
  {
    label: "CXO",
    path: "/cxo",
  },
]
