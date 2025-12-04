
// @workspace/ui/components/sidebar-results.tsx (CLIENT)
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  CustomTrigger,
} from "@workspace/ui/components/ui/sidebar";

export function ResultsSideBar() {
  return (
    
<Sidebar
  side="right"
  variant="floating"
  collapsible="icon"
  className="
    w-container
  "
>
  {/* On mobile, keep it icon-only until opened */}
  <SidebarHeader className="hidden sm:flex" />
  <CustomTrigger>Results</CustomTrigger>
  <SidebarContent className="data-[side=right]:translate-x-full data-[state=open]:translate-x-0 transition-transform duration-300 ease-out">
    <SidebarGroup />
    <SidebarGroup />
  </SidebarContent>
  <SidebarFooter className="hidden sm:block" />
</Sidebar>

  );
}
