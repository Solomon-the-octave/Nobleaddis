import { sampleListings } from "../../lib/sampleData";
import { BarChart3, Home, MapPin, ShieldAlert } from "lucide-react";

function formatUsd(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export default function InsightsPage() {
  const totalListings = sampleListings.length;

  const averagePrice =
    totalListings > 0
      ? Math.round(
          sampleListings.reduce(
            (sum, listing) => sum + listing.listedPriceUsd,
            0
          ) / totalListings
        )
      : 0;

  const reviewListings = sampleListings.filter(
    (listing) => listing.status === "needs-review"
  ).length;

  const flaggedListings = sampleListings.filter(
    (listing) => listing.status === "flagged"
  ).length;

  const locationSummary = Object.values(
    sampleListings.reduce((acc, listing) => {
      if (!acc[listing.location]) {
        acc[listing.location] = {
          location: listing.location,
          count: 0,
          totalPrice: 0,
          totalSize: 0,
        };
      }

      acc[listing.location].count += 1;
      acc[listing.location].totalPrice += listing.listedPriceUsd;
      acc[listing.location].totalSize += listing.sizeSqm;

      return acc;
    }, {} as Record<string, { location: string; count: number; totalPrice: number; totalSize: number }>)
  ).map((item) => ({
    ...item,
    averagePrice: Math.round(item.totalPrice / item.count),
    averageSize: Math.round(item.totalSize / item.count),
  }));

  return (
    <main className="clean-page">
      <section className="clean-page-header no-line-header">
        <p className="small-label">Insights</p>
        <h1>Market overview</h1>
      </section>

      <section className="insight-stat-grid">
        <div className="insight-stat-card">
          <Home size={22} />
          <span>Total listings</span>
          <strong>{totalListings}</strong>
        </div>

        <div className="insight-stat-card">
          <BarChart3 size={22} />
          <span>Average price</span>
          <strong>{formatUsd(averagePrice)}</strong>
        </div>

        <div className="insight-stat-card">
          <ShieldAlert size={22} />
          <span>Needs review</span>
          <strong>{reviewListings}</strong>
        </div>

        <div className="insight-stat-card">
          <ShieldAlert size={22} />
          <span>Flagged</span>
          <strong>{flaggedListings}</strong>
        </div>
      </section>

      <section className="simple-table-section">
        <div className="simple-section-header">
          <h2>Average price by location</h2>
        </div>

        <div className="simple-table-wrap">
          <table className="simple-data-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Listings</th>
                <th>Average price</th>
                <th>Average size</th>
              </tr>
            </thead>

            <tbody>
              {locationSummary.map((item) => (
                <tr key={item.location}>
                  <td>
                    <MapPin size={15} />
                    {item.location}
                  </td>
                  <td>{item.count}</td>
                  <td>{formatUsd(item.averagePrice)}</td>
                  <td>{item.averageSize} sqm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}