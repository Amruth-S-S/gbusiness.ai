"use client"

import { LanguageDropdown } from "@/components/atoms/controls/LanguageDropdown"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { MdLogout } from "react-icons/md"

export function NavBar() {
  const router = useRouter()
  const pathName = usePathname()
  const { logout } = useAuth()

  if (pathName === "/login" || pathName === "/signup") {
    return null
  }

  return (
    <div className="flex h-16 items-center justify-between bg-gray-400 px-2 text-white sm:px-8">
      <Button
        variant="destructive"
        className="text-2xl font-semibold"
        onClick={() => router.push("/")}
      >
        <div className="relative h-10 w-10">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            sizes="50vw, (max-width: 1024px): 30vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkyDlfDwADawG8NRzv6QAAAABJRU5ErkJggg=="
            quality={100}
            className="rounded-full object-cover object-center"
          />
        </div>
      </Button>
      {/* <div>
        <Button
          variant="destructive"
          className="text-base font-semibold"
          onClick={() => router.push("/boards")}
        >
          Boards
        </Button>
        <Button
          variant="destructive"
          className="text-base font-semibold"
          onClick={() => router.push("/configuration")}
        >
          Configuration
        </Button>
        <Button
          variant="destructive"
          className="text-base font-semibold"
          onClick={() => router.push("/table-management")}
        >
          Table Management
        </Button>
      </div> */}
      <div className="flex items-center gap-2">
        <LanguageDropdown />
        <Button variant="destructive" onClick={logout}>
          <MdLogout size={24} />
        </Button>
      </div>
    </div>
  )
}
