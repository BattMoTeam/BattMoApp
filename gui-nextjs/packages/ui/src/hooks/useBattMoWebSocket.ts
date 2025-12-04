
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type Status = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

export interface Hdf5Header {
  type: 'hdf5';
  format: 'hdf5-ipc-stream';
  length: number;
  status: 'finished' | 'error' | string;
}

export interface BattMoEvent {
  type: 'client_id' | 'info' | 'error' | 'hdf5' | 'result';
  // Raw message for non-hdf5 cases
  raw?: any;
  // Populated when type === 'client_id'
  clientUUID?: string;
  // Populated when type === 'hdf5'
  hdf5Header?: Hdf5Header;
  // Populated with the next binary frame after a hdf5 header
  hdf5Bytes?: ArrayBuffer;
}

/**
 * useBattMoWebSocket
 * - Connects to Julia WS server
 * - Parses JSON events and captures the following binary frame for HDF5 output
 */
export function useBattMoWebSocket(options: {
  url: string;               // ws://host:8080 or wss://host:8080
  token?: string;            // optional query token (since headers aren’t supported)
  autoReconnect?: boolean;   // default: true
  heartbeatMs?: number;      // optional app-level ping interval
  maxBackoffMs?: number;     // default: 10_000
}) {
  const {
    url,
    token,
    autoReconnect = true,
    heartbeatMs,
    maxBackoffMs = 10_000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [lastError, setLastError] = useState<string | null>(null);
  const [events, setEvents] = useState<BattMoEvent[]>([]);
  const [clientUUID, setClientUUID] = useState<string | null>(null);

  const expectingBinaryAfterHdf5Header = useRef<boolean>(false);
  const reconnectAttempts = useRef(0);
  const heartbeatTimer = useRef<number | null>(null);

  const buildUrl = useCallback(() => {
    const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined);
    if (token) u.searchParams.set('token', token);
    if (u.protocol.startsWith('http')) {
      u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
    }
    return u.toString();
  }, [url, token]);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setStatus('connecting');
    setLastError(null);
    expectingBinaryAfterHdf5Header.current = false;

    const ws = new WebSocket(buildUrl());
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('open');
      reconnectAttempts.current = 0;

      // Optional heartbeat (app-level ping)
      if (heartbeatMs && heartbeatMs > 0) {
        if (heartbeatTimer.current) window.clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = window.setInterval(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
              wsRef.current.send(JSON.stringify({ type: 'ping', t: Date.now() }));
            } catch {}
          }
        }, heartbeatMs);
      }
    };

    ws.onmessage = (e) => {
      const data = e.data;

      // If we are expecting the binary HDF5 payload right after a header:
      if (expectingBinaryAfterHdf5Header.current && data instanceof ArrayBuffer) {
        expectingBinaryAfterHdf5Header.current = false;
        setEvents(prev => {
          // Attach bytes to the last hdf5 header event
          const idx = [...prev].reverse().findIndex(ev => ev.type === 'hdf5' && ev.hdf5Header && !ev.hdf5Bytes);
          if (idx === -1) {
            // If no header exists, just push a generic event
            return [...prev, { type: 'hdf5', hdf5Bytes: data }];
          }
          const copy = [...prev];
          const pos = copy.length - 1 - idx;
          copy[pos] = { ...copy[pos], hdf5Bytes: data };
          return copy;
        });
        return;
      }

      // Otherwise, treat as JSON text (server says it always sends JSON for control messages)
      if (typeof data === 'string') {
        try {
          const msg = JSON.parse(data);

          // Recognize key event types from your server
          if (msg.type === 'client_id' && typeof msg.UUID === 'string') {
            setClientUUID(msg.UUID);
            setEvents(prev => [...prev, { type: 'client_id', clientUUID: msg.UUID, raw: msg }]);
          } else if (msg.type === 'hdf5') {
            // Header comes first; next frame will be binary
            const header: Hdf5Header = {
              type: 'hdf5',
              format: msg.format,
              length: msg.length,
              status: msg.status,
            };
            expectingBinaryAfterHdf5Header.current = true;
            setEvents(prev => [...prev, { type: 'hdf5', hdf5Header: header, raw: msg }]);
          } else if (msg.type === 'info') {
            setEvents(prev => [...prev, { type: 'info', raw: msg }]);
          } else if (msg.type === 'error') {
            setEvents(prev => [...prev, { type: 'error', raw: msg }]);
          } else if (msg.type === 'result') {
            setEvents(prev => [...prev, { type: 'result', raw: msg }]);
          } else {
            // Unknown JSON shape—still surface it
            setEvents(prev => [...prev, { type: 'info', raw: msg }]);
          }
        } catch {
          // Non-JSON string (unlikely with your server)—log as info
          setEvents(prev => [...prev, { type: 'info', raw: data }]);
        }
      } else if (data instanceof ArrayBuffer) {
        // Binary without a preceding header—surface it
        setEvents(prev => [...prev, { type: 'hdf5', hdf5Bytes: data }]);
      }
    };

    ws.onerror = () => {
      setStatus('error');
      setLastError('WebSocket error');
    };

    ws.onclose = () => {
      setStatus('closed');
      if (heartbeatTimer.current) {
        window.clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = null;
      }
      if (autoReconnect) {
        const attempt = ++reconnectAttempts.current;
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), maxBackoffMs);
        window.setTimeout(connect, delay);
      }
    };
  }, [autoReconnect, heartbeatMs, maxBackoffMs, buildUrl]);

  useEffect(() => {
    connect();
    return () => {
      if (heartbeatTimer.current) {
        window.clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = null;
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect]);

  // --- Client helpers ---

  const sendJson = useCallback((obj: unknown) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    try {
      ws.send(JSON.stringify(obj));
      return true;
    } catch {
      return false;
    }
  }, []);

  const runSimulation = useCallback((data: Record<string, unknown>) => {
    // Server expects: {"task":"run_simulation", "data": {...}}
    return sendJson({ task: 'run_simulation', data });
  }, [sendJson]);

  const cancelSimulation = useCallback(() => {
    // Server expects: {"task":"cancel_simulation"}
    return sendJson({ task: 'cancel_simulation' });
  }, [sendJson]);

  const clearEvents = useCallback(() => setEvents([]), []);

  const reconnect = useCallback(() => {
    wsRef.current?.close(); // onclose handler will trigger reconnect
  }, []);

  return {
    status,
    lastError,
    clientUUID,
    events,            // sequence of BattMoEvent (includes hdf5 header + bytes)
    runSimulation,
    cancelSimulation,
    reconnect,
    clearEvents,
  };
}