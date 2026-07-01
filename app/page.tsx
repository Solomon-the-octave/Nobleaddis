import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  FileText,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const checks = [
  {
    title: "Price range check",
    text: "See whether a listing looks fair, high, or unusually low compared to similar properties.",
    icon: BarChart3,
  },
  {
    title: "Listing quality review",
    text: "Check missing details, unclear information, and signals that may need follow-up.",
    icon: ClipboardCheck,
  },
  {
    title: "Area context",
    text: "Review basic location information to support better property decisions.",
    icon: MapPin,
  },
  {
    title: "Buyer report",
    text: "Save a simple summary you can use before calling an agent or visiting the property.",
    icon: FileText,
  },
];

const steps = [
  "Enter the property details",
  "Review the price signal",
  "Check listing trust indicators",
  "Use the report before negotiation",
];

export default function HomePage() {
  return (
    <main className="clean-page">
      <section className="clean-hero">
        <div className="clean-hero-copy">
          <p className="small-label">Noble Addis</p>

          <h1>Make clearer property decisions in Addis Ababa.</h1>

          <p>
            Noble Addis helps buyers review property listings, compare price
            signals, spot missing details, and prepare better before contacting
            agents or visiting a property.
          </p>

          <div className="clean-actions">
            <Link href="/evaluate" className="clean-primary-button">
              Check a listing
              <ArrowRight size={18} />
            </Link>

            <Link href="/insights" className="clean-secondary-button">
              View market insights
            </Link>
          </div>

          <div className="clean-hero-points">
            <span>
              <ShieldCheck size={16} />
              Listing review
            </span>

            <span>
              <TrendingUp size={16} />
              Price guidance
            </span>

            <span>
              <MapPin size={16} />
              Addis-focused
            </span>
          </div>
        </div>

        <div className="clean-summary-card">
          <div className="summary-card-header">
            <span>Sample review</span>
            <strong>Bole, 2-bedroom apartment</strong>
          </div>

          <div className="summary-row">
  <span>Listed price</span>
  <strong>ETB 1,850,000</strong>
</div>

          <div className="summary-row">
            <span>Price signal</span>
            <strong>Within expected range</strong>
          </div>

          <div className="summary-row">
            <span>Listing status</span>
            <strong>Looks reasonable</strong>
          </div>

          <p>
            The listing looks reasonable for an initial review, but the buyer
            should still confirm the property size, ownership details, exact
            location, and viewing arrangements before moving forward.
          </p>
        </div>
      </section>

      <section className="clean-section">
        <div className="clean-section-title">
          <p className="small-label">What it checks</p>
          <h2>Built around real buyer questions</h2>
          <p>
            Noble Addis keeps the review simple: price, listing quality,
            location context, and the next step a buyer should take.
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

      <section className="clean-section clean-process-section">
        <div className="clean-section-title">
          <p className="small-label">How it works</p>
          <h2>From listing details to a better decision</h2>
          <p>
            The goal is not to replace the buyer. It gives the buyer a clearer
            starting point before making calls, visits, negotiations, or
            payments.
          </p>
        </div>

        <div className="clean-step-grid">
          {steps.map((step, index) => (
            <div key={step} className="clean-step-card">
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}