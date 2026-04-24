import { Translate } from "gbusiness-ai-react-auto-translate"
import Link from "next/link"
import { ReactNode } from "react"
import { cn, getClassName } from "@/lib/utils"
import { ComponentProps } from "@/lib/types"

type AnchorButtonBaseProps = Partial<ComponentProps> & {
  href: string
  disabled?: boolean
}

type AnchorButtonWithLabel = AnchorButtonBaseProps & {
  label: string
  children?: never
}

type AnchorButtonWithChildren = AnchorButtonBaseProps & {
  label?: never
  children: ReactNode
}

type AnchorButtonProps = AnchorButtonWithLabel | AnchorButtonWithChildren

export function AnchorButton({
  className,
  oCNStyles,
  disabled,
  href,
  label,
  children,
}: AnchorButtonProps) {
  return (
    <Link
      href={href}
      className={getClassName(
        className,
        oCNStyles,
        cn(
          "w-full h-11 flex items-center justify-center rounded-xl text-sm font-medium bg-primary/10",
          disabled
            ? "pointer-events-none opacity-50"
            : "cursor-pointer text-primary transition-transform duration-300 ease-in-out hover:scale-105",
        ),
      )}
      tabIndex={disabled ? -1 : 0}
    >
      {!!label && !children && <Translate>{label}</Translate>}
      {!!children && children}
    </Link>
  )
}
