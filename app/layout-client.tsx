"use client"

import Navbar from "@/components/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"
import PathStateProvider from "@/hooks/use-path-state"
import { ReactNode } from "react"

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode
}) {
  return (
    <PathStateProvider>
      <SidebarProvider defaultOpen={false}>
        <Navbar />
        <div className="@container-[scroll-state] relative h-dvh flex-1 overflow-auto">
          {children}
        </div>
        <Toaster />
      </SidebarProvider>
    </PathStateProvider>
  )
}
