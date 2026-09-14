"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { SidebarMenuButton } from "./ui/sidebar"

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <TooltipTrigger
              render={
                <SidebarMenuButton className="w-min">
                  {resolvedTheme === "light" ? (
                    <Sun key="light" className={"text-muted-foreground"} />
                  ) : (
                    <Moon key="dark" className={"text-muted-foreground"} />
                  )}
                </SidebarMenuButton>
              }
            />
          }
        />
        <DropdownMenuContent className="w-content" align="start">
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(e) => setTheme(e)}
          >
            <DropdownMenuRadioItem className="flex gap-2" value="light">
              <Sun className="text-muted-foreground" /> <span>Light</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="flex gap-2" value="dark">
              <Moon className="text-muted-foreground" /> <span>Dark</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="flex gap-2" value="system">
              <Laptop className="text-muted-foreground" /> <span>System</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent side="right">Switch Theme</TooltipContent>
    </Tooltip>
  )
}

export { ThemeSwitcher }
