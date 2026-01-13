
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@workspace/ui/components/ui/button';
import { useBattMoWebSocket } from '@workspace/ui/hooks/useBattMoWebSocket';

type CellData = Record<string, unknown>; // Replace with a precise interface if you know the schema
type KPIResult = Record<string, unknown>; // Ditto

export default function CalculateKPIsUI() {
    const {
        status,
        clientUUID,
        events,
        lastError,
        calculateKPIsTask,
        reconnect,
        clearEvents,
        cancelSimulationTask,
        runSimulationTask,
    } = useBattMoWebSocket({
        url: 'ws://localhost:8080',
        autoReconnect: true,
        heartbeatMs: 20_000,
    });

    const [cellData, setCellData] = useState<CellData | null>(null);
    const [kpiResult, setKpiResult] = useState<KPIResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch local JSON once
    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const res = await fetch('/api/local-cell-data');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = (await res.json()) as CellData;
                if (active) setCellData(json);
            } catch (err) {
                console.error('Failed to fetch local-cell-data:', err);
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    // Listen for KPI results coming back via websocket events
    useEffect(() => {
        // You’ll need to align this with how your hook structures events.
        // Example assumes events are objects with { type, payload }.
        const latestKpiEvent = [...events].reverse().find((e: any) => e?.type === 'kpi_result');

        if (latestKpiEvent && latestKpiEvent.payload) {
            setKpiResult(latestKpiEvent.payload as KPIResult);
        }
    }, [events]);

    // Auto-fire when cellData is available and socket ready
    useEffect(() => {
        const canSend =
            cellData &&
            status === 'connected' && // adjust to your hook’s status strings
            !isSubmitting;

        if (!canSend) return;

        setIsSubmitting(true);
        (async () => {
            try {
                // If your task expects a specific shape, adapt here.
                // Common pattern: calculateKPIsTask({ clientUUID, input: cellData })
                await calculateKPIsTask(cellData);
            } catch (err) {
                console.error('calculateKPIsTask failed:', err);
            } finally {
                setIsSubmitting(false);
            }
        })();
    }, [cellData, status, calculateKPIsTask, isSubmitting]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Calculate KPIs</h1>
                    <p className="text-sm text-muted-foreground">
                        WebSocket status: <strong>{String(status)}</strong> · Client: {clientUUID ?? '—'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => reconnect()}
                        disabled={status === 'connected'}
                    >
                        Reconnect
                    </Button>
                    <Button variant="outline" onClick={() => clearEvents()}>
                        Clear events
                    </Button>
                </div>
            </header>

            <section className="grid md:grid-cols-2 gap-6">
                <div>
                    <h2 className="font-medium">Input JSON</h2>
                    <pre className="p-3 bg-muted rounded text-xs overflow-auto">
                        {cellData ? JSON.stringify(cellData, null, 2) : 'Loading…'}
                    </pre>
                </div>

                <div>
                    <h2 className="font-medium">KPI Result</h2>
                    <pre className="p-3 bg-muted rounded text-xs overflow-auto">
                        {kpiResult
                            ? JSON.stringify(kpiResult, null, 2)
                            : isSubmitting
                                ? 'Calculating…'
                                : 'No result yet'}
                    </pre>
                </div>
            </section>

            {lastError && (
                <div className="text-red-600 text-sm">
                    Error: {typeof lastError === 'string' ? lastError : JSON.stringify(lastError)}
                </div>
            )}
        </div>
    );
}
