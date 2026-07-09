'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useBattMoWebSocket } from '@workspace/ui/hooks/useBattMoWebSocket';

type SimulationData = Record<string, unknown>;

type SimulationContextType = {
  data: SimulationData;
  logs: string[];
  runSimulation: () => Promise<void>;
};

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const { events, runSimulationTask } = useBattMoWebSocket({
    url: 'ws://localhost:8080',
  });

  const data = useMemo<SimulationData>(() => {
    const resultEvent = [...events].reverse().find((event) => event.type === 'result');
    return (resultEvent?.raw as SimulationData | undefined) ?? {};
  }, [events]);

  const logs = useMemo(
    () =>
      events
        .filter((event) => event.type === 'info' || event.type === 'error')
        .map((event) =>
          typeof event.raw === 'string' ? event.raw : JSON.stringify(event.raw),
        ),
    [events],
  );

  const runSimulation = async () => {
    try {
      const res = await fetch('/input_example.json');
      if (!res.ok) throw new Error(`Failed to load JSON: ${res.status}`);
      const jsonData = (await res.json()) as Record<string, unknown>;
      runSimulationTask(jsonData);
    } catch (err) {
      console.error('Error loading JSON:', err);
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
