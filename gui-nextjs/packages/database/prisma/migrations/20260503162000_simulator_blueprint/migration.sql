-- CreateTable
CREATE TABLE "Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TemplateParameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model_names" JSONB,
    "par_class" TEXT,
    "difficulty" TEXT,
    "context_type" TEXT,
    "context_type_json" JSONB,
    "context_type_iri" TEXT,
    "type" TEXT,
    "unit" TEXT,
    "unit_name" TEXT,
    "unit_iri" TEXT,
    "max_value" REAL,
    "min_value" REAL,
    "is_shown_to_user" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "display_name" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "template_id" INTEGER NOT NULL,
    CONSTRAINT "TemplateParameter_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SimulatorTab" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model_names" JSONB,
    "difficulty" TEXT,
    "context_type" TEXT,
    "context_type_json" JSONB,
    "context_type_iri" TEXT,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SimulatorCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model_names" JSONB,
    "difficulty" TEXT,
    "context_type" TEXT,
    "context_type_json" JSONB,
    "context_type_iri" TEXT,
    "emmo_relation" TEXT,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "tab_id" INTEGER NOT NULL,
    "default_template_id" INTEGER NOT NULL,
    CONSTRAINT "SimulatorCategory_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "SimulatorTab" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SimulatorCategory_default_template_id_fkey" FOREIGN KEY ("default_template_id") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SimulatorComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model_names" JSONB,
    "difficulty" TEXT,
    "material" BOOLEAN NOT NULL DEFAULT false,
    "context_type" TEXT,
    "context_type_json" JSONB,
    "context_type_iri" TEXT,
    "emmo_relation" TEXT,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "category_id" INTEGER NOT NULL,
    "default_template_id" INTEGER NOT NULL,
    CONSTRAINT "SimulatorComponent_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "SimulatorCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SimulatorComponent_default_template_id_fkey" FOREIGN KEY ("default_template_id") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model_names" JSONB,
    "difficulty" TEXT,
    "is_shown_to_user" BOOLEAN NOT NULL DEFAULT true,
    "reference_name" TEXT,
    "reference" TEXT,
    "reference_url" TEXT,
    "context_type" TEXT,
    "context_type_json" JSONB,
    "context_type_iri" TEXT,
    "display_name" TEXT NOT NULL,
    "number_of_components" INTEGER,
    "default_material" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "MaterialComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "material_id" INTEGER NOT NULL,
    "component_id" INTEGER NOT NULL,
    CONSTRAINT "MaterialComponent_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MaterialComponent_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "SimulatorComponent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateParameter_template_id_name_key" ON "TemplateParameter"("template_id", "name");
CREATE INDEX "TemplateParameter_template_id_order_index_idx" ON "TemplateParameter"("template_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "SimulatorTab_name_key" ON "SimulatorTab"("name");
CREATE INDEX "SimulatorTab_order_index_idx" ON "SimulatorTab"("order_index");

-- CreateIndex
CREATE UNIQUE INDEX "SimulatorCategory_name_key" ON "SimulatorCategory"("name");
CREATE INDEX "SimulatorCategory_tab_id_order_index_idx" ON "SimulatorCategory"("tab_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "SimulatorComponent_name_key" ON "SimulatorComponent"("name");
CREATE INDEX "SimulatorComponent_category_id_order_index_idx" ON "SimulatorComponent"("category_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialComponent_material_id_component_id_key" ON "MaterialComponent"("material_id", "component_id");
CREATE INDEX "MaterialComponent_component_id_order_index_idx" ON "MaterialComponent"("component_id", "order_index");
