import { Paragraph } from "@/components/atoms/texts"

type ResultsMessagesViewProps = {
  message: string[]
}

export function ResultsOthersView({ message }: ResultsMessagesViewProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {!message.length && (
        <div className="mt-40 flex h-full items-center justify-center">
          <Paragraph
            text="No messages found"
            className="text-center text-lg font-medium"
          />
        </div>
      )}
      {!!message?.length && (
        <div>
          {message?.map((promptText) => (
            <Paragraph
              key={promptText}
              text={promptText}
              className="w-fit border-b border-gray-200 py-2 text-base last:border-b-0"
            />
          ))}
        </div>
      )}
    </div>
  )
}
