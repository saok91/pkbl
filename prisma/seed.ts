import { PrismaClient } from "../generated/prisma";

const DEFAULT_60_KLE = [
  [
    "~\n`",
    "!\n1",
    "@\n2",
    "#\n3",
    "$\n4",
    "%\n5",
    "^\n6",
    "&\n7",
    "*\n8",
    "(\n9",
    ")\n0",
    "_\n-",
    "+\n=",
    { w: 2 },
    "Backspace",
  ],
  [
    { w: 1.5 },
    "Tab",
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "{\n[",
    "}\n]",
    { w: 1.5 },
    "|\n\\",
  ],
  [
    { w: 1.75 },
    "Caps Lock",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    ":\n;",
    "\"\n'",
    { w: 2.25 },
    "Enter",
  ],
  [
    { w: 2.25 },
    "Shift",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "<\n,",
    ">\n.",
    "?\n/",
    { w: 2.75 },
    "Shift",
  ],
  [
    { w: 1.25 },
    "Ctrl",
    { w: 1.25 },
    "Win",
    { w: 1.25 },
    "Alt",
    { a: 7, w: 6.25 },
    "",
    { a: 4, w: 1.25 },
    "Alt",
    { w: 1.25 },
    "Win",
    { w: 1.25 },
    "Menu",
    { w: 1.25 },
    "Ctrl",
  ],
] as const;

const prisma = new PrismaClient();

async function main() {
  await prisma.keyboardTemplate.upsert({
    where: { slug: "template-60-ansi" },
    update: {
      name: "۶۰٪ ANSI پیش‌فرض",
      geometryRef: DEFAULT_60_KLE,
      // Populated in E2-S1 (finger-map-60.json)
      fingerMapRef: {},
      isDefault: true,
      isCommunity: false,
    },
    create: {
      slug: "template-60-ansi",
      name: "۶۰٪ ANSI پیش‌فرض",
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
