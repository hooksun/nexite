"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

const PathStateContext = createContext({
  update: () => {
    console.error("PathStateProvider hasn't been set")
  },
})

const storageKey = "page_state:"

export default function PathStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const [_, setUpdate] = useState(false)

  return (
    <PathStateContext.Provider value={{ update: () => setUpdate((u) => !u) }}>
      {children}
    </PathStateContext.Provider>
  )
}

export function usePath() {
  useContext(PathStateContext) //rerender when update PathStateContext

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
    ? (path: string) => {
        const savedParams = localStorage?.getItem(storageKey + path)
        if (!savedParams) {
          return path
        }
        return `${path}?${savedParams}`
      }
    : (path: string) => path
}

export function usePathState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [paramChanged, setParamChanged] = useState(false)
  const dirtyState = useRef(new URLSearchParams(searchParams))

  const { update } = useContext(PathStateContext)

  useEffect(() => {
    dirtyState.current = new URLSearchParams(searchParams)

    const currentQuery = searchParams.toString()
    if (currentQuery != localStorage.getItem(storageKey + pathname)) {
      localStorage.setItem(storageKey + pathname, currentQuery)
      update()
    }
  }, [pathname, searchParams])

  const setState = (data: Record<string, string | null>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        dirtyState.current.set(key, value)
      } else {
        dirtyState.current.delete(key)
      }
    })

    setParamChanged(true)
  }

  useEffect(() => {
    if (!paramChanged) {
      return
    }

    localStorage.setItem(storageKey + pathname, dirtyState.current.toString())
    update()
    router.replace(`${pathname}?${dirtyState.current.toString()}`, {
      scroll: false,
    })

    setParamChanged(false)
  }, [paramChanged])

  return {
    searchParams,
    setState,
  }
}
