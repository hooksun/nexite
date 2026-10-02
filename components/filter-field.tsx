"use client"

import { ReactNode, useEffect, useId, useState } from "react"
import {
  Controller,
  UseControllerProps,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useDataView } from "@/hooks/use-data-view"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { useSearchParams } from "next/navigation"
import { formInput, FormInput } from "./form-inputs"

export default function FilterField(
  {
    name,
    label,
    submitOnChange = false,
    className,
    render = formInput(),
    orientation = "horizontal",
    ...props
  }: {
    label?: ReactNode
    submitOnChange?: boolean
    className?: string
    orientation?: "vertical" | "horizontal" | "responsive" | null
    render?: FormInput
  } & Omit<UseControllerProps, "control"> //Force use of FormProvider
) {
  const id = useId()

  const searchParams = useSearchParams()
  const defaultValue = searchParams.get(name) ?? undefined

  const { setValue, resetField } = useFormContext()
  const { setState, pagination } = useDataView()

  const [mountState, setMountState] = useState(0)
  const mounted = mountState >= 2

  useEffect(() => {
    if (!mounted) {
      setMountState(mountState + 1)
    }
  }, [mountState])

  const value = useWatch({ name, disabled: !submitOnChange })

  useEffect(() => {
    resetField(name, { defaultValue, keepDirty: false })
  }, [defaultValue])

  useEffect(() => {
    if (!mounted || !submitOnChange) {
      return
    }

    setValue(name, value)
    setState({
      [name]: value,
      ...(pagination ? { [pagination.param]: "1" } : {}),
    })
  }, [value])

  return (
    <Controller
      name={name}
      {...props}
      render={({ field, fieldState, formState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={className}
          orientation={orientation}
        >
          {label && (
            <FieldLabel htmlFor={id} className="capitalize">
              {label}
            </FieldLabel>
          )}
          {render({ field, fieldState, formState, id })}
          {fieldState.invalid && (
            <FieldError>{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}
