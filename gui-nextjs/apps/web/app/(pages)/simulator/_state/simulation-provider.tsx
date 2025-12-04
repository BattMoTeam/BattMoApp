
// app/simulator/_state/simulation-provider.tsx (CLIENT)
'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useBattMoWebSocket } from '@workspace/ui/hooks/useBattMoWebSocket';

type SimulationData = Record<string, any>;

type SimulationContextType = {
  data: SimulationData;
  logs: string[];
  runSimulation: () => Promise<void>;
};

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [data, setData] = useState<SimulationData>({});

  const { send } = useBattMoWebSocket({
    url: 'ws://localhost:8080',
    onData: setData,
    onLog: (msg) => setLogs((prev) => [...prev, msg]),
  });

  const runSimulation = async () => {
    try {
      const res = await fetch('/input_example.json'); // from public/
      if (!res.ok) throw new Error(`Failed to load JSON: ${res.status}`);
      const jsonData = await res.json();

      await send({ task: 'run_simulation', data: jsonData });
    } catch (err) {
      console.error('❌ Error loading JSON:', err);
    }
  };

  const value = useMemo(() => ({ data, logs, runSimulation }), [data, logs]);

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
