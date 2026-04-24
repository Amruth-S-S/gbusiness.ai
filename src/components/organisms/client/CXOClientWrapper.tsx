"use client"

import { Translator } from "gbusiness-ai-react-auto-translate"
import { BreadcrumbComponent } from "@/components/atoms/controls/BreadCrumbComponent"
import { NavigationBar } from "@/components/molecules/nav/NavigationBar"
import { NavigationMenuBar } from "@/components/molecules/nav/NavigationMenuBar"
import { useDimensions } from "@/hooks/use-dimensions"
import { useCXOBoardsStore } from "@/store/cxo-boards"
import { useLanguagesStore } from "@/store/languages"
import { CenterModal } from "@/components/molecules/modal/CenterModal"
import SettingsView from "../views/settings/SettingsView"
import { useModalContext } from "@/contexts/modal-context"
import clsx from "clsx"

export function CXOClientWrapper() {
  const {
    dimensionsState: { winInnerW },
  } = useDimensions()
  const { breadCrumbItems } = useCXOBoardsStore()
  const { selectedLang } = useLanguagesStore()
  const {
    modalState: { contentName },
  } = useModalContext()

  return (
    <Translator
      // cacheProvider={cacheProvider}
      from="en"
      to={selectedLang}
      googleApiKey="AIzaSyAn-aopZK_r7O3Jv8TCw8K4flt1kwnYFpo"
    >
      {winInnerW < 640 ? (
        <NavigationMenuBar className="bg-primary" />
      ) : (
        <NavigationBar navItemClassName="text-primary" />
      )}
      <BreadcrumbComponent
        items={breadCrumbItems}
        itemsToDisplay={4}
        className="pl-4 sm:pl-6 lg:pl-8"
      />
      <CenterModal
        dialogChildrenWrapperClassName={clsx(
          contentName === "VIEW__SETTINGS" &&
            "flex justify-center items-center",
        )}
      >
        {contentName === "VIEW__SETTINGS" && <SettingsView />}
      </CenterModal>
    </Translator>
  )
}
