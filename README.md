# PKBL — آزمایشگاه چیدمان صفحه‌کلید فارسی

وب‌اپ برای طراحی، ارزیابی و مقایسهٔ چیدمان‌های صفحه‌کلید فارسی.

**Stack:** [T3](https://create.t3.gg/) — Next.js App Router · TypeScript strict · tRPC · Prisma 6 · PostgreSQL · Tailwind · Vitest · pnpm

**فونت:** [Vazirmatn](https://github.com/rastikerdar/vazirmatn) (OFL)

**مستندات:** [PRD](./docs/prd.md) · [Architecture](./docs/architecture.md) · [Epics](./docs/epics.md) · [Progress](./docs/progress.md)

## پیش‌نیازها

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- [Docker](https://www.docker.com/) (PostgreSQL محلی)

## راه‌اندازی

```bash
cp .env.example .env

pnpm install
pnpm db:up          # PostgreSQL در Docker
pnpm db:migrate     # اعمال migrationها
pnpm db:seed        # قالب ۶۰٪ پیش‌فرض
pnpm dev
```

اپ روی [http://localhost:3000](http://localhost:3000) بالا می‌آید.

## دستورات مفید

| دستور | کار |
|-------|-----|
| `pnpm dev` | سرور توسعه |
| `pnpm check` | lint + typecheck + format |
| `pnpm test` | Vitest (domain modules) |
| `pnpm test:coverage` | coverage برای `src/lib/**` (حداقل ۸۰٪) |
| `pnpm db:up` / `pnpm db:down` | بالا/پایین آوردن Postgres |
| `pnpm db:studio` | Prisma Studio |
| `pnpm format:write` | Prettier |

## ساختار دامنه

ماژول‌های pure TS در `src/lib/` — بدون وابستگی به React:

- `layout/` — KLE و مدل چیدمان
- `ergonomics/` — finger map و penalties
- `corpus/` — نرمال‌سازی و n-gram
- `scoring/` — موتور امتیازدهی
- `leaderboard/` — قوانین leaderboard
- `export/` — pipeline export OS (فاز بعد)

## وضعیت توسعه

پیشرفت اپیک‌ها و استوری‌ها: [docs/progress.md](./docs/progress.md)
