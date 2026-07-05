"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  const hideFooter =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/admin");

  if (hideFooter) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
     <Image
  src="/brand/noble-addis-icon-clean.png"
  alt="Noble Addis logo"
  width={82}
  height={82}
  className="footer-logo-img"
/>
          </div>

          <div className="footer-brand-copy">
            <h3>Noble Addis</h3>
            <p>
              Helping buyers review property prices and listing signals before
              making decisions in Addis Ababa.
            </p>
          </div>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4>Platform</h4>
            <Link href="/">Home</Link>
            <Link href="/evaluate">Check listing</Link>
            <Link href="/reports">History</Link>
            <Link href="/help">Help</Link>
          </div>

          <div className="footer-column">
            <h4>Focus</h4>

            <span>
              <ShieldCheck size={16} />
              Price review
            </span>

            <span>
              <MapPin size={16} />
              Addis Ababa
            </span>

            <span>
              <Mail size={16} />
              Buyer support
            </span>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Noble Addis.</span>
        <span>Built for property price review and listing verification.</span>
      </div>
    </footer>
  );
}