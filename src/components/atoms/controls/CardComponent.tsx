import { ReactNode, useEffect, useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

type CardComponentProps = {
  className?: string
  cardHeader?: ReactNode
  cardTitle?: string
  cardHeaderClassName?: string
  cardContent: ReactNode
  cardContentClassName?: string
  cardFooter?: ReactNode
  cardFooterClassName?: string
}

export function CardComponent({
  className,
  cardHeader,
  cardTitle,
  cardHeaderClassName,
  cardContent,
  cardContentClassName,
  cardFooter,
  cardFooterClassName,
}: CardComponentProps) {
  const [translatedTitle, setTranslatedTitle] = useState<string | undefined>(
    cardTitle,
  )

  useEffect(() => {
    if (cardTitle) {
      const div = document.createElement("div")
      document.body.appendChild(div)

      const observer = new MutationObserver(() => {
        setTranslatedTitle(div.innerText)
        observer.disconnect()
        document.body.removeChild(div)
      })

      observer.observe(div, { childList: true })

      div.innerHTML = `<translate>${cardTitle}</translate>`
    }
  }, [cardTitle])

  return (
    <Card className={className}>
      {(cardTitle || cardHeader) && (
        <CardHeader className={cardHeaderClassName} title={translatedTitle}>
          {cardTitle && <Translate>{cardTitle}</Translate>}
          {cardHeader}
        </CardHeader>
      )}
      <CardContent className={cardContentClassName}>{cardContent}</CardContent>
      {cardFooter && (
        <CardFooter className={cardFooterClassName}>{cardFooter}</CardFooter>
      )}
    </Card>
  )
}
