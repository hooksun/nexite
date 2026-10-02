"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function signUpWithEmail(data: {
  email: string
  password: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  revalidatePath("/", "layout")

  return { error: error?.toJSON() }
}

export async function loginWithEmail(data: {
  email: string
  password: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  revalidatePath("/", "layout")

  return { error: error?.toJSON() }
}

export async function loginAnonymous() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInAnonymously()

  revalidatePath("/", "layout")

  return { error: error?.toJSON() }
}

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath("/", "layout")
}
