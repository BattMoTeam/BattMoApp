import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.ts";

type JsonRecord = Record<string, unknown>;

const connectionString = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });
const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(scriptDir, "..", "..", "..", "..");

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asStringOrJson(value: unknown) {
  if (typeof value === "string") {
    return { stringValue: value, jsonValue: null };
  }

  if (value === undefined || value === null) {
    return { stringValue: null, jsonValue: null };
  }

  return { stringValue: null, jsonValue: value };
}

async function loadJson(relativePath: string) {
  const filePath = resolve(repoRoot, "gui-streamlit", ...relativePath.split("/"));
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as unknown;
}

async function upsertTemplate(templateName: string, payload: unknown) {
  const template = await prisma.template.upsert({
    where: { name: templateName },
    update: {},
    create: { name: templateName },
  });

  if (!isRecord(payload) || !isRecord(payload.Parameters)) {
    return template;
  }

  const parameters = Object.entries(payload.Parameters);
  for (const [index, entry] of parameters.entries()) {
    const [parameterName, rawDefinition] = entry;
    if (!isRecord(rawDefinition)) continue;

    const contextType = asStringOrJson(rawDefinition.context_type);
    const modelNames = Array.isArray(rawDefinition.model_name) ? rawDefinition.model_name : rawDefinition.model_name ?? null;

    await prisma.templateParameter.upsert({
      where: {
        template_id_name: {
          template_id: template.id,
          name: parameterName,
        },
      },
      update: {
        model_names: modelNames,
        par_class: asString(rawDefinition.par_class),
        difficulty: asString(rawDefinition.difficulty),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        type: asString(rawDefinition.type),
        unit: asString(rawDefinition.unit),
        unit_name: asString(rawDefinition.unit_name),
        unit_iri: asString(rawDefinition.unit_iri),
        max_value: asNumber(rawDefinition.max_value),
        min_value: asNumber(rawDefinition.min_value),
        is_shown_to_user: asBoolean(rawDefinition.is_shown_to_user) ?? true,
        description: asString(rawDefinition.description),
        display_name: asString(rawDefinition.display_name),
        order_index: index,
      },
      create: {
        name: parameterName,
        model_names: modelNames,
        par_class: asString(rawDefinition.par_class),
        difficulty: asString(rawDefinition.difficulty),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        type: asString(rawDefinition.type),
        unit: asString(rawDefinition.unit),
        unit_name: asString(rawDefinition.unit_name),
        unit_iri: asString(rawDefinition.unit_iri),
        max_value: asNumber(rawDefinition.max_value),
        min_value: asNumber(rawDefinition.min_value),
        is_shown_to_user: asBoolean(rawDefinition.is_shown_to_user) ?? true,
        description: asString(rawDefinition.description),
        display_name: asString(rawDefinition.display_name),
        order_index: index,
        template: { connect: { id: template.id } },
      },
    });
  }

  return template;
}

async function importTemplates() {
  const templateFiles = [
    "database/recources/parameter_sets/meta_data/active_material_template.json",
    "database/recources/parameter_sets/meta_data/additive_template.json",
    "database/recources/parameter_sets/meta_data/binder_template.json",
    "database/recources/parameter_sets/meta_data/boundary_conditions_template.json",
    "database/recources/parameter_sets/meta_data/cell_template.json",
    "database/recources/parameter_sets/meta_data/current_collector_template.json",
    "database/recources/parameter_sets/meta_data/electrode_properties_template.json",
    "database/recources/parameter_sets/meta_data/electrolyte_template.json",
    "database/recources/parameter_sets/meta_data/model_template.json",
    "database/recources/parameter_sets/meta_data/protocol_template.json",
    "database/recources/parameter_sets/meta_data/separator_template.json",
  ];

  for (const templateFile of templateFiles) {
    const payload = await loadJson(templateFile);
    if (!isRecord(payload) || typeof payload.Name !== "string") continue;
    await upsertTemplate(payload.Name, payload);
  }
}

async function importTabs() {
  const tabsPayload = await loadJson("database/recources/tabs.json");
  if (!isRecord(tabsPayload) || !isRecord(tabsPayload.tabs)) return;

  for (const [index, entry] of Object.entries(tabsPayload.tabs).entries()) {
    const [name, rawDefinition] = entry;
    if (!isRecord(rawDefinition)) continue;

    const contextType = asStringOrJson(rawDefinition.context_type);
    await prisma.simulatorTab.upsert({
      where: { name },
      update: {
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        display_name: asString(rawDefinition.display_name) ?? name,
        description: asString(rawDefinition.description),
        order_index: index,
      },
      create: {
        name,
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        display_name: asString(rawDefinition.display_name) ?? name,
        description: asString(rawDefinition.description),
        order_index: index,
      },
    });
  }
}

async function importCategories() {
  const categoriesPayload = await loadJson("database/recources/categories.json");
  if (!isRecord(categoriesPayload) || !isRecord(categoriesPayload.categories)) return;

  for (const [index, entry] of Object.entries(categoriesPayload.categories).entries()) {
    const [name, rawDefinition] = entry;
    if (!isRecord(rawDefinition)) continue;

    const tabName = asString(rawDefinition.tab_name);
    const templateName = asString(rawDefinition.default_template);
    if (!tabName || !templateName) continue;

    const [tab, template] = await Promise.all([
      prisma.simulatorTab.findUnique({ where: { name: tabName } }),
      prisma.template.findUnique({ where: { name: templateName } }),
    ]);

    if (!tab || !template) continue;

    const contextType = asStringOrJson(rawDefinition.context_type);

    await prisma.simulatorCategory.upsert({
      where: { name },
      update: {
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        emmo_relation: asString(rawDefinition.emmo_relation),
        display_name: asString(rawDefinition.display_name) ?? name,
        description: asString(rawDefinition.description),
        order_index: index,
        tab: { connect: { id: tab.id } },
        default_template: { connect: { id: template.id } },
      },
      create: {
        name,
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        emmo_relation: asString(rawDefinition.emmo_relation),
        display_name: asString(rawDefinition.display_name) ?? name,
        description: asString(rawDefinition.description),
        order_index: index,
        tab: { connect: { id: tab.id } },
        default_template: { connect: { id: template.id } },
      },
    });
  }
}

async function importComponents() {
  const componentsPayload = await loadJson("database/recources/components.json");
  if (!isRecord(componentsPayload) || !isRecord(componentsPayload.components)) return;

  for (const [index, entry] of Object.entries(componentsPayload.components).entries()) {
    const [name, rawDefinition] = entry;
    if (!isRecord(rawDefinition)) continue;

    const categoryName = asString(rawDefinition.category_name);
    const templateName = asString(rawDefinition.default_template);
    if (!categoryName || !templateName) continue;

    const [category, template] = await Promise.all([
      prisma.simulatorCategory.findUnique({ where: { name: categoryName } }),
      prisma.template.findUnique({ where: { name: templateName } }),
    ]);

    if (!category || !template) continue;

    const contextType = asStringOrJson(rawDefinition.context_type);

    await prisma.simulatorComponent.upsert({
      where: { name },
      update: {
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        material: asBoolean(rawDefinition.material) ?? false,
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        emmo_relation: asString(rawDefinition.emmo_relation),
        display_name: asString(rawDefinition.display_name) ?? name,
        description: asString(rawDefinition.description),
        order_index: index,
        category: { connect: { id: category.id } },
        default_template: { connect: { id: template.id } },
      },
      create: {
        name,
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        material: asBoolean(rawDefinition.material) ?? false,
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        emmo_relation: asString(rawDefinition.emmo_relation),
        display_name: asString(rawDefinition.display_name) ?? name,
        description: asString(rawDefinition.description),
        order_index: index,
        category: { connect: { id: category.id } },
        default_template: { connect: { id: template.id } },
      },
    });
  }
}

async function importMaterials() {
  const materialsPayload = await loadJson("database/recources/materials.json");
  if (!isRecord(materialsPayload) || !isRecord(materialsPayload.materials)) return;

  for (const [entryIndex, entry] of Object.entries(materialsPayload.materials).entries()) {
    const [name, rawDefinition] = entry;
    if (!isRecord(rawDefinition)) continue;

    const contextType = asStringOrJson(rawDefinition.context_type);
    const material = await prisma.material.upsert({
      where: { name },
      update: {
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        is_shown_to_user: asBoolean(rawDefinition.is_shown_to_user) ?? true,
        reference_name: asString(rawDefinition.reference_name),
        reference: asString(rawDefinition.reference),
        reference_url: asString(rawDefinition.reference_url),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        display_name: asString(rawDefinition.display_name) ?? name,
        number_of_components: asNumber(rawDefinition.number_of_components),
        default_material: asBoolean(rawDefinition.default_material) ?? false,
        description: asString(rawDefinition.description),
      },
      create: {
        name,
        model_names: rawDefinition.model_name ?? null,
        difficulty: asString(rawDefinition.difficulty),
        is_shown_to_user: asBoolean(rawDefinition.is_shown_to_user) ?? true,
        reference_name: asString(rawDefinition.reference_name),
        reference: asString(rawDefinition.reference),
        reference_url: asString(rawDefinition.reference_url),
        context_type: contextType.stringValue,
        context_type_json: contextType.jsonValue,
        context_type_iri: asString(rawDefinition.context_type_iri),
        display_name: asString(rawDefinition.display_name) ?? name,
        number_of_components: asNumber(rawDefinition.number_of_components),
        default_material: asBoolean(rawDefinition.default_material) ?? false,
        description: asString(rawDefinition.description),
      },
    });

    const componentNames = [
      asString(rawDefinition.component_name_1),
      asString(rawDefinition.component_name_2),
    ].filter((componentName): componentName is string => componentName !== null);

    await prisma.materialComponent.deleteMany({
      where: { material_id: material.id },
    });

    for (const [componentOrderIndex, componentName] of componentNames.entries()) {
      const component = await prisma.simulatorComponent.findUnique({ where: { name: componentName } });
      if (!component) continue;

      await prisma.materialComponent.create({
        data: {
          order_index: componentOrderIndex + entryIndex * 10,
          material: { connect: { id: material.id } },
          component: { connect: { id: component.id } },
        },
      });
    }
  }
}

async function main() {
  await importTemplates();
  await importTabs();
  await importCategories();
  await importComponents();
  await importMaterials();

  console.log("Simulator blueprint import completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
