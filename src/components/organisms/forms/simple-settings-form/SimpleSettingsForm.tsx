import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import toast from "react-hot-toast"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Form } from "@/components/ui/form"
import { DatePicker } from "@/components/atoms/controls/DatePicker"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { get, put } from "@/services/utils"
import { Button } from "@/components/ui/button"
import { SettingsViewProps } from "@/lib/props"
import { Paragraph } from "@/components/atoms/texts"
import { SwitchComponent } from "@/components/atoms/controls/SwitchComponent"
import { InputField } from "@/components/molecules/fields/InputField"
import { useBoardsStore } from "@/store/boards"

const inRange = (x: number, y: number) => (n: number) => n >= x && n <= y

export function SimpleSettingsForm({ info: { apiKey } }: SettingsViewProps) {
  const { boardId } = useBoardsStore()

  const formSchema = z.object({
    id: z.number(),
    financialYearStart: z.date({
      required_error: "Financial year start is required.",
    }),
    financialYearEnd: z.date({
      required_error: "Financial year end is required.",
    }),
    forecastPeriod: z.coerce
      .number()
      .refine(
        inRange(1, 12),
        "Forecast period should be in the range of 1 to 12",
      ),
    publishToCFO: z.boolean(),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: async () =>
      get(`/main-boards/boards/${apiKey}/board/${boardId}`).then((res) => {
        const { data } = res

        return {
          id: data.id,
          financialYearEnd: new Date(data.financial_year_end),
          financialYearStart: new Date(data.financial_year_start),
          forecastPeriod: data.forecast_period ?? 1,
          publishToCFO: data.publish_to_cfo,
        }
      }) ?? {
        financialYearStart: new Date(),
        financialYearEnd: new Date(),
        forecastPeriod: 1,
        publishToCFO: false,
      },
  })

  async function onSubmit(formData: FormValues) {
    const payload = {
      board_id: boardId,
      financial_year_end: formData.financialYearEnd,
      financial_year_start: formData.financialYearStart,
      forecast_period: formData.forecastPeriod,
      publish_to_cfo: formData.publishToCFO,
    }
    put(`/main-boards/boards/${apiKey}/${formData.id}`, payload).then(() =>
      toast.success("Updated successfully", { position: "top-right" }),
    )
  }

  return (
    <div className="relative mt-3 flex flex-col items-center">
      <Form {...form}>
        <Card className="w-full">
          <form
            className="mb-5"
            onSubmit={(event) => {
              event.preventDefault()
              form.handleSubmit(onSubmit)()
            }}
          >
            <CardContent className="max-h-[calc(100vh_-_260px)] space-y-4 overflow-y-auto pb-3 pt-5">
              <div className="flex flex-wrap gap-4">
                <DatePicker
                  fieldName="financialYearStart"
                  control={form.control}
                  label="Financial Year Start"
                  className="w-[400px]"
                />
                <DatePicker
                  fieldName="financialYearEnd"
                  control={form.control}
                  label="Financial Year End"
                  className="w-[400px]"
                />
                <div className="mb-3 flex w-[400px] flex-col">
                  <Paragraph
                    text="Forecast period in months"
                    className="text-sm"
                  />
                  <InputField
                    control={form.control}
                    id="forecastPeriod"
                    fieldName="forecastPeriod"
                    inputType="number"
                  />
                </div>
                <SwitchComponent
                  id="publishToCFO"
                  fieldName="publishToCFO"
                  label="Publish to CXO:"
                  labelClassName="mr-2 mt-2"
                  className="flex w-[400px] items-center"
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="absolute bottom-3 right-4">
                <Button>
                  <Translate>Update</Translate>
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Form>
    </div>
  )
}
