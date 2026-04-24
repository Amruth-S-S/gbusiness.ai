import type { Metadata } from "next"
import "./global.css"
import { ReactNode } from "react"
import { Toaster } from "react-hot-toast"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster as UIToaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppContextProvider } from "@/contexts/AppContextProvider"
import { AuthProvider } from "@/contexts/auth-context"
import Loader from "@/components/atoms/Loader"
import "regenerator-runtime/runtime"
import { DeleteDialogProvider } from "@/components/organisms/delete-dialog-provider/DeleteDialogProvider"

export const metadata: Metadata = {
  title: "GBusiness.AI",
  description: "",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppContextProvider>
            <DeleteDialogProvider>
              <NuqsAdapter>
                <TooltipProvider>{children}</TooltipProvider>
              </NuqsAdapter>
            </DeleteDialogProvider>
            <Loader />
            <UIToaster />
            <Toaster position="bottom-center" />
          </AppContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
