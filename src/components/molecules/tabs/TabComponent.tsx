import { ReactNode, useRef } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type TabComponentProps = {
  defaultValue?: string
  tabClassName?: string
  tabsListClassName?: string
  tabsList: { value: string; label: string }[]
  children?: ReactNode
  value?: string
  onValueChange?: (value: string) => void
}

export function TabComponent({
  defaultValue,
  tabClassName,
  tabsListClassName,
  tabsList,
  children,
  value,
  onValueChange,
}: TabComponentProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollTabs = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const showScrollButtons = tabsList.length >= 4

  return (
    <Tabs
      defaultValue={defaultValue}
      className={tabClassName}
      value={value}
      onValueChange={onValueChange}
    >
      <div className="relative flex items-center">
        {showScrollButtons && (
          <Button
            className="absolute left-0 z-10 top-1.5 px-1.5 py-1 h-7"
            onClick={() => scrollTabs("left")}
          >
            <ChevronLeft />
          </Button>
        )}
        <div
          ref={scrollRef}
          className="overflow-x-scroll whitespace-nowrap pb-2 mx-11"
          style={{ scrollbarWidth: "none" }}
        >
          <TabsList className={cn("", tabsListClassName)}>
            {tabsList?.map((tab) => (
              <TabsTrigger value={tab.value} key={`menu-${tab.value}`}>
                <Translate>{tab.label}</Translate>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {showScrollButtons && (
          <Button
            className="absolute right-0 z-10 top-1.5 px-1.5 py-1 h-7"
            onClick={() => scrollTabs("right")}
          >
            <ChevronRight />
          </Button>
        )}
      </div>
      {children}
    </Tabs>
  )
}
