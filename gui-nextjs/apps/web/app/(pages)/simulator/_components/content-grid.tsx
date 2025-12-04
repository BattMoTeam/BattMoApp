
// app/simulator/_components/content-grid.tsx
'use client';

import { useSidebar } from '@workspace/ui/components/ui/sidebar';
import StepperPane from './stepper-pane';
import MiddleColumn from './middle-column';

export default function ContentGrid() {
  const { open } = useSidebar();

  // Sidebar widths per breakpoint (match ResultsPane)
  const OPEN_WIDTH_SM = 260;
  const OPEN_WIDTH_LG = 760;

  return (
    <main
      className="
        relative grid grid-cols-[auto_1fr] gap-0
        min-h-[calc(100vh-var(--app-nav-height))]
      "
      style={{
        // Drive padding via CSS vars so we can vary it by breakpoint
        ['--rw-sm' as any]: open ? `${OPEN_WIDTH_SM}px` : '200px',
        ['--rw-lg' as any]: open ? `${OPEN_WIDTH_LG}px` : '200px',
      }}
    >
      <StepperPane />
      <div className="min-w-0 pr-[var(--rw-sm)] lg:pr-[var(--rw-lg)]">
        <MiddleColumn />
      </div>
    </main>
  );
}