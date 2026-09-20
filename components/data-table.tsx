"use client"

import { ColHTMLAttributes, ReactNode, useEffect, useState } from "react"
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
import { Button } from "./ui/button"
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  CircleOff,
  CircleX,
  RefreshCw,
} from "lucide-react"
import { cn } from "cn"
import { useLoading } from "./loading-context"
import Paginator from "./ui/paginator"
import { useDataView } from "@/hooks/use-data-view"

export type TableColumn<T> = {
  header: ReactNode
  sortable?: boolean
  sortKey?: string
  render: (row: T, rowState: { rowNumber: number }) => ReactNode
  skeletonized?: boolean
  headerClassName?: string
  cellClassName?: string
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
    cellClassName: "text-center",
    columnProps: { className: "w-0 whitespace-nowrap" },
    ...options,
  } as TableColumn<T>
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  loadingRows = 5,
  getRowId = (_, { rowNumber }) => rowNumber,
}: {
  columns: TableColumn<T>[]
  loadingRows?: number
  selectable?: boolean
  getRowId?: (row: T, rowState: { rowNumber: number }) => string | number
}) {
  const { setState, pagination, sorting, response } = useDataView()

  const { data = null, error = null } = response ?? {}

  const [loading, setLoading] = useLoading()

  const [sortState, setSortState] = useState(sorting?.sorting?.at(0) ?? null)

  const [sortColumn, sortDirection] = sortState?.split(":") ?? []

  const setSort = (column: string | null, direction: string) => {
    const value = column == null ? null : `${column}:${direction}`

    setSortState(value)

    if (sorting) {
      setState({ [sorting.param]: value })
    }
  }

  const pageParam = Number(pagination?.page) || 1
  const [page, setPage] = useState(pageParam)

  useEffect(() => {
    setPage(pageParam)
  }, [pageParam])

  useEffect(() => {
    if (pagination && page != pageParam) {
      setState({ [pagination.param]: page.toString() })
    }
  }, [page])

  const columnLength = columns.length

  const getRowNumber = (index: number) =>
    (pageParam - 1) * (pagination?.pageSize ?? 1) + index + 1

  const errorState = (
    <TableRow>
      <TableCell colSpan={columnLength}>
        <div className="flex flex-col items-center gap-4 p-8 text-center text-muted-foreground">
          <CircleX className="text-destructive" />
          Error encountered
          <br />
          {error?.message}
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
  )

  const emtpyState = (
    <TableRow>
      <TableCell colSpan={columnLength}>
        <div className="flex flex-col items-center gap-4 p-8 text-center text-muted-foreground">
          <CircleOff />
          Data not found
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
  )

  return (
    <Table>
      <colgroup>
        {columns.map((column, i) => (
          <col key={i} {...column.columnProps} />
        ))}
      </colgroup>
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
                {sorting && column.sortable && (
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
        {(data?.length ?? 0) == 0 && loading
          ? Array.from({ length: loadingRows }, (_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={columnLength}>
                  <Skeleton className="h-5 rounded-full" />
                </TableCell>
              </TableRow>
            ))
          : error
            ? errorState
            : (data?.length ?? 0) == 0
              ? emtpyState
              : data?.map((row, i) => (
                  <TableRow
                    key={getRowId(row, {
                      rowNumber: getRowNumber(i),
                    })}
                  >
                    {columns.map((column, j) => (
                      <TableCell key={j}>
                        <div
                          className={cn(
                            "relative",
                            loading &&
                              column.skeletonized !== false &&
                              "invisible",
                            column.cellClassName
                          )}
                        >
                          {loading && column.skeletonized !== false && (
                            <Skeleton className="visible absolute h-full w-full rounded-full" />
                          )}
                          {column.render(row, {
                            rowNumber: getRowNumber(i),
                          })}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
      </TableBody>
      {pagination && pagination.pageCount > 1 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columnLength}>
              <Paginator
                className="justify-end"
                page={page}
                setPage={setPage}
                pageCount={pagination.pageCount}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}
