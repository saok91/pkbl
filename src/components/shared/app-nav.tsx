"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "ویرایشگر" },
  { href: "/leaderboard", label: "جدول امتیازات" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="ناوبری اصلی">
      <ul className="flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "rounded-lg border border-sky-500/60 bg-sky-950/50 px-3 py-1.5 text-sm font-medium text-sky-100"
                    : "rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700/80"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
