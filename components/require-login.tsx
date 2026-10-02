import { createClient } from "@/lib/supabase/server"
import { User } from "@supabase/supabase-js"
import { ReactNode } from "react"
import LoginCard from "./login-card"

export default async function RequireLogin({
  render,
  fallback = <LoginCard />,
}: {
  render: (user: User) => ReactNode
  fallback?: ReactNode
}) {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser() // use getUser which fetches latest data since data is passed to children

  if (!data.user) {
    return fallback
  }

  return render(data.user)
}
