import Link from "next/link";
import {
  Building2,
  ChartNoAxesCombined,
  ClipboardList,
  FileText,
  Home,
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
    icon: Building2,
  },
  {
    label: "Insights",
    href: "/insights",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Admin",
    href: "/admin",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand-wrap">
          <div className="brand-mark">
            <Building2 size={23} strokeWidth={2.4} />
          </div>

          <div>
            <p className="brand-name">Noble Addis</p>
            <p className="brand-subtitle">Remote property intelligence</p>
          </div>
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="nav-link">
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/evaluate" className="nav-cta">
          Evaluate Listing
        </Link>
      </div>

      <div className="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="nav-link">
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}