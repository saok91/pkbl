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
                    ? "bg-primary/12 text-primary rounded-lg px-3 py-1.5 text-[11px] transition-colors"
                    : "text-text-faint hover:text-text-secondary rounded-lg px-3 py-1.5 text-[11px] transition-colors"
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
