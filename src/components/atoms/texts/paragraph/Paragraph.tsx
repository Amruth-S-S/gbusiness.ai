import { clsx } from "clsx"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { ReactNode } from "react"

type ParagraphProps = {
  className?: string
  text?: string
  children?: ReactNode
}

export function Paragraph({ className, text, children }: ParagraphProps) {
  const translatedText = text ? <Translate>{text}</Translate> : null

  return <p className={clsx(className)}>{children ?? translatedText}</p>
}
