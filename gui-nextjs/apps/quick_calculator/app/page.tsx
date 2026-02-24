import CalculateKPIsButton from "@/components/calculate-kpis-button";
import FileUploader from "@workspace/ui/components/file-uploader";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(144,31,99,0.16),_transparent_52%),linear-gradient(180deg,#f9fbff_0%,#f6f7fb_52%,#eef1f9_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-12">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-xl shadow-primary/10 backdrop-blur-sm sm:p-8">
          <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            BattMo Quick Calculator
          </p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Battery KPI Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Upload a single cell JSON and compute equilibrium KPIs with a guided, real-time interface.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-border bg-card p-5 shadow-md sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">1. Upload Input File</h2>
                <p className="text-sm text-muted-foreground">Drop or choose your JSON file to prepare calculation input.</p>
              </div>
            </div>
            <FileUploader />
          </article>

          <aside className="rounded-2xl border border-border bg-card p-5 shadow-md sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Before You Run</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="rounded-lg bg-muted/50 px-3 py-2">
                Keep the browser tab open while calculations execute.
              </li>
              <li className="rounded-lg bg-muted/50 px-3 py-2">
                Ensure the websocket backend is reachable on your configured URL.
              </li>
              <li className="rounded-lg bg-muted/50 px-3 py-2">
                Results appear below and update automatically when the server responds.
              </li>
            </ul>
          </aside>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-md sm:p-6">
          <h2 className="mb-2 text-lg font-semibold text-foreground">2. Calculate and Inspect Results</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Trigger KPI calculation and inspect raw input/result payloads for debugging and validation.
          </p>
          <CalculateKPIsButton />
        </section>
      </div>
    </div>
  );
}
