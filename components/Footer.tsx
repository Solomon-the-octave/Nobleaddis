import Link from "next/link";
import { Building2, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Building2 size={22} strokeWidth={2.4} />
          </div>

          <div>
            <h3>Noble Addis</h3>
            <p>
              Helping buyers review property prices and suspicious listing
              signals before making decisions in Addis Ababa.
            </p>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <Link href="/">Home</Link>
            <Link href="/evaluate">Check listing</Link>
            <Link href="/reports">History</Link>
            <Link href="/help">Help</Link>
          </div>

          <div>
            <h4>Focus</h4>
            <span>
              <ShieldCheck size={15} /> Price review
            </span>
            <span>
              <MapPin size={15} /> Addis Ababa
            </span>
            <span>
              <Mail size={15} /> Buyer support
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Noble Addis.</span>
        <span>Built for property price review and listing verification.</span>
      </div>
    </footer>
  );
}