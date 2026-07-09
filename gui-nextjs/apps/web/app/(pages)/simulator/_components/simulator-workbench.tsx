'use client';

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  AudioWaveform,
  ChartColumn,
  FolderInput,
  Upload,
  Zap,
} from "lucide-react";
import SelectorWithTooltip from "@workspace/ui/components/selector-with-tooltip";
import TextInputWithTooltip from "@workspace/ui/components/text-input-with-tooltip";
import { Button } from "@workspace/ui/components/ui/button";

type TemplateParameter = {
  name: string;
  display_name: string | null;
  description: string | null;
  unit: string | null;
};

type MaterialOption = {
  id: number;
  display_name: string;
  description: string | null;
  default_material: boolean;
};

type ComponentCard = {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  material: boolean;
  default_template: {
    parameters: TemplateParameter[];
  };
  materials: { material: MaterialOption }[];
};

type Category = {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  default_template: {
    parameters: TemplateParameter[];
  };
  components: ComponentCard[];
};

type Tab = {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  categories: Category[];
};

const simulatorModes = [
  { title: "Upload parameters", icon: Upload },
  { title: "Standard modeling", icon: Zap },
  { title: "Reverse modeling", icon: ArrowLeftRight },
  { title: "Long-term cycling", icon: AudioWaveform },
  { title: "Compare results", icon: ChartColumn },
  { title: "Export data", icon: FolderInput },
];

function formatHelper(parameter: TemplateParameter) {
  const details = [parameter.description, parameter.unit ? `Unit: ${parameter.unit}` : null].filter(Boolean);
  return details.join(" ");
}

export default function SimulatorWorkbench({ tabs }: { tabs: Tab[] }) {
  const [activeTabName, setActiveTabName] = useState(tabs[0]?.name ?? "");
  const activeTab = useMemo(
    () => tabs.find((tab) => tab.name === activeTabName) ?? tabs[0],
    [activeTabName, tabs],
  );
  const [activeCategoryName, setActiveCategoryName] = useState(activeTab?.categories[0]?.name ?? "");

  const categories = activeTab?.categories ?? [];
  const activeCategory =
    categories.find((category) => category.name === activeCategoryName) ?? categories[0];

  const onTabChange = (tabName: string) => {
    setActiveTabName(tabName);
    const nextTab = tabs.find((tab) => tab.name === tabName);
    setActiveCategoryName(nextTab?.categories[0]?.name ?? "");
  };

  return (
    <section className="min-h-[calc(100vh-var(--app-nav-height))] bg-background px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary/70">
                Simulation Workspace
              </p>
              <h1 className="mt-3 text-3xl font-bold text-foreground">
                Build a BattMo experiment from reusable templates
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                The web simulator now reads tabs, categories, components, materials,
                and visible template fields from Prisma so the UI matches the old
                BattMo structure instead of placeholder blocks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Run simulation
              </Button>
              <Button variant="outline">Save configuration</Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {simulatorModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.title}
                  className="rounded-lg border border-border bg-secondary px-4 py-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-foreground">{mode.title}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Sections
              </p>
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => onTabChange(tab.name)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                    activeTab?.name === tab.name
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-secondary"
                  }`}
                >
                  <p className="text-sm font-semibold">{tab.display_name}</p>
                  {tab.description ? (
                    <p className={`mt-1 text-xs ${activeTab?.name === tab.name ? "text-white/80" : "text-muted-foreground"}`}>
                      {tab.description}
                    </p>
                  ) : null}
                </button>
              ))}
            </aside>

            <div className="min-w-0">
              {activeTab ? (
                <>
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {activeTab.display_name}
                      </h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {activeTab.description ||
                          "Use the imported BattMo template metadata to configure this part of the experiment."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => setActiveCategoryName(category.name)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          activeCategory?.name === category.name
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-secondary"
                        }`}
                      >
                        {category.display_name}
                      </button>
                    ))}
                  </div>

                  {activeCategory ? (
                    <div className="mt-8 space-y-6">
                      <div className="rounded-lg border border-border bg-secondary p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-primary/75">
                              Category Defaults
                            </p>
                            <h3 className="mt-2 text-2xl font-semibold text-foreground">
                              {activeCategory.display_name}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {activeCategory.description ||
                                "Baseline values imported from the BattMo template metadata."}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                          {activeCategory.default_template.parameters.slice(0, 6).map((parameter) => (
                            <TextInputWithTooltip
                              key={parameter.name}
                              label={parameter.display_name ?? parameter.name}
                              tooltip_text={formatHelper(parameter)}
                              helper_text={parameter.unit ?? ""}
                              placeholder_text="Enter a value"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-2">
                        {activeCategory.components.map((component) => {
                          const options = component.materials.map(({ material }) => material.display_name);
                          const featuredParameters = component.default_template.parameters.slice(0, 4);

                          return (
                            <article
                              key={component.id}
                              className="rounded-lg border border-border bg-card p-6"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Component
                                  </p>
                                  <h3 className="mt-2 text-2xl font-semibold text-foreground">
                                    {component.display_name}
                                  </h3>
                                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {component.description ||
                                      "Material options and template fields linked from the imported Streamlit resources."}
                                  </p>
                                </div>
                                {component.material ? (
                                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    Material-linked
                                  </span>
                                ) : null}
                              </div>

                              {options.length > 0 ? (
                                <div className="mt-5">
                                  <SelectorWithTooltip
                                    label="Material"
                                    tooltip_text="Available materials imported from the BattMo library."
                                    helper_text="Choose one of the seeded BattMo material presets."
                                    options={options}
                                  />
                                </div>
                              ) : null}

                              <div className="mt-6 grid gap-5 md:grid-cols-2">
                                {featuredParameters.map((parameter) => (
                                  <TextInputWithTooltip
                                    key={parameter.name}
                                    label={parameter.display_name ?? parameter.name}
                                    tooltip_text={formatHelper(parameter)}
                                    helper_text={parameter.unit ?? ""}
                                    placeholder_text="Enter a value"
                                  />
                                ))}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
