"use client"

import { useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { LanguageDropdown } from "@/components/atoms/controls/LanguageDropdown"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { authService, SendOTPRequest } from "@/services"
import toast from "react-hot-toast"
import { ChangePasswordView } from "../consultant/ChangePasswordView"

type View = "main" | "changePasswordFlow"

export default function SettingsView() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<View>("main")
  const email = user?.email as string

  const goBack = () => setCurrentView("main")

  if (currentView === "changePasswordFlow") {
    return <ChangePasswordView email={email} onBack={goBack} />
  }

  const onUpatePasswordClick = async () => {
    const payload: SendOTPRequest = {
      identifier: email,
      identifier_type: "EMAIL",
      purpose: "CHANGE_PASSWORD",
    }

    const response = await authService.sendOTP(payload)
    if (response.data?.success) {
      setCurrentView("changePasswordFlow")
    } else {
      const errorMessage = response.errRes || "Failed to send OTP"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <Label htmlFor="language" className="flex flex-col space-y-1">
          <span>
            <Translate>Language</Translate>
          </span>
        </Label>
        <LanguageDropdown aria-label="Language" />
      </div>

      <div className="flex items-center justify-between space-x-4">
        <Label htmlFor="changePassword" className="flex flex-col space-y-1">
          <span>
            <Translate>Change Password</Translate>
          </span>
        </Label>
        <Button variant="outline" size="sm" onClick={onUpatePasswordClick}>
          <Translate>Update Password</Translate>
        </Button>
      </div>
    </div>
  )
}
