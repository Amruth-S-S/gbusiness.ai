"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  duration: number // in seconds
  onComplete?: () => void
  className?: string
  showSeconds?: boolean
}

export function CountdownTimer({ duration, onComplete, className, showSeconds = true }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, onComplete])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (showSeconds) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes}m`
  }

  return (
    <div className={cn("text-sm font-medium", className)}>
      {timeLeft > 0 ? (
        <span className="text-gray-600">
          {formatTime(timeLeft)}
        </span>
      ) : (
        <span className="text-red-500">
          Expired
        </span>
      )}
    </div>
  )
}
