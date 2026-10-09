"use client"

import { ReactNode, useEffect, useMemo, useState } from "react"
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
  ArrowDownNarrowWide,
  ArrowDownUp,
  ArrowUpWideNarrow,
  CircleOff,
  CircleX,
  RefreshCw,
} from "lucide-react"
import { cn } from "cn"
import { useLoading } from "./loading-context"
import Paginator from "./ui/paginator"
import { useDataView } from "@/hooks/use-data-view"
import { TableColumn } from "./data-table-columns"
import ButtonRefresh from "./ui/button-refresh"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty"

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  loadingRows = 10,
  footerLabel,
  errorState,
  emptyState,
  getRowId,
}: {
  columns: TableColumn<T>[]
  loadingRows?: number
  selectable?: boolean
  footerLabel?: ReactNode
  errorState?: ReactNode
  emptyState?: ReactNode
  getRowId?: (row: T) => string | number
}) {
  const { setState, pagination, sorting, response } = useDataView()

  const { data = null, errors = null } = response ?? {}

  const [loading] = useLoading()

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

  const defaultErrorState = (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <CircleX className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Error encountered</EmptyTitle>
        <EmptyDescription>{errors?.at(0)?.message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ButtonRefresh size="default" variant="secondary">
          Reload
        </ButtonRefresh>
      </EmptyContent>
    </Empty>
  )

  const defaultEmtpyState = (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <CircleOff />
        </EmptyMedia>
        <EmptyTitle>Data not found</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <ButtonRefresh size="default" variant="secondary">
          Reload
        </ButtonRefresh>
      </EmptyContent>
    </Empty>
  )

  const footer = useMemo(() => {
    const first = columns.findIndex((col) => col.renderFooter)

    if (first == -1 || !response || !data?.length) {
      return undefined
    }

    return (
      <TableRow>
        <TableCell colSpan={first} className="p-0">
          <div className="sticky left-0 w-fit p-2">{footerLabel}</div>
        </TableCell>
        {columns
          .filter((_, i) => i >= first)
          .map((col, i) => (
            <TableCell key={i}>
              <div className={col.footerClassName}>
                {col.renderFooter && col.renderFooter(response)}
              </div>
            </TableCell>
          ))}
      </TableRow>
    )
  }, [columns, response])

  return (
    <Table>
      <colgroup>
        {columns.map((column, i) => (
          <col
            key={i}
            {...column.columnProps}
            className={cn(
              column.shrink && "w-0 whitespace-nowrap",
              column.columnProps?.className
            )}
          />
        ))}
      </colgroup>
      <TableHeader className="sticky top-0 z-1 bg-background">
        <TableRow>
          {columns.map((column, i) => (
            <TableHead key={i}>
              <div
                className={cn(
                  "flex w-full items-center gap-2 capitalize",
                  column.headerClassName
                )}
              >
                {column.header}
                {column.filter}
                {column.sortable && (
                  <Button
                    aria-label="Sort"
                    size="icon-xs"
                    variant={
                      sortColumn == column.sortKey ? "default" : "secondary"
                    }
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
                      <ArrowUpWideNarrow className="-scale-x-100" />
                    ) : (
                      <ArrowDownNarrowWide />
                    )}
                  </Button>
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data?.length ?? 0) == 0 && loading ? (
          Array.from({ length: loadingRows }, (_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={columnLength}>
                <Skeleton className="h-5 rounded-full" />
              </TableCell>
            </TableRow>
          ))
        ) : errors ? (
          <TableRow>
            <TableCell colSpan={columnLength} className="p-0">
              <div className="sticky left-0 w-[100cqw]">
                {errorState ?? defaultErrorState}
              </div>
            </TableCell>
          </TableRow>
        ) : !data?.length ? (
          <TableRow>
            <TableCell colSpan={columnLength} className="p-0">
              <div className="sticky left-0 w-[100cqw]">
                {emptyState ?? defaultEmtpyState}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data?.map((row, i) => (
            <TableRow key={getRowId ? getRowId(row) : getRowNumber(i)}>
              {columns.map((column, j) => (
                <TableCell key={j}>
                  <div
                    className={cn(
                      "relative",
                      loading && column.skeletonized !== false && "invisible",
                      column.cellClassName
                    )}
                  >
                    {loading && column.skeletonized !== false && (
                      <Skeleton className="visible absolute h-full w-full rounded-full" />
                    )}
                    {column.render(row, {
                      rowNumber: getRowNumber(i),
                      loading,
                    })}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
      {(!!footer || (pagination && pagination.pageCount > 1)) &&
        (data?.length ?? 0) > 0 && (
          <TableFooter className="sticky bottom-0 bg-background">
            {footer}
            {pagination && pagination.pageCount > 1 && (
              <TableRow>
                <TableCell colSpan={columnLength} className="p-0">
                  <div className="flex w-full justify-end">
                    <Paginator
                      className="sticky right-0 mx-0 w-fit p-2"
                      page={page}
                      setPage={setPage}
                      pageCount={pagination.pageCount}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
            <TableRow className="absolute top-0 right-0 bottom-0 left-0 -z-1 bg-muted/50" />
          </TableFooter>
        )}
    </Table>
  )
}
