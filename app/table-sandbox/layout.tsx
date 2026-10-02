import LoginCard from "@/components/login-card"
import RequireLogin from "@/components/require-login"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RequireLogin
      render={() => children}
      fallback={
        <div className="absolute top-0 bottom-0 flex w-full items-center justify-center p-6">
          <LoginCard />
        </div>
      }
    />
  )
}
