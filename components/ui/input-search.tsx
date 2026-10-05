"use client"

import { ReactNode, useRef, useState } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./combobox"
import { OptionState } from "./input-select"
import { cn } from "cn"
import { Spinner } from "./spinner"

export type InputSearchProps = {
  value: string[] | null
  onChange: (value: string[] | null) => unknown
  onChangeQuery?: (value: string) => unknown
  options?: string[]
  renderOption?: (option: string) => ReactNode
  optionState?: OptionState
  autoHighlight?: boolean
  disabled?: boolean
} & Omit<Parameters<typeof ComboboxChipsInput>[0], "value" | "onChange">

export default function InputSearch({
  value,
  onChange,
  onChangeQuery,
  options,
  renderOption = (o) => o,
  optionState = "success",
  autoHighlight = true,
  disabled,
  ...props
}: InputSearchProps) {
  const anchor = useComboboxAnchor()
  const [query, setQuery] = useState("")

  return (
    <Combobox
      autoHighlight={autoHighlight}
      multiple
      value={value ?? []}
      onValueChange={onChange}
      items={options}
      inputValue={query}
      onInputValueChange={(value) => {
        setQuery(value)
        onChangeQuery && onChangeQuery(value)
      }}
      disabled={disabled}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {value?.map((item, i) => (
            <ComboboxChip key={i}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput {...props} />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty
          className={cn("p-4", optionState == "error" && "text-destructive")}
        >
          {optionState == "error" ? (
            "An error occured"
          ) : optionState == "loading" ? (
            <Spinner />
          ) : (options?.length ?? 0) == 0 ? (
            "Search Items"
          ) : (
            "No items found"
          )}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {renderOption(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
