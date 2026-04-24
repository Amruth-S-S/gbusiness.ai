import { zodResolver } from "@hookform/resolvers/zod"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast"
import { baseUrl } from "@/lib/constants"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { User } from "@/lib/types"
import {
  convertBodyToCamelCaseFromSnake,
  iterateErrorResponse,
  passwordRules,
} from "@/lib/utils"
import { useUserStore } from "@/store/user"
import { useLanguagesStore } from "@/store/languages"
import { languageOptions } from "@/lib/languages"
import { authService } from "@/services"

const passwordField = passwordRules.reduce(
  (schema, rule) => schema.refine(rule.test, { message: rule.message }),
  z.string().min(1, { message: "Password is required." }) as z.ZodType<string>,
)

const phoneNumberRegExp = /^[6-9][0-9]{9}$/

const accountFormSchema = z
  .object({
    userName: z
      .string()
      .min(3, { message: "User Name must be at least 3 characters long." }),
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name can only contain letters and spaces.",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email("Enter a valid email address.")
      .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email), {
        message: "Email must include a domain and TLD.",
      }),
    phoneNumber: z
      .string()
      .trim()
      .length(10, "Mobile Number must be exactly 10 digits")
      .regex(phoneNumberRegExp, "Invalid Mobile Number format")
      .optional()
      .or(z.literal("")),
    password: passwordField,
    confirmPassword: z.string(),
    role: z
      .string({ required_error: "Role is required" })
      .min(1, "Role is required"),
    language: z
      .string({ required_error: "Language is required" })
      .min(1, "Language is required"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "The passwords do not match.",
    path: ["confirmPassword"],
  })

export type AccountFormValues = z.infer<typeof accountFormSchema>

export const useSignupForm = () => {
  const router = useRouter()
  const { updateUserStore } = useUserStore()
  const { updateLanguagesStore } = useLanguagesStore()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      userName: "",
      role: "ADMIN",
      language: languageOptions[0].value,
    },
    mode: "onTouched",
  })

  // const onSubmit = async (values: AccountFormValues) => {
  //   try {
  //     const url = new URL("client-users/", baseUrl)
  //     const { data: res, error } = await fetchWrapper<User>(url.href, {
  //       method: "POST",
  //       body: values,
  //     })
  //     if (res) {
  //       updateLanguagesStore({ selectedLang: values.language })
  //       const response = convertBodyToCamelCaseFromSnake<User>(res)
  //       updateUserStore({ isLoading: false, data: response, error: null })
  //       const sendVerificationEmailRes =
  //         await authService.sendEmailVerification(response.email)
  //       if (sendVerificationEmailRes?.data?.success) {
  //         router.push(
  //           `/verify-email?email=${encodeURIComponent(response.email)}`,
  //           { scroll: false },
  //         )
  //       }
  //     } else if (error && typeof error === "object") {
  //       iterateErrorResponse(error)
  //     }
  //   } catch (error) {
  //     if (error && typeof error === "object") {
  //       iterateErrorResponse(error)
  //     } else {
  //       toast.error("An error occurred while sign up. Please try again.")
  //     }
  //   }
  // }

  const onSubmit = async (values: AccountFormValues) => {
  try {
    const url = new URL("client-users/", baseUrl)

    const payload = {
      ...values,
      phoneNumber: values.phoneNumber || undefined, // ← strips empty string
    }

    const { data: res, error } = await fetchWrapper<User>(url.href, {
      method: "POST",
      body: payload, // ← changed from values to payload
    })
    if (res) {
      updateLanguagesStore({ selectedLang: values.language })
      const response = convertBodyToCamelCaseFromSnake<User>(res)
      updateUserStore({ isLoading: false, data: response, error: null })
      const sendVerificationEmailRes =
        await authService.sendEmailVerification(response.email)
      if (sendVerificationEmailRes?.data?.success) {
        router.push(
          `/verify-email?email=${encodeURIComponent(response.email)}`,
          { scroll: false },
        )
      }
    } else if (error && typeof error === "object") {
      iterateErrorResponse(error)
    }
  } catch (error) {
    if (error && typeof error === "object") {
      iterateErrorResponse(error)
    } else {
      toast.error("An error occurred while sign up. Please try again.")
    }
  }
}

  return {
    form,
    onSubmit,
    isLoading: form.formState.isSubmitting,
    navItems: [
      {
        label: "Consultant",
        value: "CONSULTANT",
      },
      {
        label: "End User",
        value: "END_USER",
      },
    ],
  }
}
