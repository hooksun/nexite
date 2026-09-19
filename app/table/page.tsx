import useSupabaseSelect from "@/hooks/use-supabase-select"
import TablePage from "./content"
import { SearchParams } from "@/lib/utils"

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

  return <TablePage response={await builder.query} {...builder.config} />
}
