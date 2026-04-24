import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import toast from "react-hot-toast"
import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DatePicker } from "@/components/atoms/controls/DatePicker"
import { InputField } from "@/components/molecules/fields/InputField"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tag, TagInput } from "@/components/ui/tag-input"
import { get, put } from "@/services/utils"
import { Button } from "@/components/ui/button"
import { SettingsViewProps } from "@/lib/props"
import { useBoardsStore } from "@/store/boards"

export function SettingsForm({ info: { apiKey } }: SettingsViewProps) {
  const { boardId } = useBoardsStore()

  const formSchema = z.object({
    id: z.number(),
    financialYearStart: z.date({
      required_error: "Financial year start is required.",
    }),
    financialYearEnd: z.date({
      required_error: "Financial year end is required.",
    }),
    dependentVariable: z.string({
      required_error: "Dependent variable is required",
    }),
    budget: z.coerce.number({ required_error: "Budget is required" }),
    dateVariable: z.string({ required_error: "Date variable" }),
    independentVariables: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    ),
  })

  type FormValues = z.infer<typeof formSchema>

  const [tags, setTags] = useState<Tag[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: async () =>
      get(`/main-boards/boards/${apiKey}/board/${boardId}`).then((res) => {
        const { data } = res
        if (Object.hasOwn(data, "independent_variables")) {
          setTags(
            data.independent_variables
              ?.map((iv: string) => ({
                id: iv,
                text: iv,
              }))
              .sort((a: Tag, b: Tag) => a.text.localeCompare(b.text)),
          )
        }
        return {
          id: data.id,
          ...(data.budget && { budget: data.budget }),
          ...(data.date_variable && { dateVariable: data.date_variable }),
          ...(data.dependent_variable && {
            dependentVariable: data.dependent_variable,
          }),
          financialYearEnd: new Date(data.financial_year_end),
          financialYearStart: new Date(data.financial_year_start),
          ...(data.independent_variables && {
            independentVariables: data.independent_variables?.map(
              (iv: string) => ({
                id: iv,
                text: iv,
              }),
            ),
          }),
        }
      }) ?? {
        financialYearStart: new Date(),
        financialYearEnd: new Date(),
        budget: 0,
        dependentVariable: "",
        dateVariable: "",
        independentVariables: [],
      },
  })

  const { setValue } = form

  async function onSubmit(formData: FormValues) {
    const payload = {
      board_id: boardId,
      budget: formData.budget,
      date_variable: formData.dateVariable,
      dependent_variable: formData.dependentVariable,
      financial_year_end: formData.financialYearEnd,
      financial_year_start: formData.financialYearStart,
      independent_variables: formData.independentVariables?.map((iv) => iv.id),
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
                  className="w-[300px]"
                />
                <DatePicker
                  fieldName="financialYearEnd"
                  control={form.control}
                  label="Financial Year End"
                  className="w-[300px]"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <InputField
                  fieldName="budget"
                  control={form.control}
                  inputType="number"
                  label="Budget"
                  className="w-[300px]"
                />
                <InputField
                  fieldName="dependentVariable"
                  control={form.control}
                  label="Dependent Variable"
                  className="w-[300px]"
                />
                <InputField
                  fieldName="dateVariable"
                  control={form.control}
                  label="Date Variable"
                  className="w-[300px]"
                />
              </div>
              <FormField
                control={form.control}
                name="independentVariables"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">
                      Independent Variables
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        {...field}
                        placeholder="Enter a independent variable"
                        tags={tags}
                        className="w-[300px]"
                        setTags={(newTags) => {
                          setTags(
                            (newTags as Tag[]).sort((a, b) =>
                              a.text.localeCompare(b.text),
                            ),
                          )
                          setValue("independentVariables", newTags as Tag[])
                        }}
                        tagPopoverHeading="Entered Independent Variables"
                        tagPopoverDescription="These are the Independent Variables you've entered."
                        allowDuplicates={false}
                        shape="rounded"
                        size="md"
                        interaction="nonClickable"
                        direction="column"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
