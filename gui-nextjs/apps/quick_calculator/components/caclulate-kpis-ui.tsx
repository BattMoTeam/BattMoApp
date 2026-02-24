'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@workspace/ui/components/ui/button';
import { useBattMoWebSocket, type BattMoEvent } from '@workspace/ui/hooks/useBattMoWebSocket';
import Metric, { type MetricType } from '@workspace/ui/components/metric';

type CellData = Record<string, unknown>;
type KPIResult = Record<string, unknown>;
type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function extractKpiResult(event: BattMoEvent): KPIResult | null {
    if (!(event.type === 'kpis' || event.type === 'result')) return null;
    if (!isRecord(event.raw)) return null;

    const payload = event.raw.payload;
    if (isRecord(payload)) return payload;

    const result = event.raw.result;
    if (isRecord(result)) return result;

    const data = event.raw.data;
    if (isRecord(data)) return data;

    return event.raw;
}

function collectNumericEntries(value: unknown, path = '', out: Array<{ path: string; value: number }> = []): Array<{ path: string; value: number }> {
    if (typeof value === 'number' && Number.isFinite(value)) {
        out.push({ path, value });
        return out;
    }

    if (Array.isArray(value)) {
        value.forEach((item, idx) => {
            collectNumericEntries(item, `${path}[${idx}]`, out);
        });
        return out;
    }

    if (isRecord(value)) {
        Object.entries(value).forEach(([key, nested]) => {
            const nextPath = path ? `${path}.${key}` : key;
            collectNumericEntries(nested, nextPath, out);
        });
    }

    return out;
}

function formatMetricLabel(path: string): string {
    const raw = path.split('.').pop() ?? path;
    return raw
        .replace(/\[\d+\]/g, '')
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .trim()
        .replace(/\b\w/g, (m) => m.toUpperCase());
}

function formatMetricValue(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 10_000 || (abs > 0 && abs < 0.001)) {
        return value.toExponential(3);
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export default function CalculateKPIsUI() {
    const fallbackWsUrl =
        typeof window !== 'undefined'
            ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:8080`
            : 'ws://localhost:8080';
    const wsUrl = process.env.NEXT_PUBLIC_BATTMO_WS_URL ?? fallbackWsUrl;
    const {
        status,
        clientUUID,
        events,
        lastError,
        calculateKPIsTask,
        reconnect,
        clearEvents,
    } = useBattMoWebSocket({
        url: wsUrl,
        autoReconnect: true,
        heartbeatMs: 20_000,
    });

    const [cellData, setCellData] = useState<CellData | null>(null);
    const [kpiResult, setKpiResult] = useState<KPIResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    useEffect(() => {
        const latestKpiEvent = [...events]
            .reverse()
            .find((e) => e.type === 'kpis' || e.type === 'result');

        if (latestKpiEvent) {
            const nextKpiResult = extractKpiResult(latestKpiEvent);
            if (nextKpiResult) setKpiResult(nextKpiResult);
        }
    }, [events]);

    useEffect(() => {
        const canSend = cellData && status === 'open' && !isSubmitting;
        if (!canSend) return;

        setIsSubmitting(true);
        (async () => {
            try {
                await calculateKPIsTask(cellData);
            } catch (err) {
                console.error('calculateKPIsTask failed:', err);
            } finally {
                setIsSubmitting(false);
            }
        })();
    }, [cellData, status, calculateKPIsTask, isSubmitting]);

    const statusStyleMap: Record<WsStatus, string> = {
        idle: 'bg-muted text-muted-foreground',
        connecting: 'bg-amber-100 text-amber-800',
        open: 'bg-emerald-100 text-emerald-800',
        closed: 'bg-slate-200 text-slate-800',
        error: 'bg-red-100 text-red-800',
    };

    const metricItems = useMemo<MetricType[]>(() => {
        if (!kpiResult) return [];

        return collectNumericEntries(kpiResult)
            .slice(0, 12)
            .map(({ path, value }) => ({
                label: formatMetricLabel(path),
                value: formatMetricValue(value),
            }));
    }, [kpiResult]);

    return (
        <div className="space-y-4 rounded-2xl border border-border/80 bg-background/70 p-4 shadow-inner sm:p-5">
            <header className="flex flex-col gap-3 border-b border-border/70 pb-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">KPI Runtime Panel</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyleMap[status as WsStatus] ?? statusStyleMap.idle}`}>
                            {String(status)}
                        </span>
                        <span className="text-muted-foreground">
                            Client ID: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{clientUUID ?? '-'}</code>
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => reconnect()}
                        disabled={status === 'open'}
                        className="rounded-lg"
                    >
                        Reconnect
                    </Button>
                    <Button variant="outline" onClick={() => clearEvents()} className="rounded-lg">
                        Clear events
                    </Button>
                </div>
            </header>

            <section className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Events</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{events.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Input Loaded</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{cellData ? 'Yes' : 'No'}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Calculation</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{isSubmitting ? 'Running' : 'Idle'}</p>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-3">
                    <h4 className="mb-2 font-medium text-foreground">Input JSON</h4>
                    <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                        {cellData ? JSON.stringify(cellData, null, 2) : 'Loading...'}
                    </pre>
                </div>

                <div className="rounded-xl border border-border bg-card p-3">
                    <h4 className="mb-3 font-medium text-foreground">KPI Overview</h4>
                    {metricItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {metricItems.map((metric, idx) => (
                                <div key={`${metric.label}-${idx}`} className="rounded-lg border border-border bg-background p-3">
                                    <Metric value={metric.value} label={metric.label} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                            {isSubmitting ? 'Calculating KPI metrics...' : 'No numeric KPI values available yet.'}
                        </div>
                    )}

                    <details className="mt-4 rounded-lg border border-border bg-background px-3 py-2">
                        <summary className="cursor-pointer text-sm font-medium text-foreground">View raw KPI JSON</summary>
                        <pre className="mt-3 max-h-[280px] overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                            {kpiResult ? JSON.stringify(kpiResult, null, 2) : 'No result yet'}
                        </pre>
                    </details>
                </div>
            </section>

            {lastError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    Error: {typeof lastError === 'string' ? lastError : JSON.stringify(lastError)}
                </div>
            )}
        </div>
    );
}
