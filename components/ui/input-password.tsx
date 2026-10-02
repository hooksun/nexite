"use client"

import { InputHTMLAttributes, useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group"
import { Eye, EyeClosed } from "lucide-react"

export default function InputPassword(
  props?: InputHTMLAttributes<HTMLInputElement>
) {
  const [hide, setHide] = useState(true)

  return (
    <InputGroup>
      <InputGroupInput type={hide ? "password" : "text"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => setHide((h) => !h)}>
          {hide ? <EyeClosed /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
