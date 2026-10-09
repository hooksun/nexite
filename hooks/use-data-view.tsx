"use client"

import { LoadingContext } from "@/components/loading-context"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { usePathState } from "./use-path-state"
import { SupabaseSelectResponse } from "./use-supabase-select"
import { FilterProvider } from "@/components/filter-provider"

const dataViewContext = createContext<{
  response?: SupabaseSelectResponse<any[]>
  sorting?: {
    param: string
    sorting?: string[]
  }
  pagination?: {
    param: string
    page: number
    pageSize: number
  }
  setState: (
    state: Record<string, string | null>,
    resetPagination?: boolean
  ) => unknown
}>({
  setState: () => {},
})

export function DataViewProvider({
  children,
  loading = false,
  stateType = "path-state",
  ...props
}: {
  response?: SupabaseSelectResponse<any[]>
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
        setState: (state, resetPagination = true) => {
          loadingState[1](true)
          setState({
            ...(resetPagination ? { page: null } : {}),
            ...state,
          })
        },
      }}
    >
      <LoadingContext state={loadingState}>
        <FilterProvider>{children}</FilterProvider>
      </LoadingContext>
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
