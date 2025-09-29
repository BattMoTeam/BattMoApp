"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@workspace/ui/components/button";

export default function WebSocketClient() {
  const [messages, setMessages] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8082");
    ws.current.onopen = () => {
      console.log("✅ Connected to Julia WebSocket server");
    };

    ws.current.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        console.log("📦 Received binary data:", event.data);
      } else {
        console.log("📩 Received:", event.data);
        setMessages((prev) => [...prev, event.data]);
      }
    };

    ws.current.onclose = () => console.log("❌ Connection closed");

    return () => ws.current?.close();
  }, []);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          user_id: "123e4567-e89b-12d3-a456-426614174000",
          operation: "plotting",
        })
      );
      console.log("📤 Message sent");
    } else {
      console.warn("⚠️ WebSocket not open");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">WebSocket Messages</h1>
      <Button
        onClick={sendMessage}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
      >
        Run Simulation
      </Button>
      <ul className="mt-2 space-y-1">
        {messages.map((msg, i) => (
          <li key={i} className="p-2 bg-gray-100 rounded">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
