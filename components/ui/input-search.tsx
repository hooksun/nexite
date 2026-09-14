"use client"

import { TextareaHTMLAttributes, useRef, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "./input-group"
import { Badge } from "./badge"
import { CircleX } from "lucide-react"
import { cn } from "cn"
import { Popover, PopoverContent } from "./popover"

export default function InputSearch<O>({
  value,
  onChange,
  ...props
}: {
  value: string[] | null
  onChange: (value: string[] | null) => unknown
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const anchor = useRef<HTMLDivElement>(null)

  const addValue = (added: string) => {
    onChange([...(value ?? []), added])
  }

  const removeAt = (index: number) => {
    onChange(value?.toSpliced(index, 1) ?? null)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <InputGroup className="flex-wrap" ref={anchor}>
        {value?.map((val, i) => (
          <InputGroupAddon key={i}>
            <Badge
              className="cursor-pointer"
              variant="secondary"
              onClick={() => removeAt(i)}
            >
              {val}
              <CircleX />
            </Badge>
          </InputGroupAddon>
        ))}
        <InputGroupTextarea
          rows={1}
          {...props}
          className={cn(
            "min-h-auto min-w-fit flex-1 text-nowrap",
            props?.className
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addValue(query)
              setQuery("")
            }
          }}
          value={query}
          onChange={(e) => {
            setOpen(e.target.value != "")
            setQuery(e.target.value)
          }}
          onFocus={() => setOpen(query != "")}
        />
      </InputGroup>

      <PopoverContent
        anchor={anchor}
        initialFocus={false}
        finalFocus={false}
        className="w-(--anchor-width)"
      >
        searching...
      </PopoverContent>
    </Popover>
  )
}
