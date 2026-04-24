"use client"

import { CarouselComponent } from "@/components/atoms/controls/CarouselComponent"
import { Paragraph } from "@/components/atoms/texts"
import { slideOptions, slides } from "@/lib/slides"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"

type AuthWrapperProps = {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const pathName = usePathname()
  const isSignup = pathName === "/signup"
  const maxWidthClassName = isSignup ? "max-w-lg" : "max-w-sm"

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Left Side */}
        <div className="flex flex-col justify-between flex-1">
          <header className="p-4 md:p-8">
            <div className="relative h-[60px] w-[200px]">
              <Image
                src="/logo-name.svg"
                alt="Logo"
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVB..."
                quality={100}
                className="object-contain object-center"
              />
            </div>
          </header>

          <div
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-y-6 px-4 md:px-8 w-full mx-auto max-md:flex-col max-md:items-center max-sm:px-4",
              maxWidthClassName,
            )}
          >
            {children}
          </div>

          <footer className="mx-4 mb-4 md:mb-6 text-center">
            <Paragraph
              text="ONEVEGA AI Solutions Pvt Ltd"
              className="text-sm text-[#9399A3]"
            />
          </footer>
        </div>

        {/* Right Side Carousel */}
        <div className="relative w-1/2 hidden lg:flex items-center p-4 md:p-8">
          <CarouselComponent
            slides={slides}
            options={slideOptions}
            imgAlt="Login images"
          />
        </div>
      </div>
    </div>
  )
}
