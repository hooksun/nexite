"use client"

import { Button } from "./button"
import { useFilter } from "../filter-provider"

export default function ButtonClear({
  children = "Clear Filters",
  ...props
}: Parameters<typeof Button>[0]) {
  const { clear } = useFilter()

  return (
    <Button {...props} onClick={clear}>
      {children}
    </Button>
  )
}
