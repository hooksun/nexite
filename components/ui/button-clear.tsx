"use client"

import { Button } from "./button"
import { ButtonProps } from "@base-ui/react"
import { useDataView } from "@/hooks/use-data-view"
import { cn } from "cn"
import { useFormContext } from "react-hook-form"

export default function ButtonClear({
  children = "Clear Filters",
  ...props
}: ButtonProps) {
  const { setState, pagination } = useDataView()
  const { getValues, setValues } = useFormContext()

  const handleClear = () => {
    const emtpyState = Object.fromEntries(
      Object.keys(getValues()).map((key) => [key, null])
    )

    setState({
      ...emtpyState,
      ...(pagination ? { [pagination.param]: "1" } : {}),
    })
    setValues(emtpyState)
  }

  return (
    <Button
      variant="link"
      {...props}
      className={cn("text-muted-foreground", props.className)}
      onClick={handleClear}
    >
      {children}
    </Button>
  )
}
