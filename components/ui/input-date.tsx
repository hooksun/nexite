import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { CalendarIcon } from "lucide-react"
import { format, parse } from "date-fns"
import { cn } from "cn"

export default function InputDate({
  id,
  value,
  onChange,
  placeholder,
  valueFormat = "yyyy-MM-dd",
  displayFormat = "dd/MM/yyyy",
  className,
  ...props
}: {
  id?: string
  value: string | null
  onChange: (value: string | null) => unknown
  placeholder?: string
  valueFormat?: string
  displayFormat?: string
  className?: string
} & Omit<Parameters<typeof Calendar>[0], "mode" | "selected" | "onSelect">) {
  const date = value ? parse(value, valueFormat, new Date()) : undefined
  const setDate = (date: Date | undefined) => {
    onChange(date ? format(date, valueFormat) : null)
    setOpen(false)
  }

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant={"outline"}
            data-empty={!date}
            // data-slot="input"
            className={cn(
              "w-full shrink justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
              className
            )}
          >
            {date ? format(date, displayFormat) : <span>{placeholder}</span>}
            <CalendarIcon className="text-foreground" data-icon="inline-end" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          defaultMonth={date}
          captionLayout="dropdown"
          {...props}
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}
