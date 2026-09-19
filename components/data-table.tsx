"use client"

import { ReactNode, useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { Button } from "./ui/button"
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  CircleX,
  RefreshCw,
} from "lucide-react"
import { usePathState } from "@/hooks/use-path-state"
import { cn } from "cn"
import { useLoading } from "./LoadingContext"
import Paginator from "./ui/paginator"

type TableColumn<T> = {
  header: ReactNode
  sortable?: boolean
  sortKey?: string
  render: (row: T) => ReactNode
  headerClassName?: string
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

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data = null,
  error = null,
  count = null,
  paginated = true,
  pageSize,
  loadingRows = pageSize ?? 5,
}: {
  columns: TableColumn<T>[]
  paginated?: boolean
  pageSize?: number
  loadingRows?: number
} & Partial<PostgrestSingleResponse<T[]>>) {
  const { searchParams, setState } = usePathState()

  const [sortState, setSortState] = useState(searchParams.get("sort"))

  const [loading, setLoading] = useLoading()

  const [sortColumn, sortDirection] = sortState?.split(":") ?? []

  const setSort = (column: string | null, direction: string) => {
    const value = column == null ? null : `${column}:${direction}`

    setSortState(value)

    setState({ sort: value })
  }

  const pageParam = Number(searchParams.get("page")) || 1
  const pageCount = paginated ? Math.ceil((count ?? 1) / (pageSize ?? 1)) : 1
  const [page, setPage] = useState(pageParam)

  useEffect(() => {
    setPage(pageParam)
  }, [pageParam])

  useEffect(() => {
    if (page != pageParam) {
      setState({ page: page.toString() })
    }
  }, [page])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, i) => (
            <TableHead key={i}>
              <div
                className={cn(
                  "flex items-baseline capitalize",
                  column.headerClassName
                )}
              >
                {column.header}
                {column.sortable && (
                  <Button
                    className="ml-auto"
                    size="icon-xs"
                    variant={sortColumn == column.sortKey ? "default" : "ghost"}
                    onClick={() =>
                      setSort(
                        sortColumn == column.sortKey && sortDirection == "desc"
                          ? null
                          : (column.sortKey ?? null),
                        sortColumn == column.sortKey && sortDirection == "asc"
                          ? "desc"
                          : "asc"
                      )
                    }
                  >
                    {sortColumn != column.sortKey ? (
                      <ArrowDownUp />
                    ) : sortDirection == "asc" ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    )}
                  </Button>
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data == null && loading ? (
          Array.from({ length: loadingRows }, (_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={columns.length}>
                <Skeleton className="h-5 rounded-full" />
              </TableCell>
            </TableRow>
          ))
        ) : error ? (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <div className="flex flex-col items-center gap-4 p-8 text-center text-muted-foreground">
                <CircleX className="text-destructive" />
                Error encountered
                <br />
                {error.message}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setLoading(true)
                    setState({})
                  }}
                >
                  <RefreshCw /> Reload
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data?.map((row, i) => (
            <TableRow key={i}>
              {columns.map((column, i) => (
                <TableCell key={i}>
                  <div className={cn("relative", loading && "invisible")}>
                    {loading && (
                      <Skeleton className="visible absolute h-full w-full rounded-full" />
                    )}
                    {column.render(row)}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
      {paginated && pageCount > 1 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length}>
              <Paginator
                className="justify-end"
                page={page}
                setPage={setPage}
                pageCount={pageCount}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}
