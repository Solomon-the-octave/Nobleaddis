"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FileText,
  HelpCircle,
  Home,
  LogIn,
  LogOut,
  SearchCheck,
} from "lucide-react";

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

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
    label: "History",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/admin");

  useEffect(() => {
    if (hideNavbar) return;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const data = await response.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, [hideNavbar, pathname]);

  if (hideNavbar) {
    return null;
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/";
  }

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link href="/" className="site-brand" aria-label="Noble Addis home">
          <div className="site-brand-logo">
            <img src="/brand/noble-addis-icon-clean.png" alt="Noble Addis logo" />
          </div>

          <div className="site-brand-copy">
            <span className="site-brand-name">Noble Addis</span>
            <span className="site-brand-subtitle">
              Addis real estate review
            </span>
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
                  active
                    ? "site-nav-link site-nav-link-active"
                    : "site-nav-link"
                }
              >
                <Icon size={16} strokeWidth={2.2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="site-nav-actions">
          <ThemeToggle />

          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="site-nav-ghost-action"
            >
              <LogOut size={16} />
              Sign out
            </button>
          ) : (
            <Link href="/login" className="site-nav-action">
              <LogIn size={16} />
              Sign in
            </Link>
          )}
        </div>
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