import { CustomTrigger, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/ui/sidebar"
import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import ResultsPane from "./_components/results_pane"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
        <div>
            {/* <AppSidebar/> */}
            <ResultsPane />
            <main>
            {children}
            </main>
        </div>
      
    </SidebarProvider>
  )
}