"use-client"

import { useAuth } from "@/contexts/auth-context"
import { cn, defaultNavItems } from "@/lib/utils"
import { Translate } from "gbusiness-ai-react-auto-translate"
import Image from "next/image"
import Link from "next/link"
import ProfileDropdown from "../dropdowns/profile-dropdown/ProfileDropdown"

type NavigationBarProps = Partial<{
  className: string
  logoContainerClassName: string
  logoHeadingClassName: string
  avatarContainerClassName: string
  avatarTextClassName: string
  userNameTextClassName: string
  userEmailTextClassName: string
  buttonClassName: string
  navItemClassName: string
  buttonVariant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
  showLogo: boolean
}>

export function NavigationBar({
  buttonVariant,
  className,
  logoContainerClassName,
  navItemClassName,
  showLogo,
}: Readonly<NavigationBarProps>) {
  const { user } = useAuth()

  return (
    <div
      className={cn(
        "mb-3 m-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-xl shadow-lg ring-1 ring-gray-100/10",
        "relative flex items-center justify-between gap-x-2 px-4 py-3 sm:px-6 lg:px-6",
        className,
        !showLogo && "justify-end",
      )}
    >
      {showLogo && (
        <div
          className={cn("flex items-center gap-x-3", logoContainerClassName)}
        >
          <div className="relative w-[144px] h-7">
            <Image
              src="/logo-name.svg"
              alt="Logo"
              fill
              sizes="50vw, (max-width: 1024px): 30vw"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkyDlfDwADawG8NRzv6QAAAABJRU5ErkJggg=="
              quality={100}
              className="object-cover object-center"
            />
          </div>
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="absolute left-1/2 -translate-x-1/2 flex space-x-4">
          {defaultNavItems.map((navItem) => (
            <Link
              key={navItem.label}
              className={cn(
                "relative px-3 py-4 transition duration-300 group hover:text-primary",
                navItemClassName,
              )}
              href={navItem.path}
            >
              <Translate>{navItem.label}</Translate>
              <span className="absolute inset-x-1 h-px bg-gradient-to-r from-primary/0 from-10% via-primary to-primary/0 to-90% transition duration-300 -bottom-0.5 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100" />
              <span className="overflow-hidden absolute inset-0 transition origin-bottom duration-300 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100">
                <span className="absolute inset-x-4 -bottom-2 h-full bg-gradient-to-t from-primary/20 to-transparent blur rounded-t-full" />
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <ProfileDropdown buttonVariant={buttonVariant} />
      </div>
    </div>
  )
}
