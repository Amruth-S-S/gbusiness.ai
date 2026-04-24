import { DynamicChatForm } from "@/components/organisms/forms/chat-form/DynamicChatForm"
import { useChat } from "@/hooks/use-chat"
import { useChatStore } from "@/store/chat"
import clsx from "clsx"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { useEffect, useRef, useState } from "react"

type ChatViewProps = {
  boardId: number
  className?: string
  messageWrapperClassName?: string
}

const formatMessageTimestamp = (timestamp: Date | string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  let dateString: string

  if (messageDate.getTime() === today.getTime()) {
    dateString = "Today"
  } else if (messageDate.getTime() === yesterday.getTime()) {
    dateString = "Yesterday"
  } else {
    const daysDiff = Math.floor(
      (today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysDiff < 7) {
      dateString = date.toLocaleDateString([], { weekday: "long" })
    } else {
      dateString = date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  return `${timeString} · ${dateString}`
}

const getDatePillText = (timestamp: Date | string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )

  if (messageDate.getTime() === today.getTime()) {
    return "Today"
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday"
  } else {
    const daysDiff = Math.floor(
      (today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  }
}

export function ChatView({
  boardId,
  className,
  messageWrapperClassName,
}: ChatViewProps) {
  useChat(boardId)
  const { data } = useChatStore()
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null)
  const [visibleDatePill, setVisibleDatePill] = useState<string | null>(null)
  const [showDatePill, setShowDatePill] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const datePillTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto scroll to bottom when new messages come
  useEffect(() => {
    if (data) {
      bottomAnchorRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "nearest",
      })
    }
  }, [data])

  // Floating date pill behavior
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout

    const handleScroll = () => {
      if (!messagesContainerRef.current || !data.length) return

      const container = messagesContainerRef.current
      const containerRect = container.getBoundingClientRect()

      let topMessageIndex = -1
      let minTopDiff = Infinity

      for (let i = 0; i < data.length; i++) {
        const element = container.querySelector(
          `[data-message-index="${i}"]`,
        ) as HTMLElement
        if (!element) continue

        const rect = element.getBoundingClientRect()
        const topDiff = Math.abs(rect.top - containerRect.top)

        if (topDiff < minTopDiff) {
          minTopDiff = topDiff
          topMessageIndex = i
        }
      }

      if (topMessageIndex >= 0) {
        const message = data[topMessageIndex]
        const currentDateText = getDatePillText(message.timestamp)

        if (currentDateText !== visibleDatePill) {
          setVisibleDatePill(currentDateText)
        }
        setShowDatePill(true)
      }

      // Clear previous timeout and set new one
      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => {
        setShowDatePill(false)
      }, 500)
    }

    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => {
        container.removeEventListener("scroll", handleScroll)
        clearTimeout(hideTimeout)
      }
    }
  }, [data, visibleDatePill])

  const handleDownload = () => {
    if (!data || data.length === 0) return

    const chatText = data
      .map(
        (msg) =>
          `[${new Date(msg.timestamp).toLocaleString()}] ${
            msg.sender === "user" ? "You" : "Bot"
          }: ${msg.message}`,
      )
      .join("\n")

    const blob = new Blob([chatText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `chat-${boardId}.txt`
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className={clsx("flex flex-col justify-between relative", className)}>
      {/* Floating Date Pill */}
      {visibleDatePill && showDatePill && (
        <div className="absolute -top-5 z-10 flex justify-center my-2 left-0 right-0">
          <div className="bg-gray-800/80 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-lg">
            {visibleDatePill}
          </div>
        </div>
      )}
      <div
        ref={messagesContainerRef}
        className={clsx(
          "space-y-2 h-full overflow-y-auto my-4 px-2",
          messageWrapperClassName,
        )}
      >
        {data.map((message, index) => {
          const currentDate = getDatePillText(message.timestamp)
          const prevDate =
            index > 0 ? getDatePillText(data[index - 1].timestamp) : null
          const showDateSeparator = currentDate !== prevDate

          return (
            <div key={index}>
              {showDateSeparator && (
                <div className="flex justify-center my-2">
                  <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow">
                    {currentDate}
                  </span>
                </div>
              )}
              <div
                data-message-index={index}
                className={clsx(
                  "flex w-max flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.sender === "user"
                    ? "ml-auto bg-[#313b96d5] text-primary-foreground max-w-xs"
                    : "bg-[#313b9639] max-w-xs sm:max-w-2xl",
                )}
              >
                <Translate>{message.message}</Translate>
                <div
                  className={clsx(
                    "text-xs opacity-60 mt-0.5",
                    message.sender === "user" ? "text-right" : "text-left",
                  )}
                >
                  {formatMessageTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomAnchorRef} />
      </div>
      <DynamicChatForm
        boardId={boardId}
        onDownloadClick={handleDownload}
        disabledDownloadBtn={!data.length}
      />
    </div>
  )
}
