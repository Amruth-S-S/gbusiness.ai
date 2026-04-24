"use client"

import { Translator } from "gbusiness-ai-react-auto-translate"
import { DynamicCXOMainBoards } from "@/components/organisms/views/cxo/main-boards/cxo-main-boards/DynamicCXOMainBoards"
import { useLanguagesStore } from "@/store/languages"

export default function MainBoardPage() {
  const { selectedLang } = useLanguagesStore()

  return (
    <div>
      <Translator
        // cacheProvider={cacheProvider}
        from="en"
        to={selectedLang}
        googleApiKey="AIzaSyAn-aopZK_r7O3Jv8TCw8K4flt1kwnYFpo"
      >
        <DynamicCXOMainBoards />
      </Translator>
    </div>
  )
}
