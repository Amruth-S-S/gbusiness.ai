import { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-y-auto bg-gray-100">{children}</div>
  )
}
