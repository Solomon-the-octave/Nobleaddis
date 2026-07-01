"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  LifeBuoy,
  SearchCheck,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Check listing",
    href: "/evaluate",
    icon: SearchCheck,
  },
  {
    label: "Market view",
    href: "/insights",
    icon: BarChart3,
  },
  {
    label: "Saved reviews",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Help",
    href: "/help",
    icon: LifeBuoy,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link href="/" className="site-brand" aria-label="Noble Addis home">
          <div className="site-brand-mark">
            <Building2 size={22} strokeWidth={2.4} />
          </div>

          <div className="site-brand-copy">
            <span className="site-brand-name">Noble Addis</span>
            <span className="site-brand-subtitle">Addis property guide</span>
          </div>
        </Link>

        <nav className="site-nav-links" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active ? "site-nav-link site-nav-link-active" : "site-nav-link"
                }
              >
                <Icon size={16} strokeWidth={2.2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link href="/evaluate" className="site-nav-action">
          Start review
        </Link>
      </div>

      <nav className="site-mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "site-mobile-link site-mobile-link-active"
                  : "site-mobile-link"
              }
            >
              <Icon size={16} strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}