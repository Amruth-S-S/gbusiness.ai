import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import toast from "react-hot-toast"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { SelectComponent } from "@/components/atoms/controls/SelectComponent"
import { SliderComponent } from "@/components/atoms/controls/SliderComponent"
import { Paragraph } from "@/components/atoms/texts"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useModalContext } from "@/contexts/modal-context"
import { fetchForecastData } from "@/hooks/use-forecast"
import { closeModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { Forecast } from "@/lib/types"
import { get, post, put } from "@/services/utils"
import { useForecastStore } from "@/store/forecast"
import { InputField } from "@/components/molecules/fields/InputField"
import { generateNewChartDataConfig } from "@/lib/utils"
import { baseUrl } from "@/lib/constants"
import { ForecastResponseView } from "../../tables/ForecastResponseView"

type Option = {
  isLoading: boolean
  data: { label: string; value: string }[]
  error: string
}

type ForecastFormProps = {
  boardId: number | null
  isReadOnly?: boolean
}

export function ForecastForm({ boardId, isReadOnly }: ForecastFormProps) {
  const { forecastResponse, updateForecastStore } = useForecastStore()
  const { modalState, setModalState } = useModalContext()
  const { unlockScroll } = useScrollLock()
  const [firstCategoryOptions, setFirstCategoryOptions] = useState<Option>({
    isLoading: true,
    data: [],
    error: "",
  })
  const [secondCategoryOptions, setSecondCategoryOptions] = useState<Option>({
    isLoading: true,
    data: [],
    error: "",
  })
  const selectedForecastInfo = (
    modalState?.data as { selectedForecastInfo: Forecast }
  )?.selectedForecastInfo

  const forecastFormSchema = z.object({
    forecastName: z
      .string({ required_error: "This field is required" })
      .min(1, "This field is required"),
    firstCategory: z
      .string({ required_error: "This field is required" })
      .min(1, "This field is required"),
    secondCategory: z.string(),
    forecastPeriod: z.number({
      required_error: "Forecast period should be greater than 1",
    }),
  })

  type ForecastFormValues = z.infer<typeof forecastFormSchema>

  const defaultValues: Partial<ForecastFormValues> = {
    forecastName: selectedForecastInfo?.name ?? "",
    firstCategory: selectedForecastInfo?.first_level_filter ?? "",
    secondCategory: selectedForecastInfo?.second_level_filter ?? "",
    forecastPeriod: selectedForecastInfo?.forecast_period ?? 1,
  }

  useEffect(() => {
    if (selectedForecastInfo?.output_response) {
      updateForecastStore({
        forecastResponse:
          typeof selectedForecastInfo.output_response === "string"
            ? JSON.parse(selectedForecastInfo.output_response)
            : {
                ...selectedForecastInfo.output_response,
                totalLevelLineChart: generateNewChartDataConfig(
                  selectedForecastInfo.output_response.total_level_line_chart
                    .data_format,
                  "line",
                  true,
                ),
                itemLevelLineChart: generateNewChartDataConfig(
                  selectedForecastInfo.output_response.item_level_line_chart
                    .data_format,
                  "line",
                  true,
                ),
              },
      })
    }
  }, [selectedForecastInfo])

  const form = useForm<ForecastFormValues>({
    resolver: zodResolver(forecastFormSchema),
    defaultValues,
  })

  const { firstCategory } = form.watch()

  const runOrSaveForecast = (
    data: ForecastFormValues,
    type: "RUN" | "RE_RUN" | "SAVE",
  ) => {
    if (boardId && baseUrl) {
      if (selectedForecastInfo?.forecast_response_id && type === "SAVE") {
        const payload = {
          board_id: boardId,
          // financial_year_start: "2023-10-01",
          first_level_filter: data.firstCategory,
          forecast_period: data.forecastPeriod,
          name: data.forecastName,
          output_response: JSON.stringify(forecastResponse?.item_metadata),
          // output_response: JSON.stringify({
          //   ...forecastResponse?.item_metadata,
          //   independent_variable: forecastResponse?.item_metadata.map((i) => ({
          //     ...i,
          //     independent_variable: { ...i.independent_variable.table, label: "independent" },
          //   })),
          // }),
          publish_to_cfo: false,
          second_level_filter: data.secondCategory,
        }
        put(
          `/main-boards/boards/forecast-response/forecast_responses/${selectedForecastInfo.forecast_response_id}`,
          payload,
        )
          .then(() => {
            if (type === "SAVE") {
              fetchForecastData(updateForecastStore, boardId)
              closeModal(setModalState, unlockScroll)
            }
          })
          .catch(() =>
            toast.error("Something went wrong", { position: "top-right" }),
          )
      } else {
        const url = new URL(
          `/main-boards/boards/forecast-response/${
            type === "SAVE" ? "save_forecast" : "run_forecast_hybrid_v2"
          }`,
          baseUrl,
        )
        url.searchParams.append("board_id", boardId.toString())
        url.searchParams.append("first_level_filter", data.firstCategory)
        url.searchParams.append(
          "forecast_period",
          data.forecastPeriod.toString(),
        )
        url.searchParams.append("forecast_name", data.forecastName)
        if (data.secondCategory) {
          url.searchParams.append("second_level_filter", data.secondCategory)
        }
        url.searchParams.append("edit_forecast_run", "false")
        const payload = forecastResponse?.item_metadata

        post(url.href, payload)
          .then((res) => {
            const response = res && res.data
            if (type === "SAVE") {
              fetchForecastData(updateForecastStore, boardId)
              closeModal(setModalState, unlockScroll)
            } else {
              updateForecastStore({
                forecastResponse: {
                  ...response,
                  totalLevelLineChart: generateNewChartDataConfig(
                    response.total_level_line_chart.data_format,
                    "line",
                    true,
                  ),
                  itemLevelLineChart: generateNewChartDataConfig(
                    response.item_level_line_chart.data_format,
                    "line",
                    true,
                  ),
                },
              })
            }
          })
          .catch(() => {
            toast.error("Something went wrong")
          })
      }
    }
  }

  async function onSubmit(data: ForecastFormValues) {
    runOrSaveForecast(data, "RUN")
  }

  async function onRun() {
    const data = form.getValues()
    runOrSaveForecast(data, "RE_RUN")
  }

  async function onSave() {
    const data = form.getValues()
    runOrSaveForecast(data, "SAVE")
  }

  useEffect(() => {
    get(`main-boards/boards/forecast-response/get_first_filter/${boardId}`)
      .then((res) => {
        const data = res && res.data
        if (data.forecast_first_category) {
          setFirstCategoryOptions({
            isLoading: false,
            data: data.forecast_first_category?.map((option: string) => ({
              label: option,
              value: option,
            })),
            error: "",
          })
        }
      })
      .catch((err) => {
        const errRes = err?.response?.data || "Something went wrong"
        setFirstCategoryOptions({
          isLoading: false,
          data: [],
          error: errRes,
        })
      })
  }, [])

  useEffect(() => {
    if (firstCategory) {
      get(
        `main-boards/boards/forecast-response/get_second_filter/${boardId}/${form.getValues(
          "firstCategory",
        )}`,
      )
        .then((res) => {
          const data = res && res.data
          if (data.forecast_second_category) {
            setSecondCategoryOptions({
              isLoading: false,
              data: Array.isArray(data.forecast_second_category)
                ? data.forecast_second_category?.map((option: string) => ({
                    label: option,
                    value: option,
                  }))
                : [
                    {
                      label: data.forecast_second_category,
                      value: data.forecast_second_category,
                    },
                  ],
              error: "",
            })
          }
        })
        .catch((err) => {
          const errRes = err?.response?.data || "Something went wrong"
          setSecondCategoryOptions({
            isLoading: false,
            data: [],
            error: errRes,
          })
        })
    }
  }, [firstCategory])

  return (
    <div className="flex flex-col items-center">
      <div className="h-[calc(100vh_-_120px)] w-full overflow-y-auto pb-5">
        <Form {...form}>
          <form className="relative mb-5 w-full">
            <div className="w-full space-y-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 max-sm:flex-col">
                <InputField
                  id="forecastName"
                  label="Forecast Name"
                  placeholder="Forecast Name"
                  fieldName="forecastName"
                  control={form.control}
                  labelClassName="font-medium"
                />
                <SelectComponent
                  id="firstCategory"
                  label="First Category"
                  placeholder="First Category"
                  fieldName="firstCategory"
                  control={form.control}
                  labelClassName="font-medium"
                  options={firstCategoryOptions.data}
                  isDisabled={firstCategoryOptions.isLoading}
                  className="sm:w-1/4"
                />
                <SelectComponent
                  id="secondCategory"
                  label="Second Category"
                  placeholder="Second Category"
                  fieldName="secondCategory"
                  control={form.control}
                  labelClassName="font-medium"
                  options={secondCategoryOptions.data}
                  isDisabled={
                    !form.getValues("firstCategory") ||
                    secondCategoryOptions.isLoading
                  }
                  className="sm:w-1/4"
                />
                <div className="w-1/4">
                  <Paragraph
                    text="Forecast period in months"
                    className="text-sm"
                  />
                  <SliderComponent
                    max={12}
                    step={1}
                    fieldName="forecastPeriod"
                    defaultValue={form.getValues("forecastPeriod")}
                  />
                </div>
              </div>
              <div className="flex pt-5">
                <Button
                  type="submit"
                  name="run"
                  className="ml-auto"
                  onClick={(event) => {
                    event.preventDefault()
                    form.handleSubmit(onSubmit)()
                  }}
                >
                  <Translate>Run Forecast</Translate>
                </Button>
              </div>
            </div>
          </form>
        </Form>
        {!!forecastResponse && (
          <ForecastResponseView forecastResponse={forecastResponse} />
        )}
      </div>
      {!!forecastResponse && (
        <div className="fixed bottom-0 right-0 flex h-20 w-full justify-end space-x-2 bg-gray-100 p-4 xl:h-[100px] xl:p-6 xl:py-4">
          <Button
            type="submit"
            name="runModifiedForecast"
            onClick={() => onRun()}
          >
            <Translate>Rerun Forecast</Translate>
          </Button>
          {!isReadOnly && (
            <Button type="submit" name="save" onClick={() => onSave()}>
              <Translate>Save Forecast</Translate>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
