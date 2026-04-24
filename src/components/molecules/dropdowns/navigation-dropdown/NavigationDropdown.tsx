import { ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { DropdownMenuComponent } from "@/components/atoms/controls/DropdownMenuComponent"
import { Button } from "@/components/ui/button"

export function NavigationDropdown() {
  const router = useRouter()
  const pathName = usePathname()
  const currentPath = pathName.split("/")[1]
  return (
    <DropdownMenuComponent
      dropDownMenuContentClassName="w-fit rounded-xl"
      dropDownTrigger={
        <Button variant="outline" className="rounded-xl capitalize">
          {currentPath}
          <ChevronDown />
        </Button>
      }
      options={[
        {
          label: "Consulatant",
          value: "consultant",
        },
        {
          label: "CXO",
          value: "cxo",
        },
      ]}
      menuItemClickHandler={(value) => router.push(`/${value}`)}
    />
  )
}
