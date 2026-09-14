"use client"

import FormField, {
  formInput,
  passwordInput,
  priceInput,
  searchInput,
  selectString,
} from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { FormProvider, useForm } from "react-hook-form"

export default function Page() {
  const form = useForm()

  return (
    <div className="mx-auto w-full max-w-160 p-6">
      <FormProvider {...form}>
        <FieldGroup>
          <form
            className="contents"
            onSubmit={form.handleSubmit((data) => console.log(data))}
          >
            <div className="grid grid-flow-col gap-4">
              <FormField
                label="first name"
                name="firstName"
                rules={{ required: "Must be filled" }}
              />
              <FormField label="last name" name="lastName" />
            </div>
            <FormField
              name="email"
              rules={{ required: "Must be filled" }}
              render={formInput({ type: "email" })}
            />
            <FormField
              name="password"
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
              name="gender"
              rules={{
                required: "Must be filled",
              }}
              render={selectString({
                options: ["Male", "Female"],
                optionsLabel: "Choose gender",
              })}
            />
            <FormField
              name="date"
              rules={{ required: "Must be filled" }}
              render={formInput({ type: "date" })}
            />
            <FormField
              name="search"
              rules={{
                required: "Must be filled",
              }}
              render={searchInput()}
            />
            <FormField
              name="price"
              rules={{
                required: "Must be filled",
              }}
              render={priceInput()}
            />
            <Button type="submit">Submit</Button>
          </form>
        </FieldGroup>
      </FormProvider>
    </div>
  )
}
