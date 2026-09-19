"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "./button"
import { usePathState } from "@/hooks/use-path-state"
import { ButtonProps } from "@base-ui/react"
import { cn } from "cn"

export default function ButtonRefresh(props: ButtonProps) {
  const { setState } = usePathState()

  return (
    <Button
      variant="secondary"
      size="icon"
      {...props}
      onClick={() => setState({})}
    >
      <RefreshCw />
    </Button>
  )
}
