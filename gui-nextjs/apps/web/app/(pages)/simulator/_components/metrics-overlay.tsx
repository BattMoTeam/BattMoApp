
// app/simulator/_components/MetricsOverlay.tsx (CLIENT)
'use client';

import MetricCardButton from '@workspace/ui/components/metric-card-with-run-button';
import { useSimulation } from '../_state/simulation-provider';

export default function MetricsOverlay() {
  const { runSimulation } = useSimulation();

  return (
    <div className="flex justify-end">
      <MetricCardButton
        metrics={[
          { value: '1.1', label: 'N/P ratio' },
          { value: '37', label: 'Cell Mass' },
          { value: '2018', label: 'Cell Capacity' },
        ]}
        onRun={runSimulation}
      />
    </div>
  );
}