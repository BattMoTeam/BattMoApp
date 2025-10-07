import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  CustomTrigger,
  
} from "@workspace/ui/components/sidebar"
import { Collapsible } from "radix-ui"

export function ResultsSideBar() {
  return (
    <Sidebar 
      side="right"
      variant="floating"
      collapsible="icon"
      className="absolute right-0 top-24 h-[calc(98vh-4rem)]"
      >
      <SidebarHeader className="items-left"/>
      <CustomTrigger children="Results"/>
      
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}