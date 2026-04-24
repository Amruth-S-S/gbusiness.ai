import PptxGenJS from "pptxgenjs"
import { Chart, Table } from "./types"

const THEME = {
  primary: "1F4E79",
  secondary: "4F81BD",
  accent1: "F4B084",
  accent2: "A9D08E",
  accent3: "FFD966",
  background: "FFFFFF",
  text: "2F3542",
  headerBackground: "F2F2F2",
}

const slideMargin: [number, number, number, number] = [0.5, 0.25, 0.5, 0.25]

const LAYOUT = {
  margin: slideMargin,
  footer: {
    x: 0.5,
    y: 5.1,
    fontFace: "Arial",
    fontSize: 8,
    color: "666666" as const,
  },
  maxTableRows: 9,
}

interface TableCellOptions {
  fontFace?: string
  fontSize?: number
  color?: string
  bold?: boolean
  fill?: { color: string }
  align?: "left" | "center" | "right"
  valign?: "top" | "middle" | "bottom"
}

interface TableCell {
  text: string
  options?: TableCellOptions
}

type TableRow = TableCell[]

const formatCellValue = (value: any): string => {
  if (value == null) return ""
  if (typeof value === "object" && !Array.isArray(value))
    return JSON.stringify(value)
  return String(value)
}

function defineMasters(ppt: PptxGenJS) {
  ppt.defineSlideMaster({
    title: "TITLE",
    background: { color: THEME.primary },
    margin: LAYOUT.margin,
    slideNumber: LAYOUT.footer,
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: "100%",
          h: 0.6,
          fill: { color: THEME.primary },
        },
      },
      {
        rect: {
          x: 0,
          y: "95%",
          w: "100%",
          h: 0.25,
          fill: { color: THEME.secondary },
        },
      },
    ],
  })

  ppt.defineSlideMaster({
    title: "CONTENT",
    background: { color: THEME.background },
    margin: LAYOUT.margin,
    slideNumber: LAYOUT.footer,
  })
}

function addTitleSlide(ppt: PptxGenJS) {
  const slide = ppt.addSlide({ masterName: "TITLE" })
  slide.addText("📊 Insight Analysis Report", {
    x: 0.5,
    y: 1.8,
    w: "90%",
    fontFace: "Arial",
    fontSize: 36,
    color: THEME.background,
    bold: true,
    align: "center",
  })
  slide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: 0.5,
    y: 3.0,
    w: "90%",
    fontFace: "Arial",
    fontSize: 16,
    color: THEME.accent1,
    italic: true,
    align: "center",
  })
}

function addPromptSlide(ppt: PptxGenJS, promptText: string) {
  const slide = ppt.addSlide({ masterName: "CONTENT" })
  slide.addText("Prompt Used", {
    x: 0.5,
    y: 0.7,
    fontSize: 22,
    fontFace: "Arial",
    color: THEME.primary,
    bold: true,
  })
  slide.addText(promptText, {
    x: 0.5,
    y: 1.2,
    w: 8.5,
    h: 5,
    fontSize: 12,
    fontFace: "Arial",
    color: THEME.text,
    wrap: true,
    valign: "top",
  })
}

// Table utilities
function toHeaderCell(col: any): TableCell {
  const name =
    typeof col === "string"
      ? col
      : col.columnName || col.name || col.header || col.title || "Column"
  return {
    text: name,
    options: {
      fontFace: "Arial",
      fontSize: 11,
      bold: true,
      fill: { color: THEME.headerBackground },
      color: THEME.primary,
      align: "center",
    },
  }
}

function toRow(row: any): TableRow {
  if (Array.isArray(row)) {
    return row.map((val) => ({
      text: formatCellValue(val),
      options: { fontFace: "Arial", fontSize: 10, color: THEME.text },
    }))
  }
  return Object.keys(row).map((key) => ({
    text: formatCellValue(row[key]),
    options: { fontFace: "Arial", fontSize: 10, color: THEME.text },
  }))
}

function calculateColWidth(count: number): number {
  if (count <= 3) return 3.0
  if (count <= 5) return 2.0
  if (count <= 8) return 1.5
  return 1.0
}

function addTableSlides(
  ppt: PptxGenJS,
  table: Table,
  rowOption: "limited" | "all",
) {
  const rows = (rowOption === "all" ? table.data : table.data.slice(0, 20)).map(
    toRow,
  )
  const header = table.columns.map(toHeaderCell)
  const total = Math.ceil(rows.length / LAYOUT.maxTableRows)
  const colCount = header.length
  const colW = Array(colCount).fill(calculateColWidth(colCount))

  for (let i = 0; i < total; i += 1) {
    const slide = ppt.addSlide({ masterName: "CONTENT" })
    slide.addText(`📋 Table (${i + 1}/${total})`, {
      x: 0.5,
      y: 0.5,
      fontSize: 20,
      fontFace: "Arial",
      color: THEME.primary,
      bold: true,
    })
    const slice = rows.slice(
      i * LAYOUT.maxTableRows,
      (i + 1) * LAYOUT.maxTableRows,
    )
    try {
      slide.addTable([header, ...slice], {
        x: 0.5,
        y: 1.2,
        w: "90%",
        colW,
        rowH: 0.4,
        border: { type: "solid", pt: 1, color: "D3D3D3" },
        margin: 0.05,
      })
    } catch (err) {
      slide.addText("❌ Error creating table", {
        x: 0.5,
        y: 1.5,
        fontSize: 14,
        color: "FF0000",
        bold: true,
      })
      slide.addText((err as Error).message, {
        x: 0.5,
        y: 2.0,
        w: 9.0,
        fontSize: 12,
        wrap: true,
      })
    }
  }
}

function addChartSlides(ppt: PptxGenJS, charts: Chart[]) {
  charts.forEach((chart, idx) => {
    const slide = ppt.addSlide({ masterName: "CONTENT" })
    slide.addText(`📈 ${chart.chart_type.toUpperCase()} Chart`, {
      x: 0.5,
      y: 0.7,
      fontSize: 20,
      fontFace: "Arial",
      color: THEME.primary,
      bold: true,
    })

    const container = document.querySelectorAll(".chart-container")[
      idx
    ] as HTMLElement
    const canvas = container?.querySelector("canvas") as HTMLCanvasElement

    if (canvas) {
      try {
        const data = canvas.toDataURL("image/png")
        slide.addImage({ data, x: 0.5, y: 1.3, w: 5.5, h: 3.5 })
      } catch {
        slide.addText("❌ Error embedding chart image", {
          x: 0.5,
          y: 1.3,
          fontSize: 14,
          color: "FF0000",
        })
      }
    }

    if (chart.insight?.length) {
      slide.addText("🔍 Key Insights", {
        x: 6.2,
        y: 1.3,
        fontSize: 14,
        fontFace: "Arial",
        color: THEME.primary,
        bold: true,
      })
      chart.insight.forEach((insight, i) => {
        slide.addText(insight, {
          x: 6.2,
          y: 1.7 + i * 0.4,
          w: 3.2,
          h: 0.35,
          fontSize: 11,
          wrap: true,
          bullet: true,
        })
      })
    }
  })
}

export async function downloadPPT(
  promptText?: string,
  charts: Chart[] = [],
  table?: Table | null,
  rowOption: "limited" | "all" = "limited",
): Promise<void> {
  const ppt = new PptxGenJS()
  ppt.author = "Data Analysis Tool"
  ppt.company = "Your Company Name"
  ppt.subject = "Data Analysis Results"
  ppt.title = "Insight Analysis Report"

  defineMasters(ppt)
  addTitleSlide(ppt)
  if (promptText) addPromptSlide(ppt, promptText)
  if (table && table.data.length) addTableSlides(ppt, table, rowOption)
  if (charts.length) addChartSlides(ppt, charts)

  await ppt.writeFile({ fileName: "Analysis_Report.pptx" })
}
