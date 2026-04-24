import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

type SliderComponentProps = {
  id?: string
  label?: string
  fieldName: string
  control?: any
  labelClassName?: string
  errorClassName?: string
  className?: string
  containerClassName?: string
  min?: number
  max?: number
  step?: number
  defaultValue: number
}

export function SliderComponent({
  id,
  label,
  fieldName,
  control,
  labelClassName,
  errorClassName,
  className,
  containerClassName,
  min,
  max,
  step,
  defaultValue,
}: SliderComponentProps) {
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
                <Slider
                  min={min ?? 0}
                  max={max ?? 100}
                  step={step ?? 1}
                  defaultValue={[defaultValue]}
                  value={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
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
