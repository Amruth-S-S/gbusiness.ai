import clsx from "clsx"
import { ReactElement } from "react"

type LoadingIconProps = {
  className?: string
  icon: ReactElement
}

export default function LoadingIcon({ className, icon }: LoadingIconProps) {
  return <div className={clsx("animate-spin", className)}>{icon}</div>
}
