import { prisma } from "./prisma";

export async function getSimulatorBlueprint() {
  return prisma.simulatorTab.findMany({
    orderBy: { order_index: "asc" },
    include: {
      categories: {
        orderBy: { order_index: "asc" },
        include: {
          default_template: {
            include: {
              parameters: {
                where: { is_shown_to_user: true },
                orderBy: { order_index: "asc" },
              },
            },
          },
          components: {
            orderBy: { order_index: "asc" },
            include: {
              default_template: {
                include: {
                  parameters: {
                    where: { is_shown_to_user: true },
                    orderBy: { order_index: "asc" },
                  },
                },
              },
              materials: {
                orderBy: { order_index: "asc" },
                include: {
                  material: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getLibraryMaterials() {
  return prisma.material.findMany({
    where: { is_shown_to_user: true },
    orderBy: [{ default_material: "desc" }, { display_name: "asc" }],
    include: {
      materialsToComponents: {
        include: {
          component: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
}
