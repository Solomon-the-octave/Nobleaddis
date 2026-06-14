import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="clean-page">
      <section className="clean-hero">
        <div className="clean-hero-copy">
          <p className="small-label">Noble Addis</p>

          <h1>Check property listings before negotiation.</h1>

          <p>
            A simple review tool for comparing listing prices, checking basic
            risk signals, viewing location context, and saving property review
            reports.
          </p>

          <div className="clean-actions">
            <Link href="/evaluate" className="clean-primary-button">
              Evaluate a listing
              <ArrowRight size={18} />
            </Link>

            <Link href="/insights" className="clean-secondary-button">
              View insights
            </Link>
          </div>
        </div>

        <div className="clean-summary-card">
          <div className="summary-card-header">
            <span>Sample review</span>
            <strong>Apartment in Bole</strong>
          </div>

          <div className="summary-row">
            <span>Listed price</span>
            <strong>ETB 180,000</strong>
          </div>

          <div className="summary-row">
            <span>Review result</span>
            <strong>Needs review</strong>
          </div>

          <div className="summary-row">
            <span>Suggested action</span>
            <strong>Verify documents</strong>
          </div>

          <p>
            This review is only an early screening step. Buyers still need site
            visits, document checks, and professional verification.
          </p>
        </div>
      </section>

      <section className="clean-section">
        <div className="clean-section-title">
          <h2>What the platform checks</h2>
          <p>
            The MVP focuses on the main questions a buyer should ask before
            taking the next step.
          </p>
        </div>

        <div className="clean-feature-grid">
          <div className="clean-feature-card">
            <BarChart3 size={22} />
            <h3>Price comparison</h3>
            <p>Compares the listing price with similar property records.</p>
          </div>

          <div className="clean-feature-card">
            <ShieldCheck size={22} />
            <h3>Risk screening</h3>
            <p>Highlights listings that may need extra review.</p>
          </div>

          <div className="clean-feature-card">
            <MapPin size={22} />
            <h3>Location context</h3>
            <p>Shows the approximate listing area using a map view.</p>
          </div>

          <div className="clean-feature-card">
            <FileText size={22} />
            <h3>Saved reports</h3>
            <p>Keeps each review available for follow-up.</p>
          </div>
        </div>
      </section>
    </main>
  );
}