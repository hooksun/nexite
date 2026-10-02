import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"
import { ReactNode } from "react"
import { Spinner } from "./spinner"

export type InputSelectProps<V, O> = {
  value: V
  onChange: (value: V | null) => unknown
  options: O[]
  optionToValue: (option: O) => V
  renderOption: (option: O) => ReactNode
  renderValue: (value: V) => ReactNode
  optionsLabel?: string
  optionState?: OptionState
  alignItemWithTrigger?: boolean
  id?: string
  className?: string
  placeholder?: string
}

export type OptionState = "success" | "error" | "loading"

export default function InputSelect<V, O>({
  value,
  onChange,
  options,
  optionToValue,
  renderOption,
  renderValue,
  optionsLabel,
  optionState = "success",
  alignItemWithTrigger = false,
  id,
  ...props
}: InputSelectProps<V, O>) {
  return (
    <Select value={value ?? null} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue {...props}>{renderValue(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={alignItemWithTrigger}>
        <SelectGroup>
          {optionsLabel && <SelectLabel>{optionsLabel}</SelectLabel>}
          {optionState == "error" ? (
            <SelectLabel className="p-4 text-center text-destructive">
              An error has occured
            </SelectLabel>
          ) : options?.length > 0 ? (
            options.map((option, i) => (
              <SelectItem key={i} value={optionToValue(option)}>
                {renderOption(option)}
              </SelectItem>
            ))
          ) : optionState == "loading" ? (
            <SelectLabel className="p-4">
              <Spinner className="m-auto" />
            </SelectLabel>
          ) : (
            <SelectLabel className="p-4 text-center text-muted-foreground">
              No options
            </SelectLabel>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
