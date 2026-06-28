import { PrismaClient } from "../generated/prisma";

import { PERSIAN_STANDARD_60_KLE } from "../src/lib/layout/persian-standard-60";

const DEFAULT_60_KLE = PERSIAN_STANDARD_60_KLE;

const prisma = new PrismaClient();

async function main() {
  await prisma.keyboardTemplate.upsert({
    where: { slug: "template-60-ansi" },
    update: {
      name: "Persian Standard (۶۰٪)",
      geometryRef: DEFAULT_60_KLE,
      // Populated in E2-S1 (finger-map-60.json)
      fingerMapRef: {},
      isDefault: true,
      isCommunity: false,
    },
    create: {
      slug: "template-60-ansi",
      name: "Persian Standard (۶۰٪)",
      geometryRef: DEFAULT_60_KLE,
      // Populated in E2-S1 (finger-map-60.json)
      fingerMapRef: {},
      isDefault: true,
      isCommunity: false,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
