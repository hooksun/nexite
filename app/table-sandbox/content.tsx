"use client"

import { Button } from "@/components/ui/button"
import DataTable from "@/components/data-table"
import useSelectColumn from "@/hooks/use-select-column"
import { CircleOff, Plus, Search, Trash } from "lucide-react"
import { useAlertDialog } from "@/hooks/use-alert-dialog"
import { deleteTable } from "@/lib/supabase/crud-actions"
import { useState } from "react"
import InputSheet from "./input-sheet"
import {
  FilterChecklist,
  FilterDateRange,
  FilterForm,
  FilterRange,
} from "@/components/data-table-filters"
import { actionsColumn, dataColumn } from "@/components/data-table-columns"
import ButtonRefresh from "@/components/ui/button-refresh"
import ButtonLoading from "@/components/ui/button-loading"
import { insertDummyData } from "./actions"
import FilterField from "@/components/filter-field"
import { formInput } from "@/components/form-inputs"
import Header from "@/components/ui/header"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { toast } from "@/components/ui/toast"
import { useDataView } from "@/hooks/use-data-view"

export default function TablePage({
  statusses = [],
}: {
  statusses?: string[]
}) {
  const { selected, column: selectColumn } = useSelectColumn({
    getRowId: (data: any) => data.id as number,
  })

  const { confirm } = useAlertDialog()

  const [openDrawer, setOpenDrawer] = useState(false)

  const [updatingRow, setUpdatingRow] = useState<any>()

  const { setState } = useDataView()

  const handleInsertDummyData = async () => {
    const { error } = await insertDummyData()

    if (error) {
      toast.add({
        type: "error",
        title: "Failed to insert",
      })
      return
    }

    setState({}, false) // trigger loading state
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Sandbox Table" />
      <main className="flex flex-1 flex-col gap-6 overflow-auto p-6 pt-2">
        <DataTable
          columns={[
            selectColumn,
            dataColumn("date", {
              filter: (
                <FilterDateRange startParam="start-date" endParam="end-date" />
              ),
            }),
            dataColumn("name", {
              filter: (
                <FilterForm>
                  <FilterField
                    name="name"
                    input={formInput({ left: <Search />, clear: true })}
                  />
                </FilterForm>
              ),
            }),
            dataColumn("status", {
              sortable: false,
              filter: <FilterChecklist param="status" list={statusses} />,
            }),
            dataColumn("value", {
              shrink: true,
              cellClassName: "text-right",
              filter: (
                <FilterRange startParam="start-value" endParam="end-value" />
              ),
              renderFooter: ({ aggregate }) => (
                <div className="text-right">{aggregate?.at(0)?.value_sum}</div>
              ),
            }),
            actionsColumn((row) => [
              {
                children: "Update",
                onClick: () => {
                  setUpdatingRow(row)
                  setOpenDrawer(true)
                },
              },
              {
                children: "Delete",
                variant: "destructive",
                onClick: () =>
                  confirm({
                    title: `Delete ${row.name}?`,
                    description: "This action can't be undone",
                    onConfirm: () => deleteTable("sandbox", [row.id as number]),
                    destructive: true,
                  }),
              },
            ]),
          ]}
          emptyState={
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <CircleOff />
                </EmptyMedia>
                <EmptyTitle>Data not found</EmptyTitle>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <ButtonRefresh size="default" variant="secondary">
                  Reload
                </ButtonRefresh>
                <ButtonLoading onClick={handleInsertDummyData}>
                  Add Dummy
                </ButtonLoading>
              </EmptyContent>
            </Empty>
          }
          footerLabel="Total"
          getRowId={(row) => row.id as string | number}
        />

        <div className="flex justify-end gap-2">
          {selected.size > 0 && (
            <Button
              variant="destructive"
              onClick={() =>
                confirm({
                  onConfirm: () => deleteTable("sandbox", [...selected]),
                  destructive: true,
                  title: `Delete ${selected.size} data?`,
                  description: "This action can't be undone",
                })
              }
            >
              <Trash /> Delete {selected.size} data
            </Button>
          )}
          <Button
            className="justify-self-end"
            onClick={() => {
              setUpdatingRow(undefined)
              setOpenDrawer(true)
            }}
          >
            <Plus /> Add
          </Button>
        </div>

        <InputSheet
          open={openDrawer}
          onOpenChange={setOpenDrawer}
          defaultValues={updatingRow}
          statusOptions={statusses}
        />
      </main>
    </div>
  )
}
