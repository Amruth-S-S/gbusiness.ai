"use-client"

import { LanguageDropdown } from "@/components/atoms/controls/LanguageDropdown"
import { Heading, Paragraph } from "@/components/atoms/texts"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { cn, getAvatarText } from "@/lib/utils"
import { Translate } from "gbusiness-ai-react-auto-translate"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { MdClose, MdMenu, MdPerson } from "react-icons/md"

type NavigationMenuBarProps = {
  className?: string
  logoContainerClassName?: string
  logoHeadingClassName?: string
  avatarContainerClassName?: string
  avatarTextClassName?: string
  userNameTextClassName?: string
  userEmailTextClassName?: string
  buttonClassName?: string
  navItemClassName?: string
  buttonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
  showLogo?: boolean
}

const defaultNavItems = [
  {
    label: "Consultant",
    path: "/consultant",
  },
  {
    label: "CXO",
    path: "/cxo",
  },
]

export function NavigationMenuBar({
  avatarContainerClassName,
  avatarTextClassName,
  buttonClassName,
  buttonVariant,
  className,
  logoContainerClassName,
  logoHeadingClassName,
  userEmailTextClassName,
  userNameTextClassName,
  navItemClassName,
  showLogo,
}: Partial<NavigationMenuBarProps>) {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const avatarText = getAvatarText(user?.userName)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between gap-x-2 border-b-2 border-gray-300 px-4 py-3 sm:px-6 lg:px-6",
        className,
      )}
    >
      <div className="flex items-center gap-5 max-sm:hidden">
        {showLogo && (
          <div
            className={cn(
              "flex items-center gap-x-3 bg-gray-300",
              logoContainerClassName,
            )}
          >
            <div className="relative h-14 w-14">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                sizes="50vw, (max-width: 1024px): 30vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkyDlfDwADawG8NRzv6QAAAABJRU5ErkJggg=="
                quality={100}
                className="object-cover object-center"
              />
            </div>
            <Heading
              text="GBusiness.ai"
              className={cn(
                "text-xl font-bold text-white",
                logoHeadingClassName,
              )}
            />
          </div>
        )}
        <div className="hidden gap-5 md:flex">
          {user?.role === "ADMIN" &&
            defaultNavItems?.map((navItem) => (
              <Link
                key={navItem.label}
                className={cn(
                  "text-sm font-semibold text-white transition-transform duration-300 ease-in-out hover:scale-105",
                  navItemClassName,
                )}
                href={navItem.path}
              >
                <Translate>{navItem.label}</Translate>
              </Link>
            ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary",
            avatarContainerClassName,
          )}
        >
          {avatarText || (
            <MdPerson className={cn("text-primary", avatarTextClassName)} />
          )}
        </div>
        <div>
          <Heading
            text={user?.userName}
            type="h4"
            className={cn(
              "text-base font-medium text-white",
              userNameTextClassName,
            )}
          />
          <Paragraph
            text={user?.email}
            className={cn(
              "text-sm font-medium text-gray-200",
              userEmailTextClassName,
            )}
          />
        </div>
      </div>

      <div className="flex items-center md:hidden">
        <Button onClick={toggleMenu} className="text-white focus:outline-none">
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 flex flex-col gap-5 bg-gray-300 p-5 md:hidden">
          {user?.role === "ADMIN" &&
            defaultNavItems?.map((navItem) => (
              <Link
                key={navItem.label}
                className={cn(
                  "text-sm font-semibold text-primary transition-transform duration-300 ease-in-out hover:scale-105",
                  navItemClassName,
                )}
                href={navItem.path}
                onClick={toggleMenu}
              >
                <Translate>{navItem.label}</Translate>
              </Link>
            ))}
          <div className="flex items-center gap-2">
            <LanguageDropdown />
            <Button
              onClick={logout}
              disableAnimation
              variant={buttonVariant}
              className={buttonClassName}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
