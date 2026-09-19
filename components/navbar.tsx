"use client"

import { ReactNode } from "react"
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
  useSidebar,
} from "./ui/sidebar"
import { ThemeSwitcher } from "./theme-switcher"
import { CodeXml, FileTextIcon, Home, Table2, X } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { usePath } from "@/hooks/use-path-state"

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
              <Link href={path}>
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

  const path = usePath()

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
        <SidebarGroup onClick={(e) => e.stopPropagation()}>
          <SidebarMenu>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <NavbarMenu
              icon={<Home />}
              label="Home"
              path={path("/")}
              showTooltip={state == "collapsed" && !isMobile}
            />
            <NavbarMenu
              icon={<FileTextIcon />}
              label="Form"
              path={path("/form")}
              showTooltip={state == "collapsed" && !isMobile}
            />
            <NavbarMenu
              icon={<Table2 />}
              label="Table"
              path={path("/table")}
              showTooltip={state == "collapsed" && !isMobile}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="items-start">
        <SidebarMenu onClick={(e) => e.stopPropagation()}>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger
                render={
                  <SidebarMenuButton
                    className="w-fit text-muted-foreground"
                    render={
                      <Link
                        target="_blank"
                        href={"https://github.com/hooksun/nexite"}
                      >
                        <CodeXml />
                      </Link>
                    }
                  />
                }
              />
              <TooltipContent side="right">View Source Code</TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
