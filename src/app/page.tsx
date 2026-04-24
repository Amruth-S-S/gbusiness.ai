"use client"

import { DynamicOverallDashboard } from "@/components/organisms/dashboard/overall-dashboard/DynamicOverallDashboard"
import { DynamicCXODashboard } from "@/components/organisms/dashboards/cxo-dashboard/DynamicCXODashboard"
import { useAuth } from "@/contexts/auth-context"
import { getOrCreateSessionId } from "@/lib/session"
import { useLanguagesStore } from "@/store/languages"
import { Translator } from "gbusiness-ai-react-auto-translate"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  const { selectedLang } = useLanguagesStore()

  useEffect(() => {
    if (user) {
      setUserRole(user.role)
    }
  }, [user])

  useEffect(() => {
    if (userRole === "END_USER") {
      router.push("/cxo")
    }
  }, [userRole])

  useEffect(() => {
    getOrCreateSessionId()
  }, [])

  return (
    <main className="h-full">
      <Translator
        // cacheProvider={cacheProvider}
        from="en"
        to={selectedLang}
        googleApiKey="AIzaSyAn-aopZK_r7O3Jv8TCw8K4flt1kwnYFpo"
      >
        {(userRole === "ADMIN" || userRole === "CONSULTANT") && (
          <DynamicOverallDashboard />
        )}
        {userRole === "END_USER" && <DynamicCXODashboard />}
      </Translator>
    </main>
  )
}
