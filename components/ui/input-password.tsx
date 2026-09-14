"use client"

import { InputHTMLAttributes, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import { Eye, EyeClosed } from "lucide-react"
import { Button } from "./button"

export default function InputPassword(
  props?: InputHTMLAttributes<HTMLInputElement>
) {
  const [hide, setHide] = useState(true)

  return (
    <InputGroup>
      <InputGroupInput type={hide ? "password" : "text"} {...props} />
      <InputGroupAddon align="inline-end">
        <Button variant="ghost" size="xs" onClick={() => setHide((h) => !h)}>
          {hide ? <EyeClosed /> : <Eye />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}
