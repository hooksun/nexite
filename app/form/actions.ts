"use server"

import { createClient } from "@/lib/supabase/server"
import { Database } from "@/lib/supabase/supabase-types"
import { revalidatePath } from "next/cache"

export async function upsertValue(
  value: Database["public"]["Tables"]["response"]["Insert"] & {
    search?: string[] | null
  }
) {
  const supabase = await createClient()

  const { search, ...usedValue } = value

  const { data, error } = await supabase
    .from("response")
    .upsert(usedValue)
    .select()
    .single()

  if (error) {
    return { error }
  }

  if (value.id) {
    const { error: errorDelete } = await supabase
      .from("response_search")
      .delete()
      .eq("id", data.id)
    if (errorDelete) {
      return { error: errorDelete }
    }
  }

  if (search && search.length > 0) {
    const { error: errorinsert } = await supabase
      .from("response_search")
      .insert(
        search.map((s) => ({
          id: data.id,
          value: s,
        }))
      )

    if (errorinsert) {
      return {
        error: errorinsert,
      }
    }
  }

  revalidatePath("/form", "layout")
  return {
    error: null,
  }
}
