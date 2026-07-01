import { sampleListings } from "../../lib/sampleData";
import { formatMoney } from "../../lib/prediction";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Home,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type LocationSummary = {
  location: string;
  count: number;
  totalPrice: number;
  totalSize: number;
  reviewCount: number;
};

type PropertyTypeSummary = {
  type: string;
  count: number;
  totalPrice: number;
};

function getStatusLabel(status?: string) {
  if (status === "flagged") return "Flagged";
  if (status === "needs-review") return "Needs review";
  return "Standard";
}

function getStatusClass(status?: string) {
  if (status === "flagged") return "market-status danger";
  if (status === "needs-review") return "market-status warning";
  return "market-status success";
}

function getAverage(total: number, count: number) {
  if (count === 0) return 0;
  return Math.round(total / count);
}

export default function InsightsPage() {
  const totalListings = sampleListings.length;

  const averagePrice = getAverage(
    sampleListings.reduce(
      (sum, listing) => sum + listing.listedPriceUsd,
      0
    ),
    totalListings
  );

  const averageSize = getAverage(
    sampleListings.reduce((sum, listing) => sum + listing.sizeSqm, 0),
    totalListings
  );

  const reviewListings = sampleListings.filter(
    (listing) => listing.status === "needs-review"
  ).length;

  const flaggedListings = sampleListings.filter(
    (listing) => listing.status === "flagged"
  ).length;

  const highestListing = [...sampleListings].sort(
    (a, b) => b.listedPriceUsd - a.listedPriceUsd
  )[0];

  const lowestListing = [...sampleListings].sort(
    (a, b) => a.listedPriceUsd - b.listedPriceUsd
  )[0];

  const locationSummary = Object.values(
    sampleListings.reduce((acc, listing) => {
      if (!acc[listing.location]) {
        acc[listing.location] = {
          location: listing.location,
          count: 0,
          totalPrice: 0,
          totalSize: 0,
          reviewCount: 0,
        };
      }

      acc[listing.location].count += 1;
      acc[listing.location].totalPrice += listing.listedPriceUsd;
      acc[listing.location].totalSize += listing.sizeSqm;

      if (
        listing.status === "needs-review" ||
        listing.status === "flagged"
      ) {
        acc[listing.location].reviewCount += 1;
      }

      return acc;
    }, {} as Record<string, LocationSummary>)
  )
    .map((item) => ({
      ...item,
      averagePrice: getAverage(item.totalPrice, item.count),
      averageSize: getAverage(item.totalSize, item.count),
    }))
    .sort((a, b) => b.averagePrice - a.averagePrice);

  const propertyTypes = Object.values(
    sampleListings.reduce((acc, listing) => {
      if (!acc[listing.propertyType]) {
        acc[listing.propertyType] = {
          type: listing.propertyType,
          count: 0,
          totalPrice: 0,
        };
      }

      acc[listing.propertyType].count += 1;
      acc[listing.propertyType].totalPrice += listing.listedPriceUsd;

      return acc;
    }, {} as Record<string, PropertyTypeSummary>)
  )
    .map((item) => ({
      ...item,
      averagePrice: getAverage(item.totalPrice, item.count),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <main className="market-page">
      <section className="market-hero">
        <div>
          <p className="market-label">Market view</p>
          <h1>Read the Addis property market at a glance.</h1>
          <p>
            A simple overview of available listings, price movement, review
            signals, and location patterns from the Noble Addis records.
          </p>
        </div>

        <div className="market-hero-panel">
          <TrendingUp size={26} />
          <span>Current sample set</span>
          <strong>{totalListings} listings reviewed</strong>
          <p>
            Use this page to compare areas before checking a specific property
            listing.
          </p>
        </div>
      </section>

      <section className="market-stat-strip">
        <div className="market-stat-card">
          <Home size={22} />
          <span>Total listings</span>
          <strong>{totalListings}</strong>
        </div>

        <div className="market-stat-card highlight">
          <BarChart3 size={22} />
          <span>Average listed price</span>
          <strong>{formatMoney(averagePrice)}</strong>
        </div>

        <div className="market-stat-card">
          <Building2 size={22} />
          <span>Average size</span>
          <strong>{averageSize} sqm</strong>
        </div>

        <div className="market-stat-card warning">
          <AlertTriangle size={22} />
          <span>Needs attention</span>
          <strong>{reviewListings + flaggedListings}</strong>
        </div>
      </section>

      <section className="market-split-layout">
        <div className="market-card large">
          <div className="market-card-header">
            <div>
              <p className="section-kicker">Location comparison</p>
              <h2>Average price by area</h2>
            </div>

            <span>{locationSummary.length} areas</span>
          </div>

          <div className="market-location-list">
            {locationSummary.map((item) => (
              <div key={item.location} className="market-location-row">
                <div className="market-location-name">
                  <MapPin size={16} />

                  <div>
                    <strong>{item.location}</strong>
                    <span>
                      {item.count} listing{item.count === 1 ? "" : "s"} ·{" "}
                      {item.averageSize} sqm avg.
                    </span>
                  </div>
                </div>

                <div className="market-location-price">
                  <strong>{formatMoney(item.averagePrice)}</strong>
                  <span>
                    {item.reviewCount > 0
                      ? `${item.reviewCount} needs review`
                      : "No flags"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="market-side-stack">
          <div className="market-card dark">
            <ShieldCheck size={24} />
            <h2>Market reading</h2>
            <p>
              Areas with unusually low prices or limited listing details should
              be checked carefully before negotiation or payment.
            </p>
          </div>

          <div className="market-card">
            <div className="market-card-header">
              <h2>Price range</h2>
            </div>

            <div className="market-range-list">
              <div>
                <span>Highest listing</span>
                <strong>
                  {highestListing
                    ? formatMoney(highestListing.listedPriceUsd)
                    : "Not available"}
                </strong>
                <p>{highestListing?.location || "No listing"}</p>
              </div>

              <div>
                <span>Lowest listing</span>
                <strong>
                  {lowestListing
                    ? formatMoney(lowestListing.listedPriceUsd)
                    : "Not available"}
                </strong>
                <p>{lowestListing?.location || "No listing"}</p>
              </div>
            </div>
          </div>

          <div className="market-card">
            <div className="market-card-header">
              <h2>Property types</h2>
            </div>

            <div className="market-type-list">
              {propertyTypes.map((item) => (
                <div key={item.type}>
                  <span>{item.type}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="market-card market-table-card">
        <div className="market-card-header">
          <div>
            <p className="section-kicker">Listing records</p>
            <h2>Recent market records</h2>
          </div>

          <span>Sample dataset</span>
        </div>

        <div className="market-table-wrap">
          <table className="market-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Type</th>
                <th>Price</th>
                <th>Size</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {sampleListings.slice(0, 10).map((listing) => (
                <tr key={listing.id}>
                  <td>
                    <MapPin size={15} />
                    {listing.location}
                  </td>

                  <td>{listing.propertyType}</td>
                  <td>{formatMoney(listing.listedPriceUsd)}</td>
                  <td>{listing.sizeSqm} sqm</td>

                  <td>
                    <span className={getStatusClass(listing.status)}>
                      {getStatusLabel(listing.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}