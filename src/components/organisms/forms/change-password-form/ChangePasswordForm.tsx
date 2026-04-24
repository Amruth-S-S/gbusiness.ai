"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Paragraph } from "@/components/atoms/texts"
import { toast } from "react-hot-toast"
import { authService, type ChangePasswordRequest } from "@/services"
import clsx from "clsx"
import { closeModal, useModal } from "@/hooks/use-modal"
import { useModalContext } from "@/contexts/modal-context"
import { useScrollLock } from "@/hooks/use-scroll-lock"

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

export interface ChangePasswordFormProps {
  className?: string
  identifier: string
  identifierType: "EMAIL" | "PHONE"
  otpCode?: string
  onSuccess?: () => void
  onBackBtnClick?: () => void
}

export function ChangePasswordForm({
  className,
  identifier,
  identifierType,
  otpCode = "000000",
  onSuccess,
  onBackBtnClick,
}: ChangePasswordFormProps) {
  const [isChanging, setIsChanging] = useState(false)
  const { setModalState } = useModalContext()
  const { unlockScroll } = useScrollLock()

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    setIsChanging(true)

    try {
      const payload: ChangePasswordRequest = {
        identifier,
        identifier_type: identifierType,
        current_password: data.current_password,
        new_password: data.new_password,
        otp_code: otpCode,
      }

      const response = await authService.changePassword(payload)

      if (response.data?.success) {
        toast.success("Password changed successfully!")
        if (onSuccess) {
          onSuccess()
        } else {
          closeModal(setModalState, unlockScroll)
        }
      } else {
        toast.error(response.errRes || "Password change failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Password change error:", error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className={clsx("w-full lg:max-w-sm", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Change Password
        </h2>
        <Paragraph className="text-gray-600">
          Enter your current password and new password
        </Paragraph>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    {...field}
                    disabled={isChanging}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                    disabled={isChanging}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                    disabled={isChanging}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={!form.formState.isValid || isChanging}
              isLoading={isChanging}
            >
              {isChanging ? "Changing..." : "Change Password"}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onBackBtnClick}
              disabled={isChanging}
              className="text-gray-600"
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
