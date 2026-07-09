import Image from "next/image";
import {
  ArrowLeftRight,
  AudioWaveform,
  ChartColumn,
  FolderInput,
  Upload,
  Zap,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Set up cell composition, boundary conditions and simulation protocol",
    description:
      "Configure the battery architecture, physical assumptions, and test conditions from one workspace.",
    image: "/screenshot-left.png",
  },
  {
    id: "02",
    title: "Run simulator",
    description:
      "Launch the workflow with BattMo defaults, material presets, and reusable experiment templates.",
    image: "/screenshot-extra.png",
  },
  {
    id: "03",
    title: "Explore the results",
    description:
      "Inspect KPIs, compare curves, and export data once a simulation or calibration run finishes.",
    image: "/screenshot-center.png",
  },
];

const tryThis = [
  { title: "Upload parameters", icon: Upload },
  { title: "Standard modeling", icon: Zap },
  { title: "Reverse modeling", icon: ArrowLeftRight },
  { title: "Long-term cycling", icon: AudioWaveform },
  { title: "Compare results", icon: ChartColumn },
  { title: "Export data", icon: FolderInput },
];

export default function GetStarted() {
  return (
    <section className="w-full bg-secondary py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
          Get <span className="text-primary">started</span>
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {steps.map((step) => (
            <article
              key={step.id}
              className="flex flex-col items-center text-center"
            >
              <h3 className="mb-2 text-xl font-semibold">
                {step.id}. {step.title}
              </h3>
              <p className="mb-6 min-h-20 text-sm text-gray-600">
                {step.description}
              </p>
              <div className="w-full overflow-hidden rounded-lg drop-shadow-lg">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={720}
                  height={520}
                  className="h-60 w-full rounded-lg object-cover object-top"
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-primary px-6 py-10 text-white">
          <h3 className="mb-8 text-center text-2xl font-semibold">Try this</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tryThis.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-lg bg-white/10 px-5 py-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
                    <Icon className="size-5" />
                  </div>
                  <p className="text-base font-medium">{item.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
