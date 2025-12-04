
// app/simulator/page.tsx
import ContentGrid from "./_components/content-grid";

import ResultsPane from './_components/results_pane';

import { SidebarProvider, useSidebar } from '@workspace/ui/components/ui/sidebar';
import { StepProvider } from './_state/step-context';
import { SimulationProvider } from './_state/simulation-provider';

export const metadata = { title: 'Simulator' };


export default function SimulatorPage() {
  return (
    <SidebarProvider defaultOpen={false}>
      <SimulationProvider>
        <StepProvider>
          <ContentGrid/>
          {/* Fixed/portal sidebar rendered OUTSIDE the grid */}
          <ResultsPane />
        </StepProvider>
      </SimulationProvider>
    </SidebarProvider>
  );
}
