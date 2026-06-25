import { ClipboardList, FileText, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { sampleListings } from "../../lib/sampleData";

function getListingsForReview() {
  const reviewListings = sampleListings.filter(
    (listing) =>
      listing.status === "flagged" ||
      listing.status === "needs-review" ||
      listing.riskLabel === "suspicious" ||
      listing.riskLabel === "medium-risk"
  );

  if (reviewListings.length > 0) {
    return reviewListings;
  }

  return sampleListings.slice(0, 4);
}

function getStatusLabel(status: string) {
  if (status === "flagged") return "High review";
  if (status === "needs-review") return "Needs review";
  return "Standard";
}

export default function AdminPage() {
  const reviewListings = getListingsForReview();

  return (
    <main className="clean-page">
      <section className="clean-page-header no-line-header">
        <p className="small-label">Admin</p>
        <h1>Review dashboard</h1>
        <p>
          Manage listings that need additional verification before buyers move
          forward.
        </p>

        <div className="admin-header-actions">
          <Link href="/" className="clean-secondary-button">
            <Home size={17} />
            Public site
          </Link>

          <form action="/api/admin/logout" method="post">
            <button className="clean-secondary-button" type="submit">
              <LogOut size={17} />
              Sign out
            </button>
          </form>
        </div>
      </section>

      <section className="admin-summary-grid">
        <div className="admin-summary-card">
          <ClipboardList size={22} />
          <span>Total listings</span>
          <strong>{sampleListings.length}</strong>
        </div>

        <div className="admin-summary-card">
          <FileText size={22} />
          <span>In review</span>
          <strong>{reviewListings.length}</strong>
        </div>

        <div className="admin-summary-card">
          <ClipboardList size={22} />
          <span>Source</span>
          <strong>Jiji data</strong>
        </div>
      </section>

      <section className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <p className="section-kicker">Verification queue</p>
            <h2>Listings needing attention</h2>
          </div>
        </div>

        <div className="admin-table">
          <div className="admin-table-row admin-table-head">
            <span>Listing</span>
            <span>Location</span>
            <span>Type</span>
            <span>Status</span>
            <span>Price</span>
          </div>

          {reviewListings.map((listing) => (
            <div className="admin-table-row" key={listing.id}>
              <span>{listing.title}</span>
              <span>{listing.location}</span>
              <span>{listing.propertyType}</span>
              <span>{getStatusLabel(listing.status)}</span>
              <span>${Math.round(listing.listedPriceUsd).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}