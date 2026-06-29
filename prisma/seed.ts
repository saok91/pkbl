import { PrismaClient } from "../generated/prisma";

import { listPresets } from "../src/lib/corpus/presets";
import { PERSIAN_STANDARD_60_KLE } from "../src/lib/layout/persian-standard-60";

const DEFAULT_60_KLE = PERSIAN_STANDARD_60_KLE;

const prisma = new PrismaClient();

async function main() {
  await prisma.keyboardTemplate.upsert({
    where: { slug: "template-60-ansi" },
    update: {
      name: "Persian Standard (۶۰٪)",
      geometryRef: DEFAULT_60_KLE,
      fingerMapRef: {},
      isDefault: true,
      isCommunity: false,
    },
    create: {
      slug: "template-60-ansi",
      name: "Persian Standard (۶۰٪)",
      geometryRef: DEFAULT_60_KLE,
      fingerMapRef: {},
      isDefault: true,
      isCommunity: false,
    },
  });

  for (const preset of listPresets()) {
    await prisma.corpusPreset.upsert({
      where: { id: preset.id },
      update: {
        name: preset.nameFa,
        ngramArtifactRef: preset.artifactFileName,
        version: Number.parseInt(preset.version, 10) || 1,
      },
      create: {
        id: preset.id,
        name: preset.nameFa,
        ngramArtifactRef: preset.artifactFileName,
        version: Number.parseInt(preset.version, 10) || 1,
      },
    });
  }
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
