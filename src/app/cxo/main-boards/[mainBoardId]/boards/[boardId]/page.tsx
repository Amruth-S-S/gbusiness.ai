"use client"

import { Translator } from "gbusiness-ai-react-auto-translate"
import { DynamicCXOBoard } from "@/components/organisms/views/cxo/boards/cxo-boards/DynamicCXOBoard"
import { useLanguagesStore } from "@/store/languages"
import "regenerator-runtime/runtime"

export default function BoardsPage() {
  const { selectedLang } = useLanguagesStore()

  return (
    <div>
      <Translator
        // cacheProvider={cacheProvider}
        from="en"
        to={selectedLang}
        googleApiKey="AIzaSyAn-aopZK_r7O3Jv8TCw8K4flt1kwnYFpo"
      >
        <DynamicCXOBoard />
      </Translator>
    </div>
  )
}
