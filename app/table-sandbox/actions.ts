"use server"

import { createClient } from "@/lib/supabase/server"
import { addDays, format, startOfMonth } from "date-fns"
import { revalidatePath } from "next/cache"

const DummyNames = [
  "James Miller",
  "Sarah Davis",
  "Robert Wilson",
  "Emily Taylor",
  "Michael Anderson",
  "Jessica Thomas",
  "David Jackson",
  "Ashley White",
  "Daniel Harris",
  "Amanda Martin",
  "Matthew Clark",
  "Megan Lewis",
  "Christopher Robinson",
  "Hannah Walker",
  "Andrew Young",
  "Lauren Allen",
  "Joshua King",
  "Rachel Wright",
  "Ryan Scott",
  "Victoria Torres",
  "Brandon Nguyen",
  "Megan Hill",
  "Justin Flores",
  "Kayla Green",
  "Tyler Adams",
  "Samantha Nelson",
  "Nicholas Baker",
  "Brittany Hall",
  "Tyler Rivera",
  "Danielle Campbell",
]

export async function insertDummyData() {
  const supabase = await createClient()

  const values = DummyNames.map((name, i) => ({
    name,
    date: format(addDays(startOfMonth(new Date()), i), "yyyy-MM-dd"),
    value: Math.ceil(Math.random() * 30),
    status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)],
  }))

  const { error } = await supabase.from("sandbox").insert(values)

  revalidatePath("", "layout")

  return { error }
}
