import useSupabaseSelect from "@/hooks/use-supabase-select"
import TablePage from "./content"
import { SearchParams } from "@/lib/utils"
import { DataViewProvider } from "@/hooks/use-data-view"
import { createClient } from "@/lib/supabase/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sandbox Table",
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const builder = (
    await useSupabaseSelect("sandbox", {
      searchParams,
      aggregateSelect: "value_sum:value.sum()",
    })
  )
    .gte("date", "start-date")
    .lte("date", "end-date")
    .ilike("name", "name", (value) => `%${value}%`)
    .in("status", "status")
    .gte("value", "start-value")
    .lte("value", "end-value")
    .applySorting()
    .edit((q) => q.order("id"), false)
    .paginated({ pageSize: 10 })

  // await new Promise((res) => setTimeout(res, 3000))

  const statusses = await (await createClient()).from("status").select("name")

  return (
    <DataViewProvider response={await builder.run()} {...builder.config}>
      <TablePage statusses={statusses.data?.map((item) => item.name) ?? []} />
    </DataViewProvider>
  )
}
