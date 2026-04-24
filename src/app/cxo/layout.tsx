import { ReactNode } from "react"
import { LeftSidePane } from "@/components/organisms/views/side-pane/LeftSidePane"
import { CXOClientWrapper } from "@/components/organisms/client/CXOClientWrapper"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="flex h-full w-full max-sm:flex-col">
        <LeftSidePane />
        <div className="h-full sm:w-[calc(100%_-_48px)] bg-[#eff0f2]">
          <CXOClientWrapper />
          {children}
        </div>
      </div>
    </div>
  )
}
