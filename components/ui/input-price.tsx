import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import { NumericFormat, NumericFormatProps } from "react-number-format"

export type InputPriceProps = { onChange?: (value: string) => unknown } & Omit<
  NumericFormatProps,
  "onChange"
>

export default function InputPrice({ onChange, ...props }: InputPriceProps) {
  return (
    <InputGroup>
      <InputGroupAddon>Rp.</InputGroupAddon>
      <NumericFormat
        customInput={InputGroupInput}
        thousandSeparator
        onValueChange={({ value }) => onChange && onChange(value)}
        {...props}
      />
    </InputGroup>
  )
}
