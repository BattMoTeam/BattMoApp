// hooks/useWebSocket.ts
"use client";

import { useEffect, useRef, useState } from "react";

export interface HDF5Section {
  [key: string]: any[];
}

export interface SimulationData {
  time_series?: HDF5Section;
  states?: HDF5Section;
  metrics?: HDF5Section;
}

interface UseWebSocketOptions {
  url: string;
  maxRetries?: number;
  reconnectDelay?: number;
  onData?: (data: SimulationData) => void;
  onLog?: (msg: string) => void;
}

export function useWebSocket({ url, maxRetries = 2, reconnectDelay = 2000, onData, onLog }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const [expectHDF5, setExpectHDF5] = useState(false);
  const [expectedLength, setExpectedLength] = useState(0);

  function log(msg: string) {
    if (onLog) onLog(msg);
    console.log(msg);
  }

  async function parseHDF5Server(bytes: Uint8Array) {
    const res = await fetch("/api/parse-hdf5", {
      method: "POST",
      body: bytes,
    });
    return res.json();
  }

  function connect() {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    log(`🔌 Connecting to ${url} ...`);
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      log("🟢 WebSocket connected");
      retryRef.current = 0;
    };

    ws.onmessage = async (event) => {
      try {
        if (typeof event.data === "string") {
          const parsed = JSON.parse(event.data);
          switch (parsed.type) {
            case "progress":
              log(`⏳ Progress: ${parsed.step} / ${parsed.total}`);
              break;
            case "info":
              log(`ℹ️ Info: ${parsed.message}`);
              break;
            case "error":
              log(`❌ Server error: ${parsed.error}`);
              break;
            case "result":
              log(`📘 Simulation finished: ${parsed.status}`);
              break;
            case "hdf5":
              log(`📦 HDF5 header received, expecting ${parsed.length} bytes`);
              setExpectHDF5(true);
              setExpectedLength(parsed.length);
              break;
            default:
              log(`📩 JSON: ${JSON.stringify(parsed)}`);
          }
        } else if (event.data instanceof ArrayBuffer) {
          if (!expectHDF5) {
            log("⚠️ Unexpected binary data");
            return;
          }
          const bytes = new Uint8Array(event.data);
          if (bytes.length !== expectedLength) {
            log(`⚠️ HDF5 size mismatch: expected ${expectedLength}, got ${bytes.length}`);
          }

          const parsedData = await parseHDF5Server(bytes);
          onData?.(parsedData);
          log("✅ HDF5 parsed via server");
          setExpectHDF5(false);
          setExpectedLength(0);
        }
      } catch (e) {
        log(`❌ Error processing message: ${e}`);
      }
    };

    ws.onerror = (err) => log(`❌ WebSocket error: ${err}`);
    ws.onclose = () => {
      log("🔴 Connection closed");
      if (retryRef.current < maxRetries) {
        retryRef.current++;
        log(`🔁 Retrying in ${reconnectDelay / 1000}s (attempt ${retryRef.current})`);
        setTimeout(connect, reconnectDelay);
      } else {
        log("❌ Max retries reached");
      }
    };
  }

  function send(payload: object) {
    connect(); // ensure connection
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      log("📨 Sent simulation request");
    } else {
      log("⚠️ WebSocket not ready yet");
      // Retry after a short delay if not open
      setTimeout(() => send(payload), 500);
    }
  }

  return { wsRef, send };
}
