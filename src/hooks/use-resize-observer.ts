import { useEffect, useRef, useState, RefObject } from "react"

interface Dimensions {
  width: number
  height: number
}

export const useResizeObserver = (
  targetRef: RefObject<HTMLElement>,
): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  })
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const target = targetRef.current

    const handleResize = (entries: ResizeObserverEntry[]) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      })
    }

    if (target) {
      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(target)

      return () => {
        resizeObserverRef.current?.disconnect()
      }
    }

    // Ensure that the cleanup function always returns undefined
    return undefined
  }, [targetRef])

  return dimensions
}
