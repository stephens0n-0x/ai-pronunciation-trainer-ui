"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const nav = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice" },
  { href: "/history", label: "History" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b sticky top-0 bg-[--background] z-10">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold">AI Pronunciation Trainer</h1>

        <nav className="space-x-4">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm hover:underline",
                pathname === href && "font-semibold underline"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
