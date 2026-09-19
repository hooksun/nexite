"use client"

import Navbar from "@/components/navbar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
        <main className="relative h-full min-h-svh w-full">
          {children}
          <SidebarTrigger
            className="absolute bottom-2 left-2 md:hidden"
            size={"lg"}
          />
        </main>
      </SidebarProvider>
    </PathStateProvider>
  )
}
