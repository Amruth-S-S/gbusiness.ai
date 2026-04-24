/* eslint-disable react/no-array-index-key */
import { Fragment, ReactElement, ReactNode } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface DropdownMenuOption {
  icon?: ReactElement
  label: string
  shortcut?: string
  disabled?: boolean
  subOptions?: DropdownMenuOption[]
  value: string
}

interface DropdownMenuProps {
  options: DropdownMenuOption[]
  dropDownTrigger: ReactNode
  menuItemClickHandler?: (value: string, subValue?: string) => void
  dropDownMenuContentClassName?: string
  isLoading?: boolean
}

export function DropdownMenuComponent({
  options,
  dropDownTrigger,
  menuItemClickHandler,
  dropDownMenuContentClassName,
  isLoading,
}: DropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{dropDownTrigger}</DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-56", dropDownMenuContentClassName)}>
        {options?.map((option, index) => (
          <Fragment key={index}>
            {option.subOptions ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={isLoading}>
                  {option.icon}
                  <span>
                    <Translate>{option.label}</Translate>
                  </span>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {option.subOptions?.map((subOption, subIndex) => (
                      <DropdownMenuItem
                        key={subIndex}
                        disabled={subOption.disabled}
                        onClick={() =>
                          menuItemClickHandler?.(option.value, subOption.value)
                        }
                      >
                        {subOption.icon}
                        <span>
                          <Translate>{subOption.label}</Translate>
                        </span>
                        {subOption.shortcut && (
                          <DropdownMenuShortcut>
                            <Translate>{subOption.shortcut}</Translate>
                          </DropdownMenuShortcut>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                disabled={option.disabled}
                onClick={() => menuItemClickHandler?.(option.value)}
              >
                {!!option.icon && option.icon}
                <span>
                  <Translate>{option.label}</Translate>
                </span>
                {!!option.shortcut && (
                  <DropdownMenuShortcut>
                    <Translate>{option.shortcut}</Translate>
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            )}
            {index < options.length - 1 && <DropdownMenuSeparator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
