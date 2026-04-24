import { ReactNode } from "react"
import { DynamicConsultantDashboardLayout } from "@/components/organisms/consultant-dashboard-layout/DynamicConsultantDashboardLayout"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <DynamicConsultantDashboardLayout>
      {children}
    </DynamicConsultantDashboardLayout>
  )
}
