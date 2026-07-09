import { getLibraryMaterials } from "@workspace/db";

function groupMaterialsByComponent(
  materials: Awaited<ReturnType<typeof getLibraryMaterials>>,
) {
  return materials.reduce<Record<string, typeof materials>>((groups, material) => {
    const firstComponent =
      material.materialsToComponents[0]?.component?.display_name ?? "General";

    groups[firstComponent] ??= [];
    groups[firstComponent].push(material);
    return groups;
  }, {});
}

export default async function LibraryPage() {
  const materials = await getLibraryMaterials();
  const groups = groupMaterialsByComponent(materials);

  return (
    <section className="min-h-[calc(100vh-var(--app-nav-height))] bg-background px-6 py-8">
      <div className="mx-auto max-w-7xl rounded-xl bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary/70">
          BattMo Library
        </p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">
          Seeded materials from the legacy Streamlit app
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          These entries now come from Prisma instead of handwritten page content,
          so the web app can reuse the same BattMo material library across the
          simulator and future editing flows.
        </p>

        <div className="mt-10 space-y-10">
          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <h2 className="text-2xl font-semibold text-foreground">{groupName}</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((material) => (
                  <article
                    key={material.id}
                    className="rounded-lg border border-border bg-secondary p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {material.display_name}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {material.description || "Imported BattMo preset material."}
                        </p>
                      </div>
                      {material.default_material ? (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          Default
                        </span>
                      ) : null}
                    </div>

                    <dl className="mt-5 space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between gap-4">
                        <dt>Difficulty</dt>
                        <dd className="font-medium text-foreground">
                          {material.difficulty ?? "basis"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>Shown to user</dt>
                        <dd className="font-medium text-foreground">
                          {material.is_shown_to_user ? "Yes" : "No"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>References</dt>
                        <dd className="max-w-[60%] text-right font-medium text-foreground">
                          {material.reference_name ?? "Custom"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
