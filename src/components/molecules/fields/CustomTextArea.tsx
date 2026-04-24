import { Translate } from "gbusiness-ai-react-auto-translate"
import { ChangeEvent } from "react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { AutosizeTextarea } from "./AutoSizeTextArea"

type CustomTextAreaProps = {
  id?: string
  label?: string
  placeholder?: string
  inputClassName?: string
  fieldName: string
  control?: any
  labelClassName?: string
  errorClassName?: string
  className?: string
  readOnly?: boolean
  containerClassName?: string
  rows?: number
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  maxHeight?: number
}

export function CustomTextArea({
  id,
  label,
  placeholder,
  inputClassName,
  fieldName,
  control,
  labelClassName,
  errorClassName,
  className,
  readOnly,
  containerClassName,
  rows,
  onChange,
  maxHeight,
}: CustomTextAreaProps) {
  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem id={id ?? ""} className={cn(className)}>
            <FormLabel
              className={cn(
                "text-sm font-normal leading-[17.5px]",
                labelClassName,
              )}
            >
              {label && <Translate>{label}</Translate>}
            </FormLabel>
            <div className="w-full">
              <FormControl>
                <AutosizeTextarea
                  className={cn(inputClassName, "bg-gray-100")}
                  placeholder={placeholder ?? ""}
                  readOnly={readOnly ?? false}
                  rows={rows ?? 4}
                  {...field}
                  onChange={(e: any) => {
                    field.onChange(e)
                    onChange?.(e)
                  }}
                  maxHeight={maxHeight}
                />
              </FormControl>
              <FormMessage className={cn(errorClassName, "text-red-600")} />
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
