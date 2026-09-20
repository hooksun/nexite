"use client"

import { LoadingContext } from "@/components/loading-context"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { usePathState } from "./use-path-state"

const dataViewContext = createContext<{
  response?: PostgrestSingleResponse<any[]>
  sorting?: {
    param: string
    sorting?: string[]
  }
  pagination?: {
    param: string
    page: number
    pageSize: number
  }
  setState: (state: Record<string, string | null>) => unknown
}>({
  setState: () => {},
})

export function DataViewProvider({
  children,
  loading = false,
  stateType = "path-state",
  ...props
}: {
  response?: PostgrestSingleResponse<any[]>
  sorting?: {
    param: string
    sorting?: string[]
  }
  pagination?: {
    param: string
    page: number
    pageSize: number
  }
  loading?: boolean
  stateType?: "path-state"
  children: ReactNode
}) {
  const { response } = props

  const { setState } = usePathState() // stateType == "path-state"

  const loadingState = useState(loading)

  useEffect(() => {
    loadingState[1](loading)
  }, [response])

  return (
    <dataViewContext.Provider
      value={{
        ...props,
        setState: (state) => {
          loadingState[1](true)
          setState(state)
        },
      }}
    >
      <LoadingContext state={loadingState}>{children}</LoadingContext>
    </dataViewContext.Provider>
  )
}

export function useDataView() {
  const { response, pagination, ...context } = useContext(dataViewContext)

  return {
    ...context,
    response,
    pagination: pagination
      ? {
          ...pagination,
          pageCount: Math.ceil((response?.count ?? 1) / pagination.pageSize),
        }
      : undefined,
  }
}
