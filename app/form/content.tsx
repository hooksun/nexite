"use client"

import FormField from "@/components/form-field"
import {
  checkboxInput,
  dateInput,
  formInput,
  passwordInput,
  priceInput,
  searchInputSupabase,
  selectString,
  switchInput,
  textareaInput,
} from "@/components/form-inputs"
import LoginCard from "@/components/login-card"
import ButtonLoading from "@/components/ui/button-loading"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { Database } from "@/lib/supabase/supabase-types"
import { User } from "@supabase/supabase-js"
import { useEffect, useRef, useState } from "react"
import { Control, useForm } from "react-hook-form"
import { upsertValue } from "./actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useAlertDialog } from "@/hooks/use-alert-dialog"
import { deleteTable } from "@/lib/supabase/crud-actions"
import Header from "@/components/ui/header"

export default function PageContent({
  user,
  defaultValues,
  hasResponse = false,
  loading = false,
}: {
  user?: User
  defaultValues?: Database["public"]["Tables"]["response"]["Row"]
  hasResponse?: boolean
  loading?: boolean
}) {
  const { control, handleSubmit, watch, formState, reset, setValues } = useForm(
    {
      defaultValues: {
        first_name: "",
        last_name: "" as string | null,
        email: "",
        sensitive: "password123",
        select: "",
        date: "",
        search: ["United States", "Indonesia"],
        price: 10000000,
        condition: false,
        conditional: "" as string | null,
        consent: false,
      },
      disabled: loading,
    }
  )

  useEffect(() => {
    if (hasResponse) {
      setValues({
        condition: !!defaultValues?.conditional,
        consent: hasResponse,
        ...defaultValues,
      })
    }
  }, [hasResponse, defaultValues])

  const { confirm } = useAlertDialog()

  const [openLogin, setOpenLogin] = useState(false)

  const submitAfterLogin = useRef(false)

  useEffect(() => {
    if (user && submitAfterLogin.current) {
      submitAfterLogin.current = false
      handleSubmit(onSubmit)()
    }
  }, [user])

  type FormValues = typeof control extends Control<infer T> ? T : never

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setOpenLogin(true)
      return
    }

    const { condition, conditional, consent, ...usedData } = data

    const { error } = await upsertValue({
      id: defaultValues?.id,
      conditional: condition ? conditional : null,
      ...usedData,
    })

    if (error) {
      toast.add({
        type: "error",
        description: error.message,
      })
      return
    }

    toast.add({
      type: "success",
      description: `Your response was ${defaultValues ? "updated" : "inserted"} successfully`,
    })
  }

  return (
    <>
      <Header title="Form Page" />
      <main className="mx-auto w-full max-w-160 p-6 pt-4">
        <FieldSet>
          <form className="contents" onSubmit={handleSubmit(onSubmit)}>
            <FieldLegend>Form Page</FieldLegend>
            <FieldDescription>
              Showcases a form made with react-hook-form with multiple field
              types and validation. Responses are saved in Supabase and can be
              edited.
            </FieldDescription>
            <FieldGroup>
              <div className="grid grid-flow-col gap-4">
                <FormField
                  control={control}
                  label="first name"
                  name="first_name"
                  rules={{ required: "Must be filled" }}
                />
                <FormField
                  control={control}
                  label="last name"
                  name="last_name"
                />
              </div>
              <FormField
                control={control}
                name="email"
                rules={{ required: "Must be filled" }}
                render={formInput({ type: "email" })}
              />
              <FormField
                control={control}
                name="sensitive"
                description="Sensitive data that can be hidden or shown (don't input your real password)"
                rules={{
                  required: "Must be filled",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                }}
                render={passwordInput({ placeholder: "Min. 8 characters" })}
              />
              <FormField
                control={control}
                name="select"
                rules={{
                  required: "Must be filled",
                }}
                render={selectString({
                  options: ["Male", "Female"],
                  optionsLabel: "Choose gender",
                })}
              />
              <FormField
                control={control}
                name="date"
                description="Date input with configurable display and output formats"
                rules={{ required: "Must be filled" }}
                render={dateInput({ displayFormat: "PPP" })}
              />
              <FormField
                control={control}
                name="search"
                description="Search input with dynamic fetching & multiple values, using countries as example values"
                rules={{
                  required: "Must be filled",
                }}
                render={searchInputSupabase({
                  table: "search",
                  column: "value",
                  limit: 10,
                  allowEmptyQuery: true,
                })}
              />
              <Collapsible open={watch("condition")}>
                <FormField
                  control={control}
                  name="condition"
                  orientation="horizontal"
                  render={switchInput()}
                />
                <CollapsibleContent animated>
                  <FormField
                    control={control}
                    name="conditional"
                    className="pt-5"
                    render={textareaInput({ placeholder: "Conditional input" })}
                  />
                </CollapsibleContent>
              </Collapsible>
              <FormField
                control={control}
                name="price"
                description="Price formatted input using react-number-format"
                rules={{
                  required: "Must be filled",
                }}
                render={priceInput()}
              />
              <FormField
                control={control}
                orientation="horizontal"
                name="consent"
                label="I consent to this data being uploaded and viewable by the owner"
                className="flex-row-reverse gap-2"
                render={checkboxInput()}
              />
              <div className="flex justify-between">
                <ButtonLoading
                  size="lg"
                  disabled={!watch("consent")}
                  type="submit"
                  loading={formState.isSubmitting}
                >
                  Submit
                </ButtonLoading>
                {hasResponse && (
                  <Button
                    className="text-destructive"
                    variant="link"
                    onClick={() =>
                      confirm({
                        destructive: true,
                        title: "Clear response?",
                        description: "response will be deleted",
                        onConfirm: async () => {
                          await deleteTable("response", [defaultValues?.id!])
                          reset()
                        },
                      })
                    }
                  >
                    <Trash2 />
                    Clear Response
                  </Button>
                )}
              </div>
            </FieldGroup>
          </form>
        </FieldSet>

        <Dialog open={openLogin} onOpenChange={setOpenLogin}>
          <DialogContent
            render={
              <LoginCard
                onLogin={() => {
                  setOpenLogin(false)
                  submitAfterLogin.current = true
                }}
              />
            }
          />
        </Dialog>
      </main>
    </>
  )
}
