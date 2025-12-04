
// app/simulator/_components/middle-column.tsx (CLIENT)
'use client';

import { useRef } from 'react';
import MetricsOverlay from './metrics-overlay';
import ScrollSections from './scroll-sections';

export default function MiddleColumn() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const METRICS_HEIGHT = 56; // px

  return (
    <section
      className="relative flex bg-background min-w-0" 
      style={{ ['--metrics-height' as any]: `${METRICS_HEIGHT}px` }}
    >

      {/* Internal scrollable area */}
      <div
        ref={scrollContainerRef}
        className="
          flex-1 overflow-y-auto scrollbar-hide transition-all duration-300
          h-[calc(100vh-var(--app-nav-height))]
          px-4 py-6
          w-lvw
        "
      >
        <ScrollSections scrollContainerRef={scrollContainerRef} />
      </div>
      {/* Sticky metrics bar */}
      {/* <div
        className="
          flex-2 sticky top-[var(--app-nav-height)]
          z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
        "
      >
        <div className="px-4 py-3">
          <MetricsOverlay />
        </div>
      </div> */}
    </section>
  );
}