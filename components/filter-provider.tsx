"use client"

import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

const FilterContext = createContext({
  clear: () => {},
  clearEvent: -1,
  hasActiveFilters: false,
  setActiveFilter: (id: string, active: boolean) => {},
})

export function FilterProvider({ children }: { children: ReactNode }) {
  const [clearEvent, setClearEvent] = useState(0)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)
  const activeList = useRef<Record<string, boolean>>({})

  const clear = () => setClearEvent((c) => c + 1)

  const setActiveFilter = (id: string, active: boolean) => {
    activeList.current[id] = active

    setHasActiveFilters(Object.values(activeList.current).includes(true))
  }

  return (
    <FilterContext.Provider
      value={{
        clear,
        clearEvent,
        hasActiveFilters,
        setActiveFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter({
  onClear,
  isActive,
}: { onClear?: () => unknown; isActive?: boolean } = {}) {
  const { clear, clearEvent, hasActiveFilters, setActiveFilter } =
    useContext(FilterContext)

  useEffect(() => {
    if (clearEvent > 0) {
      onClear?.()
    }
  }, [clearEvent])

  const id = useId()
  useEffect(() => {
    if (isActive !== undefined) setActiveFilter(id, isActive)
  }, [isActive])

  return {
    clear,
    hasActiveFilters,
  }
}
