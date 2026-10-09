"use client"

import FormField from "@/components/form-field"
import { Button } from "@/components/ui/button"
import ButtonLoading from "@/components/ui/button-loading"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet"
import { FieldGroup } from "@/components/ui/field"
import { useAlertDialog } from "@/hooks/use-alert-dialog"
import { upsertTable } from "@/lib/supabase/crud-actions"
import { Database } from "@/lib/supabase/supabase-types"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { dateInput, formInput, selectString } from "@/components/form-inputs"
import { toast } from "@/components/ui/toast"

const table = "sandbox"

export default function InputSheet({
  defaultValues,
  statusOptions,
  open,
  onOpenChange,
}: {
  defaultValues?: Database["public"]["Tables"][typeof table]["Row"]
  statusOptions: string[]
  open: boolean
  onOpenChange: (open: boolean) => unknown
}) {
  const form = useForm<Database["public"]["Tables"][typeof table]["Row"]>({
    defaultValues,
  })

  const { confirm } = useAlertDialog()

  useEffect(() => {
    form.resetDefaultValues(defaultValues ?? {})
    form.reset()
  }, [defaultValues])

  const onSubmit = async (
    data: Database["public"]["Tables"][typeof table]["Row"]
  ) => {
    const { name, date, value, status } = data

    const { error } = await upsertTable(table, [
      {
        id: data?.id,
        name,
        date,
        value,
        status,
      },
    ])

    if (error) {
      toast.add({
        type: "error",
        title: "Error occurred",
        description: error.message,
      })
    } else {
      toast.add({
        type: "success",
        description: "Data inputted successfully",
      })
      onOpenChange(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open && form.formState.isDirty) {
          confirm({
            onConfirm: () => onOpenChange(open),
            title: "Discard Changes?",
            description: "Changes will be lost",
          })
          return
        }

        onOpenChange(open)
      }}
      onOpenChangeComplete={(open) => {
        if (!open) {
          form.reset()
        }
      }}
    >
      <SheetContent side="right" showCloseButton={false}>
        <FormProvider {...form}>
          <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <FieldGroup>
                <FormField
                  name="name"
                  rules={{ required: "Name must be filled" }}
                />
                <FormField
                  name="date"
                  rules={{ required: "Date must be filled" }}
                  input={dateInput()}
                />
                <FormField
                  name="value"
                  rules={{
                    required: "Value must be filled",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Please enter a valid number",
                    },
                  }}
                  input={formInput({ inputMode: "numeric" })}
                />
                <FormField
                  name="status"
                  rules={{ required: "Status must be filled" }}
                  input={selectString({
                    options: statusOptions,
                  })}
                />
              </FieldGroup>
            </SheetHeader>
            <SheetFooter>
              <ButtonLoading
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Submit
              </ButtonLoading>
              <SheetClose render={<Button variant="outline" />}>
                Cancel
              </SheetClose>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
