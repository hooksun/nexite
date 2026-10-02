"use client"

import Navbar from "@/components/navbar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
      <SidebarProvider>
        <Navbar />
        <main className="relative h-full min-h-svh flex-1 overflow-auto">
          {children}
          <SidebarTrigger
            className="fixed bottom-2 left-2 md:hidden"
            size="icon-lg"
          />
          <Toaster />
        </main>
      </SidebarProvider>
    </PathStateProvider>
  )
}
