import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  const ping = await api.health.ping({ echo: "سلام PKBL" });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="container flex max-w-2xl flex-col items-center gap-6 px-4 py-16 text-center">
          <p className="text-sm tracking-widest text-slate-400 uppercase">
            Persian Keyboard Layout Lab
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            آزمایشگاه چیدمان صفحه‌کلید فارسی
          </h1>
          <p className="text-lg text-slate-300">
            طراحی، ارزیابی و مقایسهٔ چیدمان‌های فارسی — MVP در حال ساخت (E0
            Foundation).
          </p>
          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-mono text-sm">
            tRPC health: {ping.ok ? "ok" : "fail"} · {ping.echo}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
