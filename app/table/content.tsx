"use client"

import Filter from "@/components/filter"
import FormField, { formInput } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import ButtonRefresh from "@/components/ui/button-refresh"
import { Card, CardContent } from "@/components/ui/card"
import DataTable, { dataColumn } from "@/components/data-table"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { LoadingContext } from "@/components/LoadingContext"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function TablePage({
  loading = false,
  filterParams,
  paginated,
  pageSize,
  response,
}: {
  loading?: boolean
  filterParams?: string[]
  paginated?: boolean
  pageSize?: number
  response?: PostgrestSingleResponse<any[]>
}) {
  const loadingState = useState(loading)
  useEffect(() => {
    loadingState[1](loading)
  }, [response])

  return (
    <LoadingContext state={loadingState}>
      <div className="flex flex-col gap-6 p-6">
        <Card className="p-0">
          <CardContent className="flex flex-wrap gap-2 p-2">
            <Filter filters={filterParams}>
              <FormField
                name="startDate"
                label=""
                className="flex-1"
                render={formInput({ type: "date" })}
              />
              <FormField
                name="endDate"
                label=""
                className="flex-1"
                render={formInput({ type: "date" })}
              />
              <FormField
                name="name"
                label=""
                className="flex-1"
                render={formInput({ type: "search", left: <Search /> })}
              />
              <ButtonRefresh />
              <Button type="submit">Submit</Button>
            </Filter>
          </CardContent>
        </Card>

        <DataTable
          columns={[
            dataColumn("id", { header: "no" }),
            dataColumn("date"),
            dataColumn("name"),
          ]}
          paginated={paginated}
          pageSize={pageSize}
          {...response}
        />
      </div>
    </LoadingContext>
  )
}
