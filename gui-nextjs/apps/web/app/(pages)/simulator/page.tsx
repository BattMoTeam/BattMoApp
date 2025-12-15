
// app/simulator/page.tsx
import ContentGrid from "./_components/content-grid";

import ResultsPane from './_components/results_pane';

import { SidebarProvider, useSidebar, SidebarTrigger } from '@workspace/ui/components/ui/sidebar';
import { AppSidebar} from '@workspace/ui/components/app-sidebar';
import { StepProvider } from './_state/step-context';
import { SimulationProvider } from './_state/simulation-provider';

export const metadata = { title: 'Simulator' };


export default function SimulatorPage() {
  return (
        
          
        <div>
          <SimulationProvider>
            <StepProvider>
              <ContentGrid/>
              {/* Fixed/portal sidebar rendered OUTSIDE the grid */}
            </StepProvider>
          </SimulationProvider>
        </div>


          
      


    
  );
}
