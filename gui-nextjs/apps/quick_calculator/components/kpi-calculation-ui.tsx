'use client';

import { useBattMoWebSocket } from '@workspace/ui/hooks/useBattMoWebSocket';
import CalculateButton from './calculate-button';

export default function kpiCalculationUI() {
  const { status, clientUUID, events, lastError, runSimulation, cancelSimulation, calculateKPIs, reconnect, clearEvents } =
    useBattMoWebSocket({
      url: 'ws://localhost:8080', // 
      // token: 'optional-jwt-or-session-token',
      autoReconnect: true,
      heartbeatMs: 20_000,
    });

    return (
      <div>
        <CalculateButton/>
      </div>
    )

 }