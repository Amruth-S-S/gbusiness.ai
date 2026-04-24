import {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  ReactNode,
  useState,
} from "react"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PopoverWrapper } from "@/components/atoms/controls/PopoverWrapper"

type InputFieldProps = {
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
  inputType?: HTMLInputTypeAttribute
  autoComplete?: string
  autoFocus?: boolean
  maxLength?: number
  popoverTrigger?: ReactNode
  popoverContent?: ReactNode
  onChange?: ChangeEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}

export const InputField = ({
  id,
  label,
  inputType,
  placeholder,
  inputClassName,
  fieldName,
  control,
  labelClassName,
  errorClassName,
  className,
  readOnly,
  containerClassName,
  autoComplete,
  autoFocus,
  maxLength,
  popoverTrigger,
  popoverContent,
  onChange,
  onKeyDown,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem id={id ?? ""} className={cn(className)}>
            {!!label && (
              <FormLabel
                className={cn(
                  "text-sm font-normal text-gray-500",
                  labelClassName,
                  popoverTrigger && "flex items-center gap-x-2",
                )}
              >
                <Translate>{label}</Translate>
                <PopoverWrapper
                  trigger={popoverTrigger}
                  contentClassName="bg-gray-800 text-white"
                >
                  {popoverContent}
                </PopoverWrapper>
              </FormLabel>
            )}
            <div className="w-full">
              <FormControl>
                {inputType === "password" ? (
                  <div className="relative">
                    <Input
                      autoComplete={autoComplete}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="select-none"
                      readOnly={readOnly ?? false}
                      {...field}
                      onChange={onChange ?? ((e) => field.onChange(e))}
                      onKeyDown={onKeyDown}
                      autoFocus={autoFocus}
                    />
                    <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-primary/30">
                      {showPassword ? (
                        <HiEyeOff
                          className="h-6 w-6"
                          onClick={togglePasswordVisibility}
                        />
                      ) : (
                        <HiEye
                          className="h-6 w-6"
                          onClick={togglePasswordVisibility}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <Input
                    className={cn(
                      inputClassName,
                      readOnly && "text-gray-400 cursor-auto",
                    )}
                    placeholder={placeholder ?? ""}
                    type={inputType ?? "text"}
                    readOnly={readOnly ?? false}
                    maxLength={maxLength}
                    {...field}
                    onChange={onChange ?? ((e) => field.onChange(e))}
                  />
                )}
              </FormControl>
              <FormMessage className={cn(errorClassName, "text-red-600")} />
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
