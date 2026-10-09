"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "./button"
import { useDataView } from "@/hooks/use-data-view"

export default function ButtonRefresh(props: Parameters<typeof Button>[0]) {
  const { setState } = useDataView()

  return (
    <Button
      aria-label="Refresh"
      variant="secondary"
      size="icon"
      {...props}
      onClick={() => setState({}, false)}
    >
      <RefreshCw />
      {props.children}
    </Button>
  )
}
