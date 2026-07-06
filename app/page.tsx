import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileText,
  MapPin,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";

const heroImages = [
  "/images/hero/hero-1.jpg",
  "/images/hero/hero-2.jpeg",
  "/images/hero/hero-3.jpg",
  "/images/hero/hero-4.jpg",
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="realestate-hero">
        <div className="hero-background-slider" aria-hidden="true">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className="hero-background-slide"
              style={{
                backgroundImage: `url(${image})`,
              animationDelay: `${index * 1}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-dark-overlay" />

        <div className="realestate-hero-content">
          <div className="realestate-hero-copy">
            <p className="hero-kicker">Noble Addis</p>

            <h1>Make clearer property decisions in Addis Ababa.</h1>

            <p>
              Review property prices, location, and suspicious listing signals
              before contacting an agent, visiting a property, or making a
              payment.
            </p>

            <div className="realestate-hero-actions">
              <Link href="/evaluate" className="hero-primary-button">
                <SearchCheck size={18} />
                Check a property
              </Link>

              <Link href="/reports" className="hero-secondary-button">
                <FileText size={18} />
                View history
              </Link>
            </div>

            <div className="hero-trust-row">
              <span>
                <Database size={15} />
                Addis property data
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

          <div className="hero-result-preview">
            <div className="hero-preview-top">
              <span>Sample check</span>
              <strong>Bole, 2-bedroom apartment</strong>
            </div>

            <div className="hero-preview-row">
              <span>Listed price</span>
              <strong>ETB 1,850,000</strong>
            </div>

            <div className="hero-preview-row">
              <span>Estimated value</span>
              <strong>ETB 5,589,821</strong>
            </div>

            <div className="hero-preview-row">
              <span>Price signal</span>
              <strong>Underpriced</strong>
            </div>

            <div className="hero-preview-row">
              <span>Risk level</span>
              <strong>High caution</strong>
            </div>

            <div className="hero-preview-note">
              <MapPin size={17} />
              <span>Verify location, documents, and seller details.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="clean-section">
        <div className="clean-section-title">
          <p className="section-kicker">What it checks</p>
          <h2>Focused on price and listing signals</h2>
          <p>
            Noble Addis keeps the property review simple: price estimate, price
            signal, suspicion level, and buyer guidance.
          </p>
        </div>

        <div className="clean-feature-grid">
          <article className="clean-feature-card">
            <BarChart3 size={26} />
            <h3>Price prediction</h3>
            <p>Estimates a fair property value using Addis property data.</p>
          </article>

          <article className="clean-feature-card">
            <AlertTriangle size={26} />
            <h3>Price signal</h3>
            <p>Compares the listed price with the estimated value.</p>
          </article>

          <article className="clean-feature-card">
            <ShieldAlert size={26} />
            <h3>Suspicion review</h3>
            <p>Flags listings that may need closer verification.</p>
          </article>

          <article className="clean-feature-card">
            <CheckCircle2 size={26} />
            <h3>Buyer guidance</h3>
            <p>Shows what the buyer should confirm before moving forward.</p>
          </article>
        </div>
      </section>

      <section className="clean-process-section">
        <div className="clean-section-title">
          <p className="section-kicker">How it works</p>
          <h2>A simple review flow</h2>
          <p>
            The platform supports quick property review before a buyer spends
            time or money on a listing.
          </p>
        </div>

        <div className="clean-step-grid">
          <div className="clean-step-card">
            <span>1</span>
            <p>Enter property location, type, price, size, and rooms.</p>
          </div>

          <div className="clean-step-card">
            <span>2</span>
            <p>The model estimates a fair property value.</p>
          </div>

          <div className="clean-step-card">
            <span>3</span>
            <p>The system compares listed price with estimated value.</p>
          </div>

          <div className="clean-step-card">
            <span>4</span>
            <p>It shows risk level and buyer guidance.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
