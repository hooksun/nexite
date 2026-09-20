"use client"

import { TableColumn } from "@/components/data-table"
import { useEffect, useState } from "react"
import { useDataView } from "./use-data-view"
import { Checkbox } from "@/components/ui/checkbox"
import { useLoading } from "@/components/loading-context"

export default function useSelectColumn<
  T extends unknown,
  D extends string | number,
>({
  getRowId,
  options,
}: {
  getRowId: (row: T) => D
  options?: Partial<TableColumn<T>>
}): {
  selected: Set<D>
  column: TableColumn<T>
} {
  const { response } = useDataView()
  const [loading] = useLoading()

  const { data } = response ?? {}

  const [selected, setSelected] = useState(new Set<D>())

  useEffect(() => {
    // setSelected((prev) => prev.intersection(new Set(data?.map(getRowId))))
    setSelected(new Set())
  }, [response, loading])

  const setRowSelected = (id: D, value: boolean) => {
    setSelected((prev) => {
      const newSet = new Set(prev)
      if (value) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const setAllSelected = (value: boolean) => {
    if (value) {
      setSelected(new Set(data?.map(getRowId)))
    } else {
      setSelected(new Set())
    }
  }

  return {
    selected,
    column: {
      header: (
        <Checkbox
          checked={selected.size == data?.length && selected.size != 0}
          onCheckedChange={setAllSelected}
        />
      ),
      render: (row) => (
        <Checkbox
          checked={selected.has(getRowId(row))}
          onCheckedChange={(checked) => setRowSelected(getRowId(row), checked)}
        />
      ),
      columnProps: { className: "w-0 whitespace-nowrap" },
      skeletonized: false,
      ...options,
    },
  }
}
