
'use client';

import { useBattMoWebSocket } from '@workspace/ui/hooks/useBattMoWebSocket';
import { useMemo, useState } from 'react';

export default function SimulationUI() {
  const { status, clientUUID, events, lastError, runSimulation, cancelSimulation, reconnect, clearEvents } =
    useBattMoWebSocket({
      url: 'ws://localhost:8080', // or wss://your-host/ws
      // token: 'optional-jwt-or-session-token',
      autoReconnect: true,
      heartbeatMs: 20_000,
    });

  const hdf5Event = useMemo(() => {
    // find the last event that contains hdf5Bytes
    for (let i = events.length - 1; i >= 0; i--) {
      const ev = events[i];
      if (ev.type === 'hdf5' && ev.hdf5Bytes) return ev;
    }
    return null;
  }, [events]);

  const [simInput, setSimInput] = useState('{"alpha": 0.1, "beta": 42}');

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui' }}>
      <h2>Julia Simulation Client</h2>
      <div>Status: <strong>{status}</strong> {lastError && <em>({lastError})</em>}</div>
      <div>Client UUID: {clientUUID ?? '—'}</div>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <button onClick={reconnect}>Reconnect</button>
        <button onClick={clearEvents}>Clear events</button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        try {
          const json = JSON.parse(simInput);
          const ok = runSimulation(json);
          if (!ok) alert('Socket not open');
        } catch {
          alert('Invalid JSON input');
        }
      }}>
        <textarea
          value={simInput}
          onChange={(e) => setSimInput(e.target.value)}
          rows={4}
          style={{ width: 480 }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={status !== 'open'}>Run simulation</button>
          <button type="button" onClick={() => cancelSimulation()} disabled={status !== 'open'}>Cancel</button>
        </div>
      </form>

      <h3 style={{ marginTop: 16 }}>Events</h3>
      <pre style={{ background: '#f6f6f6', padding: 12, maxHeight: 300, overflow: 'auto' }}>
        {events.map((ev, i) => {
          if (ev.type === 'hdf5' && ev.hdf5Bytes) {
            const len = (ev.hdf5Bytes as ArrayBuffer).byteLength;
            return <div key={i}>HDF5 bytes received: {len} bytes</div>;
          }
          return <div key={i}>{JSON.stringify(ev.raw ?? ev, null, 2)}</div>;
        })}
      </pre>

      {hdf5Event && (
        <div style={{ marginTop: 12 }}>
          <strong>Last HDF5 payload length:</strong> {(hdf5Event.hdf5Bytes as ArrayBuffer).byteLength} bytes
          {/* TODO: pass ArrayBuffer to your HDF5 parser/worker */}
        </div>
      )}
    </div>
  );
}