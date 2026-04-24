"use client"

import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      onComplete,
      className,
      disabled = false,
      autoFocus = false,
    },
    ref,
  ) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""))
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
      if (value !== undefined) {
        const otpArray = value.split("").slice(0, length)
        setOtp((prev) => {
          const newOtp = [
            ...otpArray,
            ...new Array(length - otpArray.length).fill(""),
          ]
          return newOtp.join("") !== prev.join("") ? newOtp : prev
        })
      }
    }, [value, length])

    // Auto focus first input
    useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, [autoFocus])

    const handleChange = useCallback(
      (index: number, inputValue: string) => {
        if (disabled) return

        // Only allow single digit
        const sanitizedValue = inputValue.replace(/[^0-9]/g, "").slice(0, 1)

        const newOtp = [...otp]
        newOtp[index] = sanitizedValue
        setOtp(newOtp)

        const otpString = newOtp.join("")
        onChange?.(otpString)

        // Move to next input if value is entered
        if (sanitizedValue && index < length - 1) {
          setActiveIndex(index + 1)
          inputRefs.current[index + 1]?.focus()
        }

        // Check if OTP is complete
        if (otpString.length === length && !otpString.includes("")) {
          onComplete?.(otpString)
        }
      },
      [otp, length, onChange, onComplete, disabled],
    )

    const handleKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return

        if (e.key === "Backspace") {
          e.preventDefault()

          if (otp[index]) {
            // Clear current input
            const newOtp = [...otp]
            newOtp[index] = ""
            setOtp(newOtp)
            onChange?.(newOtp.join(""))
          } else if (index > 0) {
            // Move to previous input and clear it
            setActiveIndex(index - 1)
            inputRefs.current[index - 1]?.focus()
            const newOtp = [...otp]
            newOtp[index - 1] = ""
            setOtp(newOtp)
            onChange?.(newOtp.join(""))
          }
        } else if (e.key === "ArrowLeft" && index > 0) {
          setActiveIndex(index - 1)
          inputRefs.current[index - 1]?.focus()
        } else if (e.key === "ArrowRight" && index < length - 1) {
          setActiveIndex(index + 1)
          inputRefs.current[index + 1]?.focus()
        } else if (e.key === "Enter") {
          e.preventDefault()
          const otpString = otp.join("")
          if (otpString.length === length && !otpString.includes("")) {
            onComplete?.(otpString)
          }
        }
      },
      [otp, length, onChange, onComplete, disabled],
    )

    const handlePaste = useCallback(
      (e: React.ClipboardEvent) => {
        if (disabled) return

        e.preventDefault()
        const pastedData = e.clipboardData
          .getData("text")
          .replace(/[^0-9]/g, "")
          .slice(0, length)

        if (pastedData) {
          const newOtp = [...otp]
          for (let i = 0; i < pastedData.length && i < length; i++) {
            newOtp[i] = pastedData[i]
          }
          setOtp(newOtp)

          const otpString = newOtp.join("")
          onChange?.(otpString)

          // Focus the next empty input or the last input
          const nextIndex = Math.min(pastedData.length, length - 1)
          setActiveIndex(nextIndex)
          inputRefs.current[nextIndex]?.focus()

          if (otpString.length === length && !otpString.includes("")) {
            onComplete?.(otpString)
          }
        }
      },
      [otp, length, onChange, onComplete, disabled],
    )

    return (
      <div ref={ref} className={cn("flex gap-2 justify-center", className)}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "transition-colors duration-200",
              activeIndex === index
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400",
              disabled && "opacity-50 cursor-not-allowed bg-gray-100",
            )}
          />
        ))}
      </div>
    )
  },
)

OTPInput.displayName = "OTPInput"
