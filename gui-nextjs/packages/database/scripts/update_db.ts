import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.ts";

type SupportedCategoryName =
  | "CellParameters"
  | "ModelSettings"
  | "CyclingProtocol"
  | "SimulationSettings";

type RawMetaParameter = {
  type?: unknown;
  min_value?: unknown;
  max_value?: unknown;
  unit?: unknown;
  unit_name?: unknown;
  unit_iri?: unknown;
  context_type?: unknown;
  context_type_iri?: unknown;
  description?: unknown;
  documentation?: unknown;
  options?: unknown;
};

const SUPPORTED_CATEGORIES: SupportedCategoryName[] = [
  "CellParameters",
  "ModelSettings",
  "CyclingProtocol",
  "SimulationSettings",
];

const connectionString = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" || typeof item === "number" ? String(item) : null))
    .filter((item): item is string => item !== null);
}

function asContextTypeString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asContextTypeJson(value: unknown): unknown | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return null;
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadMetadataFile() {
  const sourcePath = resolve(process.cwd(), "recources", "metadata.raw.json");
  const raw = await readFile(sourcePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!isRecord(parsed)) {
    throw new Error("metadata.raw.json is not a JSON object.");
  }
  return parsed;
}

async function upsertCategoryWithMetaData(categoryName: SupportedCategoryName, categoryPayload: unknown) {
  const category = await prisma.category.upsert({
    where: { name: categoryName },
    update: {},
    create: { name: categoryName },
  });

  if (!isRecord(categoryPayload)) {
    console.warn(`Category ${categoryName} is missing or not an object. Skipping.`);
    return { categoryName, imported: 0 };
  }

  let imported = 0;
  for (const [parameterName, rawDefinition] of Object.entries(categoryPayload)) {
    if (!isRecord(rawDefinition)) continue;

    const definition = rawDefinition as RawMetaParameter;

    const meta = await prisma.parameterMetaData.upsert({
      where: {
        category_id_name: {
          category_id: category.id,
          name: parameterName,
        },
      },
      update: {
        type: asString(definition.type),
        min_value: asNumber(definition.min_value),
        max_value: asNumber(definition.max_value),
        unit: asString(definition.unit),
        unit_name: asString(definition.unit_name),
        unit_iri: asString(definition.unit_iri),
        context_type: asContextTypeString(definition.context_type),
        context_type_json: asContextTypeJson(definition.context_type),
        context_type_iri: asString(definition.context_type_iri),
        description: asString(definition.description),
        documentation: asString(definition.documentation),
      },
      create: {
        name: parameterName,
        type: asString(definition.type),
        min_value: asNumber(definition.min_value),
        max_value: asNumber(definition.max_value),
        unit: asString(definition.unit),
        unit_name: asString(definition.unit_name),
        unit_iri: asString(definition.unit_iri),
        context_type: asContextTypeString(definition.context_type),
        context_type_json: asContextTypeJson(definition.context_type),
        context_type_iri: asString(definition.context_type_iri),
        description: asString(definition.description),
        documentation: asString(definition.documentation),
        category: { connect: { id: category.id } },
      },
    });

    const options = asOptions(definition.options);

    if (options.length === 0) {
      await prisma.parameterMetaDataOption.deleteMany({
        where: { parameter_meta_data_id: meta.id },
      });
    } else {
      await prisma.parameterMetaDataOption.deleteMany({
        where: {
          parameter_meta_data_id: meta.id,
          value: { notIn: options },
        },
      });

      for (const [index, value] of options.entries()) {
        await prisma.parameterMetaDataOption.upsert({
          where: {
            parameter_meta_data_id_value: {
              parameter_meta_data_id: meta.id,
              value,
            },
          },
          update: { order_index: index },
          create: {
            parameter_meta_data_id: meta.id,
            value,
            order_index: index,
          },
        });
      }
    }

    imported += 1;
  }

  return { categoryName, imported };
}

async function main() {
  const metadata = await loadMetadataFile();

  const results = [];
  for (const categoryName of SUPPORTED_CATEGORIES) {
    results.push(await upsertCategoryWithMetaData(categoryName, metadata[categoryName]));
  }

  console.log("Metadata import summary:");
  results.forEach((result) => {
    console.log(`- ${result.categoryName}: ${result.imported} parameter definitions imported`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
