"use client"

import { Funnel } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useSearchParams } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { useDataView } from "@/hooks/use-data-view"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { FieldValues, FormProvider, useForm } from "react-hook-form"
import FilterField from "./filter-field"
import { dateInput, formInput } from "./form-inputs"

function FilterButton({
  active,
}: {
  active: boolean
  onClick?: () => unknown
}) {
  return (
    <Button
      variant={active ? "default" : "secondary"}
      size="icon-xs"
      aria-label="Filter"
    >
      <Funnel />
    </Button>
  )
}

export function FilterForm({
  children,
}: {
  children:
    | ReactNode
    | ((
        setOpen: (open: boolean) => unknown,
        setValues: (data: FieldValues) => unknown
      ) => ReactNode)
}) {
  const { setState } = useDataView()

  const form = useForm()

  const [open, setOpen] = useState(false)

  const setValues = (data: FieldValues) => {
    setState(data)
    form.reset(data)
  }

  const handleSubmit = (data: FieldValues) => {
    if (form.formState.isDirty) {
      setValues(data)
    }
    setOpen(false)
  }

  const active = !!Object.values(form.formState.defaultValues ?? {}).find(
    (v) => v
  )

  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset(form.getValues())
      if (!open) {
        setState(form.getValues())
      }
    }
  }, [open])

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) handleSubmit(form.getValues())
      }}
    >
      <PopoverTrigger render={FilterButton({ active })} />
      <PopoverContent align="start" keepMounted>
        <FormProvider {...form}>
          <form className="contents" onSubmit={form.handleSubmit(handleSubmit)}>
            {typeof children === "function"
              ? children(setOpen, setValues)
              : children}
            <button type="submit" className="hidden" />
          </form>
        </FormProvider>
      </PopoverContent>
    </Popover>
  )
}

export function FilterChecklist({
  param,
  list,
}: {
  param: string
  list?: string[]
}) {
  const searchParams = useSearchParams()
  const { setState } = useDataView()

  const state = searchParams.get(param)

  const [selected, setSelected] = useState(new Set(state?.split(",")))
  const [open, setOpen] = useState(false)

  const setItemSelected = (item: string, value: boolean) => {
    setSelected((prev) => {
      const newSet = new Set(prev)
      if (value) {
        newSet.add(item)
      } else {
        newSet.delete(item)
      }

      return newSet
    })
  }

  useEffect(() => {
    if (!open) return
    setState({
      [param]: [...selected].join(",") || null,
    })
  }, [selected])

  const clear = () => {
    setSelected(new Set())
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={FilterButton({ active: selected.size > 0 })}
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {list?.map((item) => (
            <DropdownMenuCheckboxItem
              key={item}
              checked={selected.has(item)}
              onCheckedChange={(c) => setItemSelected(item, c)}
            >
              {item}
            </DropdownMenuCheckboxItem>
          ))}
          {selected.size > 0 && (
            <div className="flex justify-end">
              <Button
                className="text-muted-foreground"
                size="xs"
                variant="link"
                onClick={clear}
              >
                Clear
              </Button>
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function FilterRange({
  startParam,
  endParam,
}: {
  startParam: string
  endParam: string
}) {
  const clear = (submit: (data: FieldValues) => unknown) => {
    submit({
      [startParam]: null,
      [endParam]: null,
    })
  }

  return (
    <FilterForm>
      {(_, setValues) => (
        <>
          <div className="flex items-center gap-2">
            <FilterField
              name={startParam}
              render={formInput({ inputMode: "numeric" })}
            />
            -
            <FilterField
              name={endParam}
              render={formInput({ inputMode: "numeric" })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              className="justify-end text-muted-foreground"
              size="xs"
              variant="link"
              onClick={() => clear(setValues)}
            >
              Clear
            </Button>
          </div>
        </>
      )}
    </FilterForm>
  )
}

export function FilterDateRange({
  startParam,
  endParam,
  valueFormat = "yyyy-MM-dd",
}: {
  startParam: string
  endParam: string
  valueFormat?: string
}) {
  const today = (submit: (data: FieldValues) => unknown) => {
    submit({
      [startParam]: format(new Date(), valueFormat),
      [endParam]: format(new Date(), valueFormat),
    })
  }

  const week = (submit: (data: FieldValues) => unknown) => {
    submit({
      [startParam]: format(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
        valueFormat
      ),
      [endParam]: format(
        endOfWeek(new Date(), { weekStartsOn: 1 }),
        valueFormat
      ),
    })
  }

  const month = (submit: (data: FieldValues) => unknown) => {
    submit({
      [startParam]: format(startOfMonth(new Date()), valueFormat),
      [endParam]: format(endOfMonth(new Date()), valueFormat),
    })
  }

  const year = (submit: (data: FieldValues) => unknown) => {
    submit({
      [startParam]: format(startOfYear(new Date()), valueFormat),
      [endParam]: format(endOfYear(new Date()), valueFormat),
    })
  }

  const clear = (submit: (data: FieldValues) => unknown) => {
    submit({
      [startParam]: null,
      [endParam]: null,
    })
  }

  return (
    <FilterForm>
      {(_, setValues) => (
        <>
          <div className="flex items-center gap-2">
            <FilterField
              name={startParam}
              render={dateInput({ valueFormat })}
            />
            -
            <FilterField name={endParam} render={dateInput({ valueFormat })} />
          </div>
          <div className="flex justify-between">
            <Button
              className="justify-end text-muted-foreground"
              size="xs"
              variant="link"
              onClick={() => today(setValues)}
            >
              Today
            </Button>
            <Button
              className="justify-end text-muted-foreground"
              size="xs"
              variant="link"
              onClick={() => week(setValues)}
            >
              Week
            </Button>
            <Button
              className="justify-end text-muted-foreground"
              size="xs"
              variant="link"
              onClick={() => month(setValues)}
            >
              Month
            </Button>
            <Button
              className="justify-end text-muted-foreground"
              size="xs"
              variant="link"
              onClick={() => year(setValues)}
            >
              Year
            </Button>
            <Button
              className="justify-end text-muted-foreground"
              size="xs"
              variant="link"
              onClick={() => clear(setValues)}
            >
              Clear
            </Button>
          </div>
        </>
      )}
    </FilterForm>
  )
}
