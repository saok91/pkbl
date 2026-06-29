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
      <ul className="flex items-center gap-1">
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
                    ? "rounded-lg bg-primary/12 px-3 py-1.5 text-[11px] text-primary transition-colors"
                    : "rounded-lg px-3 py-1.5 text-[11px] text-text-faint transition-colors hover:text-text-secondary"
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
