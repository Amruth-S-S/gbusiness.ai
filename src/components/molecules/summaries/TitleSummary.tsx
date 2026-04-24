import { Heading, HeadingType, Paragraph } from "@/components/atoms/texts"

type TitleSummaryProps = {
  className?: string
  title: string
  summary: string
  titleType?: "PARAGRAPH" | "HEADING"
  headingType?: HeadingType
  titleClassName?: string
  summaryClassName?: string
}

export function TitleSummary({
  className,
  title,
  summary,
  titleType,
  headingType,
  titleClassName,
  summaryClassName,
}: TitleSummaryProps) {
  return (
    <div className={className}>
      {titleType === "PARAGRAPH" ? (
        <Paragraph text={title} className={titleClassName} />
      ) : (
        <Heading text={title} type={headingType} className={titleClassName} />
      )}
      <Paragraph text={summary} className={summaryClassName} />
    </div>
  )
}
