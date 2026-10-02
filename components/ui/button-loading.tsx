"use client"

import { Button } from "./button"
import { cn } from "cn"
import { useLoading } from "../loading-context"
import { Spinner } from "./spinner"
import { useState } from "react"

export default function ButtonLoading({
  children,
  className,
  onClick,
  loading: _loading,
  ...props
}: Parameters<typeof Button>[0] & { loading?: boolean }) {
  const [autoLoading] = useLoading()
  const [asyncLoading, setAsyncLoading] = useState(false)

  const loading = _loading ?? (asyncLoading || autoLoading)

  return (
    <Button
      {...props}
      className={cn(className, "relative", loading && "pointer-events-none")}
      onClick={async (e) => {
        if (loading) {
          e.preventDefault()
          return
        }

        if (onClick) {
          setAsyncLoading(true)
          await onClick(e)
          setAsyncLoading(false)
        }
      }}
    >
      <div className={cn("contents", loading && "invisible")}>{children}</div>
      {loading && <Spinner className="absolute" />}
    </Button>
  )
}
