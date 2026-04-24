import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useModalContext } from "@/contexts/modal-context"
import { openModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { cn } from "@/lib/utils"
import { LogOut, Settings } from "lucide-react"

type ProfileDropdownProps = Partial<{
  buttonClassName: string
  buttonVariant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
}>

const dropDownItems = [
  {
    type: "SETTINGS",
    label: "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
]

export default function ProfileDropdown({
  buttonClassName,
  buttonVariant,
}: Readonly<ProfileDropdownProps>) {
  const { user, logout } = useAuth()
  const { setModalState } = useModalContext()
  const { lockScroll } = useScrollLock()

  const dropdownMenuItemClickHandler = (type: "SETTINGS" | "LOG_OUT") => {
    if (type === "SETTINGS") {
      openModal(setModalState, lockScroll, {
        modalState: {
          contentName: "VIEW__SETTINGS",
          isActive: true,
          isOpen: true,
          heading: "Settings",
        },
      })
    } else {
      logout()
    }
  }

  return (
    <DropdownMenu>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user?.userName}</span>
        <span className="truncate text-xs text-gray-500">{user?.email}</span>
      </div>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center space-x-2 p-0 rounded-full outline-none focus-visible:ring-0 h-8 w-8">
          <Settings className="text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 p-2 rounded-2xl border border-[#0d0d0d1a]"
      >
        {dropDownItems.map(({ icon, label }) => (
          <DropdownMenuItem
            className="p-3 hover:bg-gray-100"
            key={label}
            onClick={() => dropdownMenuItemClickHandler("SETTINGS")}
          >
            {icon}
            {label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-3 hover:bg-gray-100" onClick={logout}>
          <Button
            disableAnimation
            variant={buttonVariant}
            className={cn(
              buttonClassName,
              "bg-transparent shadow-none text-popover-foreground hover:bg-transparent p-0 h-auto",
            )}
            title="Logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
