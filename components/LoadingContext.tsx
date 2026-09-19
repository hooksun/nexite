import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"

const loadingContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}])

export function LoadingContext({
  children,
  defaultLoading = false,
  state: _state,
}: {
  children: ReactNode
  defaultLoading?: boolean
  state?: [boolean, Dispatch<SetStateAction<boolean>>]
}) {
  const state = _state ?? useState(defaultLoading)

  return (
    <loadingContext.Provider value={state}>{children}</loadingContext.Provider>
  )
}

export function useLoading() {
  return useContext(loadingContext)
}
