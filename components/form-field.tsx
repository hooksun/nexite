"use client"

import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field"
import { ReactNode, useId } from "react"
import { cn } from "@/lib/utils"
import { FormInput, formInput } from "./form-inputs"

export default function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label = name,
  description,
  className,
  rules,
  required = rules != undefined,
  orientation,
  input = formInput(),
  ...props
}: {
  label?: ReactNode
  description?: ReactNode
  className?: string
  required?: boolean
  orientation?: "vertical" | "horizontal" | "responsive" | null
  input?: FormInput<TFieldValues, TName>
} & UseControllerProps<TFieldValues, TName, TTransformedValues>) {
  const id = useId()
  return (
    <Controller
      name={name}
      rules={rules}
      {...props}
      render={({ field, fieldState, formState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("relative gap-1 pb-1", className)}
          orientation={orientation}
        >
          {label && (
            <FieldLabel htmlFor={id} className="capitalize">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          {description && (
            <FieldDescription className="in-data-vertical:-mt-1">
              {description}
            </FieldDescription>
          )}
          {input({ field, fieldState, formState, id })}
          {fieldState.invalid && (
            <FieldError className={cn("absolute top-full text-xs")}>
              {fieldState.error?.message}
            </FieldError>
          )}
        </Field>
      )}
    />
  )
}
