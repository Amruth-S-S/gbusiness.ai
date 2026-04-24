import { ReactElement, ReactNode } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { cn } from "@/lib/utils"

export type HeadingType = "h1" | "h2" | "h3" | "h4"

type HeadingProps = {
  className?: string
  text?: string
  children?: ReactNode
  type?: HeadingType
}

export function Heading({ className, text, children, type }: HeadingProps) {
  let heading: ReactElement

  const translatedText = text ? <Translate>{text}</Translate> : null

  if (type === "h2") {
    heading = (
      <h2 className={cn("text-3xl leading-[42px]", className)}>
        {translatedText || children}
      </h2>
    )
  } else if (type === "h3") {
    heading = (
      <h3 className={cn("text-2xl leading-[34px]", className)}>
        {translatedText || children}
      </h3>
    )
  } else if (type === "h4") {
    heading = (
      <h4 className={cn("text-xl", className)}>{translatedText || children}</h4>
    )
  } else {
    heading = (
      <h1 className={cn("text-4xl leading-[48px]", className)}>
        {translatedText || children}
      </h1>
    )
  }

  return heading
}
