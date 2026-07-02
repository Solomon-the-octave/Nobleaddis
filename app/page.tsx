import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileText,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="clean-page">
      <section className="clean-hero">
        <div className="clean-hero-copy">
          <p className="small-label">Noble Addis</p>

          <h1>Make clearer property decisions in Addis Ababa.</h1>

          <p>
            Noble Addis helps buyers check whether a property price looks fair
            and whether the listing may need closer verification before
            contacting an agent, visiting the property, or making any payment.
          </p>

          <div className="clean-actions">
            <Link href="/evaluate" className="clean-primary-button">
              <SearchCheck size={18} />
              Check a property
            </Link>

            <Link href="/reports" className="clean-secondary-button">
              <FileText size={18} />
              View saved checks
            </Link>
          </div>

          <div className="clean-hero-points">
            <span>
              <Database size={15} />
              Trained on Addis property data
            </span>
            <span>
              <BarChart3 size={15} />
              Price prediction
            </span>
            <span>
              <ShieldAlert size={15} />
              Suspicion review
            </span>
          </div>
        </div>

        <div className="clean-summary-card">
          <div className="summary-card-header">
            <span>Sample property check</span>
            <strong>Bole, 2-bedroom apartment</strong>
          </div>

          <div className="summary-row">
            <span>Listed price</span>
            <strong>ETB 1,850,000</strong>
          </div>

          <div className="summary-row">
            <span>Estimated value</span>
            <strong>ETB 1,851,294</strong>
          </div>

          <div className="summary-row">
            <span>Price signal</span>
            <strong>Within expected range</strong>
          </div>

          <div className="summary-row">
            <span>Suspicion level</span>
            <strong>Looks reasonable</strong>
          </div>

          <p>
            The property looks reasonable for an initial review, but the buyer
            should still confirm the property size, ownership documents, exact
            location, and seller details before moving forward.
          </p>
        </div>
      </section>

      <section className="clean-section">
        <div className="clean-section-title">
          <p className="section-kicker">What it checks</p>
          <h2>Focused on price and suspicious listing signals</h2>
          <p>
            Noble Addis keeps the review simple. It focuses on the questions a
            buyer needs answered first: Does the price look fair? Does the
            listing look suspicious? What should I verify before moving forward?
          </p>
        </div>

        <div className="clean-feature-grid">
          <article className="clean-feature-card">
            <BarChart3 size={26} />
            <h3>Price prediction</h3>
            <p>
              Estimates a fair property value using trained Addis Ababa property
              data.
            </p>
          </article>

          <article className="clean-feature-card">
            <AlertTriangle size={26} />
            <h3>Price signal</h3>
            <p>
              Compares the listed price with the estimated value and shows
              whether it looks high, low, or within range.
            </p>
          </article>

          <article className="clean-feature-card">
            <ShieldAlert size={26} />
            <h3>Suspicion review</h3>
            <p>
              Flags listings that may need closer checks because of price,
              missing details, or unusual listing patterns.
            </p>
          </article>

          <article className="clean-feature-card">
            <CheckCircle2 size={26} />
            <h3>Buyer guidance</h3>
            <p>
              Gives simple next steps such as checking ownership documents,
              seller identity, property condition, and exact location.
            </p>
          </article>
        </div>
      </section>

      <section className="clean-process-section">
        <div className="clean-section-title">
          <p className="section-kicker">How it works</p>
          <h2>A simple property review flow</h2>
          <p>
            The platform is designed to support quick decision-making before a
            buyer spends time or money on a property.
          </p>
        </div>

        <div className="clean-step-grid">
          <div className="clean-step-card">
            <span>1</span>
            <p>Enter the property location, type, price, size, and rooms.</p>
          </div>

          <div className="clean-step-card">
            <span>2</span>
            <p>The platform estimates a fair property value.</p>
          </div>

          <div className="clean-step-card">
            <span>3</span>
            <p>It compares the listed price with the estimated value.</p>
          </div>

          <div className="clean-step-card">
            <span>4</span>
            <p>It shows the suspicion level and what the buyer should verify.</p>
          </div>
        </div>
      </section>
    </main>
  );
}