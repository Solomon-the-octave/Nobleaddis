import Link from "next/link";
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  SearchCheck,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Evaluate",
    href: "/evaluate",
    icon: SearchCheck,
  },
  {
    label: "Insights",
    href: "/insights",
    icon: BarChart3,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
];

export default function Navbar() {
  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link href="/" className="site-brand" aria-label="Noble Addis home">
          <div className="site-brand-mark">
            <Building2 size={22} strokeWidth={2.4} />
          </div>

          <div className="site-brand-copy">
            <span className="site-brand-name">Noble Addis</span>
            <span className="site-brand-subtitle">Property review platform</span>
          </div>
        </Link>

        <nav className="site-nav-links" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="site-nav-link">
                <Icon size={16} strokeWidth={2.2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link href="/evaluate" className="site-nav-action">
          Review listing
        </Link>
      </div>

      <nav className="site-mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="site-mobile-link">
              <Icon size={16} strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}