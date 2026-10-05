"use client"

import { ReactNode } from "react"
import { Separator } from "./separator"
import { useRouter } from "next/navigation"
import { Button } from "./button"
import { ChevronLeft, Menu } from "lucide-react"
import { SidebarTrigger, useSidebar } from "./sidebar"

export default function Header({ title }: { title?: ReactNode }) {
  const router = useRouter()
  const { isMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-1 w-full translate-y-0 bg-background transition-transform duration-300 ease-in-out [@container_scroll-state(scrolled:_bottom)]:not-focus-within:-translate-y-full">
      <div className="flex items-center gap-2 p-2">
        {isMobile ? (
          <SidebarTrigger size="icon">
            <Menu />
          </SidebarTrigger>
        ) : (
          <Button size="icon" variant="ghost" onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
        )}
        <h1>{title}</h1>
      </div>
      <Separator className="mx-auto max-w-[calc(100%-2rem)]" />
    </header>
  )
}
