
// app/simulator/_components/results_pane.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSidebar } from '@workspace/ui/components/ui/sidebar';
import { ResultsSideBar } from '@workspace/ui/components/sidebar-results';

export default function ResultsPane() {
  const [mounted, setMounted] = useState(false);
  const { open } = useSidebar();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      data-open={open ? 'true' : 'false'}
      className="
        fixed right-0
        top-[var(--app-nav-height)]
        h-[calc(100vh-var(--app-nav-height))]
        w-[760px] lg:w-[760px] max-w-[70vw]
        z-[45]               /* ensure nav is above this */
        pointer-events-auto
      "
    >
      {/* The inner component doesn't set its own positioning */}
      <ResultsSideBar />
    </div>,
    document.body
  );
}