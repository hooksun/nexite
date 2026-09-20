"use client"

import { useLoading } from "@/components/loading-context"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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

  const { update } = useContext(PathStateContext)

  const [_, setLoading] = useLoading()

  useEffect(() => {
    const currentQuery = searchParams.toString()
    if (currentQuery != localStorage.getItem(storageKey + pathname)) {
      localStorage.setItem(storageKey + pathname, currentQuery)
      update()
    }
  }, [pathname, searchParams])

  const setState = (data: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams)

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    setLoading(true)

    localStorage.setItem(storageKey + pathname, newParams.toString())
    update()
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  return {
    searchParams,
    setState,
  }
}
