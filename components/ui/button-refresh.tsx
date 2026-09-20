"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "./button"
import { ButtonProps } from "@base-ui/react"
import { useDataView } from "@/hooks/use-data-view"

export default function ButtonRefresh(props: ButtonProps) {
  const { setState } = useDataView()

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
