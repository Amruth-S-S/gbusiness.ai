import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import "react-day-picker/dist/style.css"

type DatePickerProps = {
  fieldName: string
  control?: any
  label?: string
  className?: string
  errorClassName?: string
}

export function DatePicker({
  fieldName,
  control,
  label,
  className,
  errorClassName,
}: DatePickerProps) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && (
            <FormLabel>
              <Translate>{label}</Translate>
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] bg-gray-100 pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    className,
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <Translate>Pick a date</Translate>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                today={field.value}
                captionLayout="dropdown"
                fromYear={2000}
                toYear={2050}
              />
            </PopoverContent>
          </Popover>
          <FormMessage className={cn(errorClassName, "text-red-600")} />
        </FormItem>
      )}
    />
  )
}
