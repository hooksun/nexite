"use client"

import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseControllerProps,
  UseFormStateReturn,
} from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field"
import {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  useId,
} from "react"
import InputPassword from "./ui/input-password"
import InputSelect, { InputSelectProps } from "./ui/input-select"
import { Optional } from "@/lib/utils"
import InputSearch from "./ui/input-search"
import InputPrice, { InputPriceProps } from "./ui/input-price"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

type FormInput = ({
  field,
  fieldState,
  formState,
  id,
}: {
  field: ControllerRenderProps<FieldValues, string>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<FieldValues>
  id: string
}) => React.ReactElement

export function formInput({
  left,
  right,
  ...props
}: {
  left?: ReactNode
  right?: ReactNode
} & InputHTMLAttributes<HTMLInputElement> = {}): FormInput {
  return ({ field, id }) => (
    <InputGroup>
      {left && <InputGroupAddon>{left}</InputGroupAddon>}
      <InputGroupInput
        id={id}
        {...props}
        {...field}
        value={field.value ?? ""}
      />
      {right && <InputGroupAddon align="inline-end">{right}</InputGroupAddon>}
    </InputGroup>
  )
}

export function passwordInput(
  props?: InputHTMLAttributes<HTMLInputElement>
): FormInput {
  return ({ field, id }) => (
    <InputPassword id={id} {...props} {...field} value={field.value ?? ""} />
  )
}

export function priceInput(props?: InputPriceProps): FormInput {
  return ({ field, id }) => (
    <InputPrice id={id} {...props} {...field} value={field.value ?? ""} />
  )
}

export function selectInput<V, O>(
  props: Omit<InputSelectProps<V, O>, "value" | "onChange">
): FormInput {
  return ({ field, id }) => <InputSelect id={id} {...props} {...field} />
}

export function selectString({
  optionToValue = (o) => o,
  renderOption = (o) => o,
  renderValue = (v) => v,
  ...props
}: Optional<
  Omit<InputSelectProps<string, string>, "value" | "onChange">,
  "optionToValue" | "renderOption" | "renderValue"
>): FormInput {
  return ({ field, id }) => (
    <InputSelect
      id={id}
      optionToValue={optionToValue}
      renderOption={renderOption}
      renderValue={renderValue}
      {...props}
      {...field}
    />
  )
}

export function searchInput(
  props?: TextareaHTMLAttributes<HTMLTextAreaElement>
): FormInput {
  return ({ field, id }) => <InputSearch id={id} {...props} {...field} />
}

export default function FormField({
  name,
  label = name,
  description,
  className,
  render = formInput(),
  ...props
}: {
  label?: ReactNode
  description?: ReactNode
  className?: string
  render?: FormInput
} & UseControllerProps) {
  const id = useId()
  return (
    <Controller
      name={name}
      {...props}
      render={({ field, fieldState, formState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && (
            <FieldLabel htmlFor={id} className="capitalize">
              {label}
            </FieldLabel>
          )}
          {render({ field, fieldState, formState, id })}
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && (
            <FieldError>{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}
