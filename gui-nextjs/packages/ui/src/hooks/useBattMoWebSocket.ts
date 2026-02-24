
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
  type: 'client_id' | 'info' | 'error' | 'hdf5' | 'result' | 'kpis' | 'meta';
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
 * - Connects to the BattMo WS server
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
  const reconnectTimer = useRef<number | null>(null);
  const intentionalClose = useRef(false);

  const formatCloseMessage = useCallback((event: CloseEvent, reconnecting: boolean) => {
    const reason = event.reason?.trim() ? event.reason : 'no reason provided';
    if (event.code === 1006 && reconnecting) {
      return null;
    }
    const suffix = reconnecting ? ' Reconnecting...' : '';
    return `Closed: code=${event.code}, reason=${reason}.${suffix}`;
  }, []);

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

    intentionalClose.current = false;
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
          const existing = copy[pos];
          if (!existing) return copy;
          copy[pos] = {
            type: existing.type,
            raw: existing.raw,
            clientUUID: existing.clientUUID,
            hdf5Header: existing.hdf5Header,
            hdf5Bytes: data,
          };
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
          } else if (msg.type === 'kpis') {
            setEvents(prev => [...prev, { type: 'kpis', raw: msg }]);
          } else if (msg.type === 'meta') {
            setEvents(prev => [...prev, { type: 'meta', raw: msg }]);
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

    
  ws.onerror = (event) => {
    if (intentionalClose.current) return;
    setStatus('error');
    setLastError(`WebSocket error: ${event.type}`);
    // Browser WebSocket "error" events are intentionally opaque; close info is more useful.
    console.warn('WebSocket error event (opaque):', {
      type: event.type,
      url: ws.url,
      readyState: ws.readyState,
    });
  };


    ws.onclose = (event) => {
      setStatus('closed');
      if (heartbeatTimer.current) {
        window.clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = null;
      }
      if (intentionalClose.current) {
        return;
      }

      const reconnecting = Boolean(autoReconnect);
      if (reconnecting) {
        const attempt = ++reconnectAttempts.current;
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), maxBackoffMs);
        reconnectTimer.current = window.setTimeout(connect, delay);
      }

      const closeMessage = formatCloseMessage(event, reconnecting);
      setLastError(closeMessage);
      console.warn('WebSocket closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        url: ws.url,
      });

    };
  }, [autoReconnect, heartbeatMs, maxBackoffMs, buildUrl, formatCloseMessage]);

  useEffect(() => {
    connect();
    return () => {
      intentionalClose.current = true;
      if (heartbeatTimer.current) {
        window.clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = null;
      }
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
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

  const runSimulationTask = useCallback((data: Record<string, unknown>) => {
    // Server expects: {"task":"run_simulation", "data": {...}}
    return sendJson({ task: 'run_simulation', data });
  }, [sendJson]);

  const cancelSimulationTask = useCallback(() => {
    // Server expects: {"task":"cancel_simulation"}
    return sendJson({ task: 'cancel_simulation' });
  }, [sendJson]);

  const calculateKPIsTask = useCallback((data: Record<string, unknown>) => {
    // Server expects: {"task":"calculate_equilibrium_kpis", "data": {...}}
    return sendJson({ task: 'calculate_equilibrium_kpis', data });
  }, [sendJson]);

  const getMetaDataTask = useCallback(() => {
    // Server expects: {"task":"get_meta_data"}
    return sendJson({ task: 'get_meta_data'});
  }, [sendJson]);

  const clearEvents = useCallback(() => setEvents([]), []);

  const reconnect = useCallback(() => {
    intentionalClose.current = true;
    wsRef.current?.close();
    wsRef.current = null;
    connect();
  }, [connect]);

  return {
    status,
    lastError,
    clientUUID,
    events,            // sequence of BattMoEvent (includes hdf5 header + bytes)
    runSimulationTask,
    cancelSimulationTask,
    calculateKPIsTask,
    getMetaDataTask,
    reconnect,
    clearEvents,
  };
}
