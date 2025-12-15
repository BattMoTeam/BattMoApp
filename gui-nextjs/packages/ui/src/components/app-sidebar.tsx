import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
    CustomTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/ui/sidebar"



export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" side="right" variant="floating">
        <CustomTrigger>Results</CustomTrigger>
        {/* On mobile, keep it icon-only until opened */}
        <SidebarHeader className="hidden sm:flex" />
        <SidebarContent className="data-[side=right]:translate-x-full data-[state=open]:translate-x-0 transition-transform duration-300 ease-out">
            <SidebarGroup />
            <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="hidden sm:block" />
    </Sidebar>
  )
}