"use-client"

import Image from "next/image"
import Link from "next/link"

export function LeftSidePane() {
  return (
    <div className="flex w-44 items-center justify-between bg-gray-300 py-2 max-sm:w-full max-sm:px-2 sm:h-full sm:flex-col">
      <div className="relative h-12 w-36 mt-1">
        <Link href="/">
          <Image
            src="/images/partner-logo.png"
            alt="Logo"
            fill
            sizes="50vw, (max-width: 1024px): 30vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkyDlfDwADawG8NRzv6QAAAABJRU5ErkJggg=="
            quality={100}
            className="object-cover object-center"
          />
        </Link>
      </div>
      <div className="relative h-16 w-14">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            sizes="50vw, (max-width: 1024px): 30vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkyDlfDwADawG8NRzv6QAAAABJRU5ErkJggg=="
            quality={100}
            className="object-cover object-left"
          />
        </Link>
      </div>
    </div>
  )
}
