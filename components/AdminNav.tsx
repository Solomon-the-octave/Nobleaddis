"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import {
  Building2,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const adminLinks = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Listings",
    href: "/admin/listings",
    icon: Building2,
  },
  {
    label: "Checks",
    href: "/admin/checks",
    icon: FileText,
  },
  {
    label: "Support",
    href: "/admin/support",
    icon: HelpCircle,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  const hideAdminNav =
    pathname === "/admin/login" ||
    pathname === "/login" ||
    pathname === "/signup";

  if (hideAdminNav) {
    return null;
  }

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/admin/login";
  }

  return (
    <header className="admin-top-nav">
      <div className="admin-top-nav-inner">
        <Link href="/admin" className="admin-brand">
          <div className="admin-brand-mark">
            <Building2 size={22} />
          </div>

          <div>
            <strong>Noble Addis</strong>
            <span>Admin workspace</span>
          </div>
        </Link>

        <nav className="admin-nav-links" aria-label="Admin navigation">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "admin-nav-link admin-nav-link-active"
                    : "admin-nav-link"
                }
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-nav-actions">
          <ThemeToggle />

          <Link href="/" className="admin-public-link">
            <Home size={16} />
            Public site
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="admin-signout-button"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}