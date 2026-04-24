import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type SelectComponentProps = {
  id: string
  label?: string
  labelClassName?: string
  placeholder: string
  options: {
    label: string | number
    value: string
  }[]
  selectTriggerClassName?: string
  fieldName: string
  control?: any
  isDisabled?: boolean
  className?: string
  errorClassName?: string
  onChange?: (value: string) => void
}

export function SelectComponent({
  id,
  label,
  labelClassName,
  placeholder,
  options,
  selectTriggerClassName,
  fieldName,
  control,
  isDisabled,
  className,
  errorClassName,
  onChange,
}: SelectComponentProps) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className={cn("text-sm font-normal text-gray-500", labelClassName)}
            id={id}
          >
            {label && <Translate>{label}</Translate>}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value)
              onChange?.(value)
            }}
            defaultValue={field.value}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn("bg-gray-100", selectTriggerClassName)}
              >
                <SelectValue
                  className="text-muted-foreground"
                  placeholder={<Translate>{placeholder}</Translate>}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.length ? (
                options?.map((option) => (
                  <SelectItem
                    value={option.value}
                    key={option.value}
                    className="flex justify-between"
                  >
                    <Translate>{option.label.toString()}</Translate>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="No items found" disabled>
                  <Translate>No items found</Translate>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage className={cn(errorClassName, "text-red-600")} />
        </FormItem>
      )}
    />
  )
}
