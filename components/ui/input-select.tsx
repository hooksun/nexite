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

export type InputSelectProps<V, O> = {
  value: V
  onChange: (value: V | null) => unknown
  options: O[]
  optionToValue: (option: O) => V
  renderOption: (option: O) => ReactNode
  renderValue: (value: V) => ReactNode
  optionsLabel?: string
  alignItemWithTrigger?: boolean
  id?: string
  className?: string
  placeholder?: string
}

export default function InputSelect<V, O>({
  value,
  onChange,
  options,
  optionToValue,
  renderOption,
  renderValue,
  optionsLabel,
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
          {options?.map((option, i) => (
            <SelectItem key={i} value={optionToValue(option)}>
              {renderOption(option)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
