"use client"

import { ReactNode, useEffect, useId, useState } from "react"
import { FormInput, formInput } from "./form-field"
import {
  Controller,
  UseControllerProps,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useDataView } from "@/hooks/use-data-view"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { useSearchParams } from "next/navigation"

export default function FilterField({
  name,
  label,
  submitOnChange = false,
  className,
  render = formInput(),
  ...props
}: {
  label?: ReactNode
  submitOnChange?: boolean
  className?: string
  render?: FormInput
} & UseControllerProps) {
  const id = useId()

  const searchParams = useSearchParams()
  const defaultValue = searchParams.get(name)

  const { setValue } = useFormContext()
  const { setState, pagination } = useDataView()

  const value = useWatch({ name, disabled: !submitOnChange })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) {
      return
    }

    if (submitOnChange) {
      setValue(name, value)
      setState({
        [name]: value,
        ...(pagination ? { [pagination.param]: "1" } : {}),
      })
    }
  }, [value])

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted])

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      {...props}
      render={({ field, fieldState, formState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={className}
          orientation="horizontal"
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
