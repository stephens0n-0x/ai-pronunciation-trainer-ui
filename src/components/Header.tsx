"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice" },
  { href: "/history", label: "History" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-20">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Pronunciation Trainer
        </h1>
        <nav className="flex flex-col space-y-4">
          {LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-offset-1", 
                  isActive
                    ? "bg-blue-600 text-white ring-blue-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
