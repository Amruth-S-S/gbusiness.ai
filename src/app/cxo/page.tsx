"use client"

import { DynamicCXODashboard } from "@/components/organisms/dashboards/cxo-dashboard/DynamicCXODashboard"
import { useAuth } from "@/contexts/auth-context"
import { useLanguagesStore } from "@/store/languages"
import { Translator } from "gbusiness-ai-react-auto-translate"
import { useEffect, useState } from "react"
import "regenerator-runtime/runtime"

export default function Consultant() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const { user } = useAuth()
  const { selectedLang } = useLanguagesStore()

  useEffect(() => {
    if (user) {
      setUserRole(user.role)
    }
  }, [user])

  return (
    <main>
      <Translator
        // cacheProvider={cacheProvider}
        from="en"
        to={selectedLang}
        googleApiKey="AIzaSyAn-aopZK_r7O3Jv8TCw8K4flt1kwnYFpo"
      >
        {(userRole === "END_USER" || userRole === "ADMIN") && (
          <DynamicCXODashboard />
        )}
      </Translator>
    </main>
  )
}
