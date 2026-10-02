"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "./server"
import { Database } from "./supabase-types"

const Tables = {
  sandbox: {
    pKey: "id",
  },
  response: {
    pKey: "id",
  },
} as const satisfies Partial<{
  [K in keyof Database["public"]["Tables"]]: {
    pKey: keyof Database["public"]["Tables"][K]["Row"]
  }
}>

export async function updateTable<T extends keyof typeof Tables>(
  table: T,
  id: NonNullable<
    Database["public"]["Tables"][T]["Row"][(typeof Tables)[T]["pKey"] &
      keyof Database["public"]["Tables"][T]["Row"]]
  >,
  values: Database["public"]["Tables"][T]["Update"]
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from(table)
    .update(values as any)
    .eq(Tables[table].pKey as any, id)

  revalidatePath("", "layout")

  if (error) {
    console.log(error)
  }

  return { error: error }
}

export async function deleteTable<T extends keyof typeof Tables>(
  table: T,
  ids: NonNullable<
    Database["public"]["Tables"][T]["Row"][(typeof Tables)[T]["pKey"] &
      keyof Database["public"]["Tables"][T]["Row"]]
  >[]
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from(table)
    .delete()
    .in(Tables[table].pKey, ids as any)

  revalidatePath("", "layout")

  return { error: error }
}

export async function insertTable<T extends keyof typeof Tables>(
  table: T,
  values: Database["public"]["Tables"][T]["Insert"][]
) {
  const supabase = await createClient()

  const { error } = await supabase.from(table).insert(values as any[])

  revalidatePath("", "layout")

  return { error: error }
}

export async function upsertTable<T extends keyof typeof Tables>(
  table: T,
  values: Database["public"]["Tables"][T]["Update"][]
) {
  const supabase = await createClient()

  const { error } = await supabase.from(table).upsert(values as any[])

  revalidatePath("", "layout")

  return { error: error }
}

export async function searchTable<T extends keyof Database["public"]["Tables"]>(
  table: T,
  column: string,
  query: string,
  limit: number = 10
) {
  const supabase = await createClient()

  const { data, error, count } = await supabase
    .from(table)
    .select(column, { count: "exact", head: false })
    .ilike(column, `${query}%`)
    .order(column, { ascending: true })
    .limit(limit)

  if (error) {
    return {
      error,
      data: null,
    }
  }

  const values = data.map((item: any) => item[column] as string)

  if ((count ?? 0) >= limit) {
    return {
      error: error,
      data: values,
    }
  }

  const { data: data2, error: error2 } = await supabase
    .from(table)
    .select(column)
    .ilike(column, `%${query}%`)
    .not(column, "in", `(${values.join(",")})`)
    .order(column, { ascending: true })
    .limit(limit - (count ?? 0))

  if (error2) {
    console.log(error2)
    return {
      error: error2,
      data: null,
    }
  }

  return {
    error: null,
    data: data
      .map((item: any) => item[column] as string)
      .concat(data2.map((item: any) => item[column] as string)),
  }
}
