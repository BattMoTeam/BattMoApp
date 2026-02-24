import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type MetaCategoryKey =
  | "CellParameters"
  | "ModelSettings"
  | "CyclingProtocol"
  | "SimulationSettings";

type MetaMessage = {
  type: "meta";
  [key: string]: unknown;
};

type WsCloseLike = {
  code?: number;
  reason?: string;
};

const CATEGORY_KEYS: MetaCategoryKey[] = [
  "CellParameters",
  "ModelSettings",
  "CyclingProtocol",
  "SimulationSettings",
];

function getWsUrlFromEnv() {
  const envUrl = process.env.BATTMO_WS_URL ?? process.env.NEXT_PUBLIC_BATTMO_WS_URL;
  return envUrl?.trim() || "ws://localhost:8080";
}

function extractMetaPayload(message: Record<string, unknown>) {
  const payloadCandidates = [
    message.payload,
    message.data,
    message.result,
    message.meta,
    message,
  ];

  for (const candidate of payloadCandidates) {
    if (candidate && typeof candidate === "object") {
      return candidate as Record<string, unknown>;
    }
  }
  return null;
}

function countLeafKeys(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + countLeafKeys(item), 0);
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return 1;
    return entries.reduce((sum, [, nested]) => sum + countLeafKeys(nested), 0);
  }
  return 1;
}

function collectPaths(value: unknown, path = "", out: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collectPaths(item, `${path}[${idx}]`, out));
    return out;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0 && path) out.push(path);
    entries.forEach(([k, nested]) => {
      const nextPath = path ? `${path}.${k}` : k;
      collectPaths(nested, nextPath, out);
    });
    return out;
  }
  if (path) out.push(path);
  return out;
}

async function requestMetaData(wsUrl: string, timeoutMs = 20_000): Promise<Record<string, unknown>> {
  return new Promise((resolvePromise, rejectPromise) => {
    const ws = new WebSocket(wsUrl);
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        ws.close();
      } catch {}
      rejectPromise(new Error(`Timed out after ${timeoutMs} ms waiting for meta data.`));
    }, timeoutMs);

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      fn();
    };

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ task: "get_meta_data" }));
    });

    ws.addEventListener("message", (event) => {
      const data = event.data;
      if (typeof data !== "string") return;

      try {
        const parsed = JSON.parse(data) as MetaMessage;
        if (parsed.type !== "meta") return;

        const payload = extractMetaPayload(parsed as Record<string, unknown>);
        if (!payload) return;

        finish(() => {
          ws.close();
          resolvePromise(payload);
        });
      } catch {
        // Ignore non-JSON frames.
      }
    });

    ws.addEventListener("error", () => {
      finish(() => rejectPromise(new Error("WebSocket connection failed while requesting meta data.")));
    });

    ws.addEventListener("close", (event: WsCloseLike) => {
      // If it closes before we resolve and no payload arrived, surface as failure.
      finish(() =>
        rejectPromise(
          new Error(
            `WebSocket closed before meta data arrived (code=${event.code ?? "unknown"}, reason=${event.reason ?? ""}).`,
          ),
        ),
      );
    });
  });
}

async function main() {
  const wsUrl = getWsUrlFromEnv();
  console.log(`Connecting to BattMo: ${wsUrl}`);

  const meta = await requestMetaData(wsUrl);

  const outDir = resolve(process.cwd(), "recources");
  const rawOutPath = resolve(outDir, "metadata.raw.json");
  const analysisPath = resolve(outDir, "metadata.analysis.json");

  await mkdir(dirname(rawOutPath), { recursive: true });
  await writeFile(rawOutPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");

  const analysis = CATEGORY_KEYS.map((key) => {
    const category = meta[key];
    const paths = collectPaths(category);
    return {
      category: key,
      exists: category !== undefined,
      leafCount: countLeafKeys(category),
      samplePaths: paths.slice(0, 25),
    };
  });

  await writeFile(
    analysisPath,
    `${JSON.stringify({ wsUrl, generatedAt: new Date().toISOString(), categories: analysis }, null, 2)}\n`,
    "utf8",
  );

  console.log(`Saved raw metadata -> ${rawOutPath}`);
  console.log(`Saved analysis -> ${analysisPath}`);

  const missing = analysis.filter((c) => !c.exists).map((c) => c.category);
  if (missing.length) {
    console.warn(`Missing expected categories: ${missing.join(", ")}`);
  } else {
    console.log("All expected categories were found in metadata payload.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
