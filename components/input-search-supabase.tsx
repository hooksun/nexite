"use client"

import { Database } from "@/lib/supabase/supabase-types"
import InputSearch, { InputSearchProps } from "./ui/input-search"
import { useEffect, useState } from "react"
import { OptionState } from "./ui/input-select"
import { searchTable } from "@/lib/supabase/crud-actions"

export default function InputSearchSupabase({
  table,
  column,
  allowEmptyQuery,
  limit,
  ...props
}: {
  table: keyof Database["public"]["Tables"]
  column: string
  allowEmptyQuery?: boolean
  limit?: number
} & InputSearchProps) {
  const [options, setOptions] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [optionState, setOptionState] = useState<OptionState>("success")

  const debounceDelay = 300

  useEffect(() => {
    if (query == "" && !allowEmptyQuery) {
      setOptionState("success")
      setOptions([])
      return
    }

    let active = true

    setOptionState("loading")

    const timeout = setTimeout(async () => {
      const { data, error } = await searchTable(table, column, query, limit)

      if (!active) {
        return
      }

      if (error) {
        setOptionState("error")
        // setOptions([])
        return
      }
      setOptionState("success")
      setOptions(data ?? [])
    }, debounceDelay)

    return () => {
      clearTimeout(timeout)
      active = false
    }
  }, [query])

  return (
    <InputSearch
      {...props}
      onChangeQuery={setQuery}
      optionState={optionState}
      options={options}
    />
  )
}
