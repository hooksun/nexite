import useSupabaseSelect from "@/hooks/use-supabase-select"
import TablePage from "./content"
import { SearchParams } from "@/lib/utils"
import { DataViewProvider } from "@/hooks/use-data-view"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Table",
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const builder = (
    await useSupabaseSelect("dummy_data", {
      searchParams,
      aggregateSelect: "avg_age:age.avg(), avg_salary:salary.avg()",
    })
  )
    .gte("date", "start-date")
    .lte("date", "end-date")
    .ilike("name", "name", (value) => `%${value}%`)
    .ilike("email", "email", (value) => `%${value}%`)
    .ilike("company", "company", (value) => `%${value}%`)
    .ilike("occupation", "occupation", (value) => `%${value}%`)
    .ilike("education", "education", (value) => `%${value}%`)
    .ilike("skill", "skill", (value) => `%${value}%`)
    .gte("age", "start-age")
    .lte("age", "end-age")
    .gte("salary", "start-salary")
    .lte("salary", "end-salary")
    .applySorting()
    .paginated({ pageSize: 10 })

  // await new Promise((res) => setTimeout(res, 1000))

  return (
    <DataViewProvider response={await builder.run()} {...builder.config}>
      <TablePage />
    </DataViewProvider>
  )
}
