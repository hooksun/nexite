"use client" // use client since render function can't be passed from server to client

import { ColHTMLAttributes, ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { SupabaseSelectResponse } from "@/hooks/use-supabase-select"
import { Button } from "./ui/button"
import { Ellipsis } from "lucide-react"

export type TableColumn<T> = {
  header: ReactNode
  sortable?: boolean
  sortKey?: string
  filter?: ReactNode
  render: (
    row: T,
    rowState: { rowNumber: number; loading: boolean }
  ) => ReactNode
  renderFooter?: (props: SupabaseSelectResponse<T[]>) => ReactNode
  skeletonized?: boolean
  headerClassName?: string
  cellClassName?: string
  footerClassName?: string
  shrink?: boolean
  columnProps?: ColHTMLAttributes<HTMLTableColElement>
}

export function dataColumn<T extends Record<string, unknown>>(
  key: string,
  options?: Partial<TableColumn<T>>
) {
  return {
    header: key,
    sortable: true,
    sortKey: key,
    render: (row) => row[key],
    ...options,
  } as TableColumn<T>
}

export function numberColumn<T extends Record<string, unknown>>(
  options?: Partial<TableColumn<T>>
) {
  return {
    header: "No",
    sortable: false,
    render: (_, { rowNumber }) => rowNumber,
    headerClassName: "justify-center",
    cellClassName: "text-center",
    shrink: true,
    ...options,
  } as TableColumn<T>
}

export function actionsColumn<T extends Record<string, unknown>>(
  actions: (row: T) => Parameters<typeof DropdownMenuItem>[0][],
  options?: Partial<TableColumn<T>>
) {
  return {
    header: "Actions",
    sortable: false,
    shrink: true,
    skeletonized: false,
    cellClassName: "flex justify-end",
    render: (row, { loading }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" disabled={loading}>
              <Ellipsis />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {actions(row).map((action, i) => (
              <DropdownMenuItem key={i} {...action} />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    ...options,
  } as TableColumn<T>
}
