import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { languageOptions } from "@/lib/languages"
import { cn } from "@/lib/utils"
import { useLanguagesStore } from "@/store/languages"

export function LanguageDropdown() {
  const { selectedLang, updateLanguagesStore } = useLanguagesStore()

  return (
    <Select
      value={selectedLang}
      onValueChange={(val: string) =>
        updateLanguagesStore({ selectedLang: val })
      }
    >
      <SelectTrigger className={cn("bg-gray-100 w-40")} id="language">
        <SelectValue
          placeholder={
            languageOptions.find((lang) => lang.value === selectedLang)?.label
          }
        />
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((option) => (
          <SelectItem
            value={option.value}
            key={option.value}
            className="flex justify-between"
          >
            {option.label.toString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
