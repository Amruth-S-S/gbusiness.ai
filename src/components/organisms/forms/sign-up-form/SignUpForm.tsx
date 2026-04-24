"use client"

import { Translate } from "gbusiness-ai-react-auto-translate"
import { MdInfo } from "react-icons/md"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Paragraph } from "@/components/atoms/texts"
import { InputField } from "@/components/molecules/fields/InputField"
import { allowNumbersOnChange, passwordRules } from "@/lib/utils"
import { useSignupForm } from "@/hooks/components/organisms/forms/use-signup-form"
import { AnchorButton } from "@/components/atoms/controls/AnchorButton"
import { SelectComponent } from "@/components/atoms/controls/SelectComponent"
import { languageOptions } from "@/lib/languages"

export function SignUpForm() {
  const { form, onSubmit, isLoading } = useSignupForm()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:max-w-lg"
      >
        <div className="grid sm:grid-cols-2 gap-2">
          <InputField
            fieldName="userName"
            control={form.control}
            label="User Name"
            placeholder="User Name"
          />
          <InputField
            fieldName="name"
            control={form.control}
            label="Name"
            placeholder="Name"
          />
          <InputField
            fieldName="email"
            control={form.control}
            label="Email Address"
            placeholder="Email Address"
            inputType="email"
          />
          <InputField
            fieldName="phoneNumber"
            control={form.control}
            label="Mobile Number (Optional)"
            placeholder="Mobile Number"
            autoComplete="off"
            maxLength={10}
            onChange={(e) => allowNumbersOnChange(e, form, "phoneNumber")}
          />
          {/* <InputField
            fieldName="phoneNumber"
            control={form.control}
            label="Mobile Number"
            placeholder="Mobile Number"
            autoComplete="off"
            maxLength={10}
            onChange={(e) => allowNumbersOnChange(e, form, "phoneNumber")}
          /> */}
          <InputField
            className="space-y-1"
            control={form.control}
            fieldName="password"
            label="Password"
            placeholder="Password"
            inputType="password"
            popoverTrigger={<MdInfo size={16} />}
            popoverContent={
              <ul className="text-sm space-y-1">
                {passwordRules.map((rule, index) => (
                  <li key={index} className="text-gray-200">
                    • {rule.message}
                  </li>
                ))}
              </ul>
            }
          />
          <InputField
            control={form.control}
            fieldName="confirmPassword"
            label="Confirm password"
            placeholder="Confirm password"
            inputType="password"
          />
          {/* <SelectComponent
            id="role"
            label="Role"
            placeholder="Role"
            fieldName="role"
            control={form.control}
            labelClassName="font-medium"
            options={navItems}
          /> */}
          <SelectComponent
            id="language"
            label="Language"
            placeholder="Language"
            fieldName="language"
            control={form.control}
            labelClassName="font-medium"
            options={languageOptions}
          />
        </div>

        <Button
          type="submit"
          className="mt-8 h-11 w-full rounded-xl"
          isLoading={isLoading}
          disabled={!form.formState.isValid}
        >
          <Translate>Create account</Translate>
        </Button>

        <Paragraph className="mt-7 max-lg:text-center">
          Already have an account?{" "}
          <AnchorButton
            href="/login?type=email"
            disabled={isLoading}
            label="Sign in"
          />
        </Paragraph>
      </form>
    </Form>
  )
}
