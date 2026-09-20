import useSupabaseSelect from "@/hooks/use-supabase-select"
import TablePage from "./content"
import { SearchParams } from "@/lib/utils"
import { DataViewProvider } from "@/hooks/use-data-view"

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const builder = (await useSupabaseSelect("test", { searchParams }))
    .gte("date", "startDate")
    .lte("date", "endDate")
    .ilike("name", "name", (value) => `%${value}%`)
    .applySorting()
    .paginated({ pageSize: 3 })

  // await new Promise((res) => setTimeout(res, 1000))

  return (
    <DataViewProvider response={await builder.query} {...builder.config}>
      <TablePage />
    </DataViewProvider>
  )
}
