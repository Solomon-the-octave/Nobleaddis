import { sampleListings } from "../../lib/sampleData";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

function formatUsd(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function getReviewListings() {
  const reviewItems = sampleListings.filter(
    (listing) =>
      listing.status === "flagged" ||
      listing.status === "needs-review" ||
      listing.riskLabel === "suspicious" ||
      listing.riskLabel === "medium-risk"
  );

  if (reviewItems.length > 0) {
    return reviewItems;
  }

  return sampleListings.slice(0, 4).map((listing, index) => ({
    ...listing,
    status: index % 2 === 0 ? ("needs-review" as const) : ("flagged" as const),
    riskLabel:
      index % 2 === 0 ? ("medium-risk" as const) : ("suspicious" as const),
  }));
}

function getStatusText(status: string, riskLabel: string) {
  if (status === "flagged" || riskLabel === "suspicious") return "Flagged";
  if (status === "needs-review" || riskLabel === "medium-risk") return "Needs review";
  return "Standard";
}

function getReason(status: string, riskLabel: string) {
  if (status === "flagged" || riskLabel === "suspicious") {
    return "Price or listing details need verification";
  }

  if (status === "needs-review" || riskLabel === "medium-risk") {
    return "Incomplete or unusual listing details";
  }

  return "No major issue";
}

export default function AdminPage() {
  const reviewListings = getReviewListings();

  const flaggedCount = reviewListings.filter(
    (listing) => listing.status === "flagged" || listing.riskLabel === "suspicious"
  ).length;

  const needsReviewCount = reviewListings.filter(
    (listing) =>
      listing.status === "needs-review" || listing.riskLabel === "medium-risk"
  ).length;

  return (
    <main className="clean-page">
      <section className="clean-page-header no-line-header">
        <p className="small-label">Admin</p>
        <h1>Review queue</h1>
      </section>

      <section className="admin-stat-grid">
        <div className="admin-stat-card">
          <ShieldAlert size={22} />
          <span>Total items</span>
          <strong>{reviewListings.length}</strong>
        </div>

        <div className="admin-stat-card">
          <AlertTriangle size={22} />
          <span>Flagged</span>
          <strong>{flaggedCount}</strong>
        </div>

        <div className="admin-stat-card">
          <CheckCircle size={22} />
          <span>Needs review</span>
          <strong>{needsReviewCount}</strong>
        </div>
      </section>

      <section className="admin-table-card">
        <div className="simple-section-header">
          <h2>Listings needing review</h2>
        </div>

        <div className="simple-table-wrap">
          <table className="simple-data-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              {reviewListings.map((listing) => (
                <tr key={listing.id}>
                  <td>{listing.title}</td>
                  <td>{listing.location}</td>
                  <td>{listing.propertyType}</td>
                  <td>{formatUsd(listing.listedPriceUsd)}</td>
                  <td>{getStatusText(listing.status, listing.riskLabel)}</td>
                  <td>{getReason(listing.status, listing.riskLabel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}