"use client"

import { ReactNode, useEffect, useState } from "react"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar"
import { ThemeSwitcher } from "./theme-switcher"
import {
  ChevronDown,
  CodeXml,
  FileTextIcon,
  Home,
  Table2,
  X,
} from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { usePath } from "@/hooks/use-path-state"
import { cn } from "cn"
import { Collapsible, CollapsibleContent } from "./ui/collapsible"
import { usePathname } from "next/navigation"

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
          />
        </SidebarMenuItem>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export default function Navbar() {
  const { setOpen, setOpenMobile, state, isMobile } = useSidebar()

  const pathName = usePathname()
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathName])

  const [openTableSub, setOpenTableSub] = useState(false)

  const path = usePath()

  const showTooltip = state == "collapsed" && !isMobile

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
              showTooltip={showTooltip}
            />
            <SidebarMenuItem>
              <Collapsible open={openTableSub} onOpenChange={setOpenTableSub}>
                <Tooltip>
                  <TooltipTrigger
                    disabled={!showTooltip}
                    render={
                      <SidebarMenuButton
                        onClick={() => {
                          if (state == "collapsed" && !isMobile) {
                            setOpen(true)
                            setOpenTableSub(true)
                          } else {
                            setOpenTableSub((b) => !b)
                          }
                        }}
                      >
                        <Table2 />
                        Table
                        <ChevronDown
                          className={cn(
                            "ml-auto transition-all",
                            openTableSub && "rotate-180"
                          )}
                        />
                      </SidebarMenuButton>
                    }
                  />
                  <TooltipContent side="right">Table</TooltipContent>
                </Tooltip>

                <CollapsibleContent animated>
                  <SidebarMenuSub
                  // for animation without collapsible
                  // className={cn(
                  //   "overflow-hidden transition-all",
                  //   !openTableSub && "py-0"
                  // )}
                  >
                    <SidebarMenuSubItem
                    // for animation without collapsible
                    // className={cn("transition-all", !openTableSub && "-mt-8")}
                    >
                      <SidebarMenuSubButton
                        render={<Link href={path("/table")}>Simple</Link>}
                      />
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem
                    // for animation without collapsible
                    // className={cn("transition-all", !openTableSub && "-mt-8")}
                    >
                      <SidebarMenuSubButton
                        render={
                          <Link href={path("/table-sandbox")}>Sandbox</Link>
                        }
                      />
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            <NavbarMenu
              icon={<FileTextIcon />}
              label="Form"
              path={path("/form")}
              showTooltip={showTooltip}
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
