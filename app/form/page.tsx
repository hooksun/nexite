import { createClient } from "@/lib/supabase/server"
import PageContent from "./content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Form",
}

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = !user
    ? {}
    : await supabase
        .from("response")
        .select("*, ...response_search(search:value)")
        .eq("owner", user.id)
        .single()

  return (
    <PageContent
      user={user ?? undefined}
      defaultValues={data as any}
      hasResponse={!!data}
    />
  )
}
