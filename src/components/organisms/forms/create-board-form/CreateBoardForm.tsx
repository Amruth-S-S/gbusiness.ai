import { Translate } from "gbusiness-ai-react-auto-translate"
import { InputField } from "@/components/molecules/fields/InputField"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateBoardForm } from "@/hooks/components/organisms/forms/use-create-board-form"

export function CreateBoardForm() {
  const { form, onSubmit, isLoading } = useCreateBoardForm()

  return (
    <div className="mb-5 mt-2 flex items-center px-6">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit(onSubmit)()
          }}
          className="w-full"
        >
          <InputField
            id="boardName"
            label="Board name"
            placeholder="Board name"
            fieldName="boardName"
            control={form.control}
            labelClassName="font-medium"
            readOnly={isLoading}
          />
          <Button
            type="submit"
            className="float-end mt-8"
            isLoading={isLoading}
          >
            <Translate>Save</Translate>
          </Button>
        </form>
      </Form>
    </div>
  )
}
