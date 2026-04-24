import { useEffect, useState } from "react"

interface DimensionsState {
  winInnerW: number
  winInnerH: number
}

type RUseDimensions = { dimensionsState: DimensionsState }

type UseDimensions = () => RUseDimensions

export const useDimensions: UseDimensions = () => {
  const [dimensionsState, setDimensionsState] = useState<DimensionsState>({
    winInnerH: 0,
    winInnerW: 0,
  })

  useEffect(() => {
    if (!dimensionsState.winInnerW || !dimensionsState.winInnerH) {
      setDimensionsState({
        ...dimensionsState,
        winInnerW: window.innerWidth,
        winInnerH: window.innerHeight,
      })
    }

    window.addEventListener("resize", () => {
      setDimensionsState({
        ...dimensionsState,
        winInnerW: window.innerWidth,
        winInnerH: window.innerHeight,
      })
    })

    return () => {
      window.removeEventListener("resize", () => {})
    }
  }, [])

  return { dimensionsState }
}
