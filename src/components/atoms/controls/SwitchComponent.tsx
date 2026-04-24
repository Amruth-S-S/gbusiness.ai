import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type SwitchComponentProps = {
  id: string
  label?: string
  labelClassName?: string
  fieldName: string
  control?: any
  isDisabled?: boolean
  className?: string
  errorClassName?: string
}

export function SwitchComponent({
  id,
  label,
  labelClassName,
  fieldName,
  control,
  isDisabled,
  className,
  errorClassName,
}: SwitchComponentProps) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className={cn(
              "text-sm font-normal leading-[17.5px]",
              labelClassName,
            )}
            id={id}
          >
            {label && <Translate>{label}</Translate>}
          </FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isDisabled}
              aria-readonly={isDisabled}
            />
          </FormControl>
          <FormMessage className={cn(errorClassName, "text-red-600")} />
        </FormItem>
      )}
    />
  )
}
