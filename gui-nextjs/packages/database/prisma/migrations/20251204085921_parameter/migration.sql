-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Parameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "parameter_meta_data_id" INTEGER NOT NULL,
    CONSTRAINT "Parameter_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "Reference" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Parameter_parameter_meta_data_id_fkey" FOREIGN KEY ("parameter_meta_data_id") REFERENCES "ParameterMetaData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParameterMetaData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "min_value" REAL NOT NULL,
    "max_value" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "unit_name" TEXT NOT NULL,
    "unit_iri" TEXT NOT NULL,
    "context_type" TEXT NOT NULL,
    "context_type_iri" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    CONSTRAINT "ParameterMetaData_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
