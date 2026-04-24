import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { InputField } from "@/components/molecules/fields/InputField"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useModalContext } from "@/contexts/modal-context"
import { CustomTextArea } from "@/components/molecules/fields/CustomTextArea"
import { closeModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { useBoardsStore } from "@/store/boards"
import { useMiddlePaneStore } from "@/store/middle-pane"
import { baseUrl } from "@/lib/constants"
import { fetchWrapper, HttpMethod } from "@/lib/fetch-wrapper"
import { iterateErrorResponse } from "@/lib/utils"

export function AnalysisDMTForm() {
  const {
    modalState: { data },
    setModalState,
  } = useModalContext()

  const { fetchData } = useMiddlePaneStore()
  const { selectedBoard } = useBoardsStore()
  const boardId = selectedBoard?.id ?? null
  const { unlockScroll } = useScrollLock()

  const modalData = data as {
    tableName: string
    tableDescription: string
    id?: number
  }

  const formSchema = z.object({
    tableName: z.string().min(1, { message: "Table name is required" }),
    tableDescription: z
      .string()
      .min(1, { message: "Table description is required" }),
  })

  type FormValues = z.infer<typeof formSchema>

  const defaultValues: Partial<FormValues> = {
    tableName: modalData?.tableName ?? "",
    tableDescription: modalData?.tableDescription ?? "",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  type Payload = {
    boardId: number
    tableName: string
    tableDescription: string
    tableColumnTypeDetail: string
  }

  const manageAnalysisDMTForm = async (
    method: HttpMethod,
    path: string,
    payload: Payload,
  ) => {
    try {
      const url = new URL(path, baseUrl)
      const { data: res, error } = await fetchWrapper(url.href, {
        method,
        body: payload,
      })

      if (res) {
        fetchData("dataManagementTables", "data-management-table")
        closeModal(setModalState, unlockScroll, true)
      } else if (error && typeof error === "object") {
        iterateErrorResponse(error)
      }
    } catch (error) {
      if (error && typeof error === "object") {
        iterateErrorResponse(error)
      }
    }
  }

  async function onSubmit(formData: FormValues) {
    if (!boardId) return

    const { tableName, tableDescription } = formData

    const payload = {
      boardId,
      tableName,
      tableDescription,
      tableColumnTypeDetail: "",
    }

    await manageAnalysisDMTForm(
      modalData?.id ? "PUT" : "POST",
      modalData?.id
        ? `main-boards/boards/data-management-table/${modalData.id}`
        : "main-boards/boards/data-management-table/create",
      payload,
    )
  }

  return (
    <div className="flex items-center">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit(onSubmit)()
          }}
          className="w-full space-y-2"
        >
          <InputField
            id="tableName"
            label="Table Name"
            placeholder="Table Name"
            fieldName="tableName"
            control={form.control}
            labelClassName="font-medium"
            readOnly={form.formState.isSubmitting}
          />
          <CustomTextArea
            id="tableDescription"
            label="Table Description"
            placeholder="Table Description"
            fieldName="tableDescription"
            control={form.control}
            labelClassName="font-medium"
            readOnly={form.formState.isSubmitting}
          />
          <Button
            type="submit"
            className="float-end mt-8"
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            <Translate>Save</Translate>
          </Button>
        </form>
      </Form>
    </div>
  )
}
