import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  CustomTrigger,
  SidebarTrigger
  
} from "@workspace/ui/components/sidebar"
import { Collapsible } from "radix-ui"

export function ResultsSideBar() {
  return (
    <Sidebar side="right" variant="floating" collapsible="icon">
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