import { Heading, Paragraph } from "@/components/atoms/texts"

import { Card } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import { useBoardsStore } from "@/store/boards"

type TroubleShootCardListProps = {
  heading: string
  value: string
}

function TroubleShootCardList({ heading, value }: TroubleShootCardListProps) {
  return (
    <div className="space-y-1">
      <Paragraph
        text={heading}
        className="text-base font-semibold text-gray-600"
      />
      <Paragraph text={value} className="text-sm text-gray-400" />
    </div>
  )
}

export function TroubleShootCard() {
  const {
    executedPrompts: {
      detail,
      durationSeconds,
      endTime,
      startTime,
      statusCode,
    },
  } = useBoardsStore()
  return (
    <Card className="mb-4 w-full">
      <Heading
        text="Troubleshoot Details"
        className="border-b-2 px-4 py-5 text-base font-semibold"
        type="h4"
      />
      <div className="flex flex-wrap justify-between gap-4 p-4 max-sm:flex-col">
        <TroubleShootCardList
          heading="Status Code"
          value={statusCode.toString()}
        />
        <TroubleShootCardList heading="Detail" value={detail.toString()} />
        <TroubleShootCardList
          heading="Start Time"
          value={formatDateTime(startTime)}
        />
        <TroubleShootCardList
          heading="End Time"
          value={formatDateTime(endTime)}
        />
        <TroubleShootCardList
          heading="Duration Seconds"
          value={durationSeconds.toString()}
        />
      </div>
    </Card>
  )
}
