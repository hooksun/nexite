"use client"

import Filter from "@/components/filter"
import { Button } from "@/components/ui/button"
import ButtonRefresh from "@/components/ui/button-refresh"
import { Card, CardContent } from "@/components/ui/card"
import DataTable, { dataColumn, numberColumn } from "@/components/data-table"
import { Search } from "lucide-react"
import ButtonClear from "@/components/ui/button-clear"
import FilterField from "@/components/filter-field"
import { formInput } from "@/components/form-field"
import useSelectColumn from "@/hooks/use-select-column"

export default function TablePage() {
  const { selected, column: selectColumn } = useSelectColumn({
    getRowId: (data: any) => data.id,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card className="p-0">
        <CardContent className="flex flex-wrap gap-2 p-2">
          <Filter>
            <FilterField
              name="startDate"
              label="Start"
              className="flex-1"
              submitOnChange
              render={formInput({ type: "date" })}
            />
            <FilterField
              name="endDate"
              label="End"
              className="flex-1"
              submitOnChange
              render={formInput({ type: "date" })}
            />
            <FilterField
              name="name"
              className="flex-1"
              render={formInput({
                type: "search",
                left: <Search />,
                placeholder: "Name",
              })}
            />
            <ButtonClear />
            <ButtonRefresh />
            <Button type="submit">Submit</Button>
          </Filter>
        </CardContent>
      </Card>
      <DataTable
        columns={[
          selectColumn,
          numberColumn(),
          dataColumn("date"),
          dataColumn("name"),
        ]}
        getRowId={(row) => row.id as string | number}
      />
      {/* Selected: {selected.size} */}
    </div>
  )
}
