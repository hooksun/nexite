import InputSearch, { InputSearchProps } from "./ui/input-search"
import InputPrice, { InputPriceProps } from "./ui/input-price"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group"
import InputDate from "./ui/input-date"
import InputSearchSupabase from "./input-search-supabase"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import { Checkbox } from "./ui/checkbox"
import InputPassword from "./ui/input-password"
import InputSelect, { InputSelectProps } from "./ui/input-select"
import { Optional } from "@/lib/utils"
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldPathByValue,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form"
import { InputHTMLAttributes, ReactNode } from "react"
import { X } from "lucide-react"

export type FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ({
  field,
  fieldState,
  formState,
  id,
}: {
  field: ControllerRenderProps<TFieldValues, TName>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TFieldValues>
  id: string
}) => ReactNode

export function formInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  left,
  right,
  clear,
  ...props
}: {
  left?: ReactNode
  right?: ReactNode
  clear?: boolean
} & InputHTMLAttributes<HTMLInputElement> = {}): FormInput<
  TFieldValues,
  TName
> {
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
      {clear && field.value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear"
            onClick={() => field.onChange("")}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export function passwordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props?: InputHTMLAttributes<HTMLInputElement>
): FormInput<TFieldValues, TName> {
  return ({ field, id }) => (
    <InputPassword id={id} {...props} {...field} value={field.value ?? ""} />
  )
}

export function priceInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props?: InputPriceProps): FormInput<TFieldValues, TName> {
  return ({ field, id }) => (
    <InputPrice id={id} {...props} {...field} value={field.value ?? ""} />
  )
}

export function selectInput<
  V,
  O,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, V | null> = FieldPathByValue<
    TFieldValues,
    V | null
  >,
>(
  props: Omit<InputSelectProps<V, O>, "value" | "onChange">
): FormInput<TFieldValues, TName> {
  return ({ field, id }) => <InputSelect id={id} {...props} {...field} />
}

export function selectString<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | null> =
    FieldPathByValue<TFieldValues, string | null>,
>({
  optionToValue = (o) => o,
  renderOption = (o) => o,
  renderValue = (v) => v,
  ...props
}: Optional<
  Omit<InputSelectProps<string, string>, "value" | "onChange">,
  "optionToValue" | "renderOption" | "renderValue"
>): FormInput<TFieldValues, TName> {
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

export function searchInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string[] | null> =
    FieldPathByValue<TFieldValues, string[] | null>,
>(props?: Partial<InputSearchProps>): FormInput<TFieldValues, TName> {
  return ({ field, id }) => <InputSearch id={id} {...props} {...field} />
}

export function searchInputSupabase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string[] | null> =
    FieldPathByValue<TFieldValues, string[] | null>,
>(
  props: Omit<Parameters<typeof InputSearchSupabase>[0], "value" | "onChange">
): FormInput<TFieldValues, TName> {
  return ({ field, id }) => (
    <InputSearchSupabase id={id} {...props} {...field} />
  )
}

export function dateInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | null> =
    FieldPathByValue<TFieldValues, string | null>,
>(
  props?: Partial<Parameters<typeof InputDate>[0]>
): FormInput<TFieldValues, TName> {
  return ({ field, id }) => <InputDate id={id} {...props} {...field} />
}

export function textareaInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props?: Partial<Parameters<typeof Textarea>[0]>
): FormInput<TFieldValues, TName> {
  return ({ field, id }) => (
    <Textarea id={id} {...props} {...field} value={field.value ?? ""} />
  )
}

export function switchInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean> = FieldPathByValue<
    TFieldValues,
    boolean
  >,
>(
  props?: Partial<Parameters<typeof Switch>[0]>
): FormInput<TFieldValues, TName> {
  return ({ field, id }) => (
    <Switch
      id={id}
      {...props}
      {...field}
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  )
}

export function checkboxInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean> = FieldPathByValue<
    TFieldValues,
    boolean
  >,
>(
  props?: Partial<Parameters<typeof Switch>[0]>
): FormInput<TFieldValues, TName> {
  return ({ field, id }) => (
    <Checkbox
      id={id}
      {...props}
      {...field}
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  )
}
