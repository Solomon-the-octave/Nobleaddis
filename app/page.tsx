import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  FileText,
  MapPin,
} from "lucide-react";

const checks = [
  {
    title: "Price review",
    text: "Compare the listed price against similar property records.",
    icon: BarChart3,
  },
  {
    title: "Listing checks",
    text: "Review missing details, unusual signals, and buyer caution points.",
    icon: ClipboardCheck,
  },
  {
    title: "Location context",
    text: "View the listing area and basic location information.",
    icon: MapPin,
  },
  {
    title: "Saved reports",
    text: "Keep reviewed listings for comparison and follow-up.",
    icon: FileText,
  },
];

export default function HomePage() {
  return (
    <main className="clean-page">
      <section className="clean-hero">
        <div className="clean-hero-copy">
          <p className="small-label">Noble Addis</p>

          <h1>Review property listings before you move forward.</h1>

          <p>
            Noble Addis helps buyers check price signals, listing details,
            location context, and review history before negotiation.
          </p>

          <div className="clean-actions">
            <Link href="/evaluate" className="clean-primary-button">
              Review a listing
              <ArrowRight size={18} />
            </Link>

            <Link href="/insights" className="clean-secondary-button">
              View market insights
            </Link>
          </div>
        </div>

        <div className="clean-summary-card">
          <div className="summary-card-header">
            <span>Listing review</span>
            <strong>Bole apartment</strong>
          </div>

          <div className="summary-row">
            <span>Listed price</span>
            <strong>ETB 180,000</strong>
          </div>

          <div className="summary-row">
            <span>Review status</span>
            <strong>Needs review</strong>
          </div>

          <div className="summary-row">
            <span>Next step</span>
            <strong>Verify details</strong>
          </div>

          <p>
            Each review gives the buyer a practical starting point before
            contacting an agent or making a site visit.
          </p>
        </div>
      </section>

      <section className="clean-section">
        <div className="clean-section-title">
          <h2>Core checks</h2>
          <p>
            The platform focuses on the information buyers need before taking
            the next step.
          </p>
        </div>

        <div className="clean-feature-grid">
          {checks.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="clean-feature-card">
                <Icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}