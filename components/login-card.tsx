"use client"

import { FormProvider, useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { FieldError, FieldGroup } from "./ui/field"
import {
  loginAnonymous,
  loginWithEmail,
  signUpWithEmail,
} from "@/app/auth/actions"
import FormField from "./form-field"
import { Button } from "./ui/button"
import { forwardRef, useState } from "react"
import { HatGlasses } from "lucide-react"
import ButtonLoading from "./ui/button-loading"
import { cn } from "cn"
import { formInput, passwordInput } from "./form-inputs"

const LoginCard = forwardRef<
  HTMLDivElement,
  { className?: string; onLogin?: () => unknown }
>(({ className, onLogin }, ref) => {
  const form = useForm()

  const [error, setError] = useState("")

  const [isLogin, setIsLogin] = useState(true)

  const login = async (data: Record<string, string>) => {
    setError("")

    const { error } = await loginWithEmail(
      data as {
        email: string
        password: string
      }
    )

    setError(error?.message ?? "")

    if (!error) {
      onLogin && onLogin()
    }
  }

  const signUp = async (data: Record<string, string>) => {
    setError("")

    const { error } = await signUpWithEmail(
      data as {
        email: string
        password: string
      }
    )

    setError(error?.message ?? "")

    if (!error) {
      onLogin && onLogin()
    }
  }

  const loginAnon = async () => {
    setError("")

    const { error } = await loginAnonymous()

    setError(error?.message ?? "")

    if (!error) {
      onLogin && onLogin()
    }
  }

  return (
    <FormProvider {...form}>
      <Card className={cn("w-80 self-center", className)} ref={ref}>
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? "Login" : "Sign up"}
            <br />
            to access complete features
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form
            className="contents"
            onSubmit={form.handleSubmit(isLogin ? login : signUp)}
          >
            <FieldGroup className="justify-center">
              <FormField
                name="email"
                required={false} // to remove * from label
                rules={{ required: "Must be filled" }}
                render={formInput({ type: "email" })}
              />
              <FormField
                name="password"
                required={false} // to remove * from label
                rules={{
                  required: "Must be filled",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                }}
                render={passwordInput({ placeholder: "Min. 8 characters" })}
              />
              {!isLogin && (
                <FormField
                  name="confirmPassword"
                  label="confirm Password"
                  rules={{
                    validate: (value) =>
                      value == form.getValues("password") ||
                      "Must be same as Password",
                  }}
                  render={passwordInput()}
                />
              )}
              {error && (
                <FieldError className="text-center">{error}</FieldError>
              )}
              <ButtonLoading
                loading={form.formState.isSubmitting}
                type="submit"
              >
                {isLogin ? "Login" : "Sign up"}
              </ButtonLoading>
            </FieldGroup>
          </form>
          {isLogin && (
            <ButtonLoading onClick={loginAnon}>
              <HatGlasses /> Login Anonymously
            </ButtonLoading>
          )}
          <Button
            size="sm"
            type="button"
            variant="link"
            className="text-muted-foreground"
            onClick={() => {
              setIsLogin((b) => !b)
              setError("")
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </Button>
        </CardContent>
      </Card>
    </FormProvider>
  )
})

export default LoginCard
