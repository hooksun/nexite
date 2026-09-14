"use client"

import { ReactNode, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar"
import { ThemeSwitcher } from "./theme-switcher"
import { ChevronLeft, FileTextIcon, Home, X } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Button } from "./ui/button"

function NavbarMenu({
  icon,
  label,
  path,
  showTooltip,
}: {
  icon: ReactNode
  label: ReactNode
  path: string
  showTooltip: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger disabled={!showTooltip}>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={
              <Link href={path} onClick={(e) => e.stopPropagation()}>
                {icon}
                {label}
              </Link>
            }
          ></SidebarMenuButton>
        </SidebarMenuItem>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export default function Navbar() {
  const { setOpen, setOpenMobile, state, isMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" onClick={() => setOpen(true)}>
      <SidebarHeader className="transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-12 group-data-[collapsible=icon]:opacity-0">
        <SidebarMenuButton
          className="w-fit"
          onClick={(e) => {
            e.stopPropagation()
            setOpenMobile(false)
            setOpen(false)
          }}
        >
          <X />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <NavbarMenu
              icon={<Home />}
              label="Home"
              path="/"
              showTooltip={state == "collapsed" && !isMobile}
            />
            <NavbarMenu
              icon={<FileTextIcon />}
              label="Form"
              path="/form"
              showTooltip={state == "collapsed" && !isMobile}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="items-start">
        <SidebarMenu onClick={(e) => e.stopPropagation()}>
          <ThemeSwitcher />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
