import { prisma } from '../lib/prisma'

async function main() {

  const categories_list = ["CelParameter", "CyclingProtocol", "ModelSettings", "SimulationSettings", "SolverSettings"]

  // Create categories
  
const categories = await Promise.all(
  categories_list.map((name) =>
    prisma.category.upsert({
      where: { name },            // requires `@unique` on name
      update: {},
      create: { name },
    })
  )
);

  console.log('Created categories: ', categories)

  // Fetch all users with their posts
  const allCategories = await prisma.category.findMany({
  })
  console.log('All users:', JSON.stringify(allCategories, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })