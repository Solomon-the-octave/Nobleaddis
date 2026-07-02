import {
  AlertTriangle,
  ClipboardList,
  FileText,
  HelpCircle,
  Home,
  LifeBuoy,
  LogOut,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { formatMoney } from "../../lib/prediction";

export const dynamic = "force-dynamic";

function cleanText(value?: string | null) {
  if (!value) return "Not provided";

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRiskLabel(riskLevel?: string | null) {
  if (!riskLevel) return "Standard";
  if (riskLevel === "suspicious") return "High review";
  if (riskLevel === "medium-risk") return "Needs review";
  return "Standard";
}

function formatDate(value?: Date | string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

async function safeCount(query: Promise<number>) {
  try {
    return await query;
  } catch {
    return 0;
  }
}

async function getHelpRequestsSafely() {
  try {
    const requests = await prisma.helpRequest.findMany({
      take: 6,
    });

    return requests as any[];
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const admin = await requireAdmin();

  const usersCount = await safeCount(prisma.user.count());
  const listingsCount = await safeCount(prisma.propertyListing.count());
  const reportsCount = await safeCount(prisma.evaluationReport.count());
  const helpRequestsCount = await safeCount(prisma.helpRequest.count());

  const listings = (await prisma.propertyListing.findMany({
    take: 12,
  })) as any[];

  const flaggedListings = listings.filter(
    (listing) =>
      listing.riskLabel === "suspicious" ||
      listing.riskLabel === "medium-risk" ||
      listing.status === "flagged" ||
      listing.status === "needs-review"
  );

  const flaggedChecks = await prisma.evaluationReport.findMany({
    where: {
      OR: [
        {
          riskLevel: "suspicious",
        },
        {
          riskLevel: "medium-risk",
        },
        {
          priceSignal: "overpriced",
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
    select: {
      id: true,
      location: true,
      propertyType: true,
      listedPriceUsd: true,
      riskLevel: true,
      priceSignal: true,
      createdAt: true,
    },
  });

  const recentHelpRequests = await getHelpRequestsSafely();

  return (
    <main className="clean-page">
      <section className="admin-hero-panel">
  <div className="admin-hero-copy">
    <p className="small-label">Admin dashboard</p>

    <h1>Manage Noble Addis</h1>

    <p>
      Review property checks, monitor suspicious listing activity, manage
      platform listings, and respond to user support requests.
    </p>
  </div>

  <div className="admin-hero-actions">
    <Link href="/" className="admin-hero-button">
      <Home size={17} />
      Public site
    </Link>

    <Link href="/help" className="admin-hero-button">
      <LifeBuoy size={17} />
      Help page
    </Link>

    <form action="/api/auth/logout" method="post">
      <button className="admin-hero-button admin-logout-button" type="submit">
        <LogOut size={17} />
        Sign out
      </button>
    </form>
  </div>
</section>

      <section className="admin-summary-grid">
        <div className="admin-summary-card">
          <Users size={22} />
          <span>Total users</span>
          <strong>{usersCount}</strong>
        </div>

        <div className="admin-summary-card">
          <ClipboardList size={22} />
          <span>Total listings</span>
          <strong>{listingsCount}</strong>
        </div>

        <div className="admin-summary-card">
          <FileText size={22} />
          <span>Saved checks</span>
          <strong>{reportsCount}</strong>
        </div>

        <div className="admin-summary-card">
          <HelpCircle size={22} />
          <span>Help requests</span>
          <strong>{helpRequestsCount}</strong>
        </div>
      </section>

      <section className="admin-table-card admin-extra-section">
        <div className="admin-table-header">
          <div>
            <p className="section-kicker">Listing management</p>
            <h2>Add a new listing</h2>
          </div>
          <PlusCircle size={24} />
        </div>

        <form
          action="/api/admin/listings/create"
          method="post"
          className="admin-create-form"
        >
          <label>
            Listing title
            <input
              name="title"
              placeholder="Example: 2-bedroom apartment in Bole"
              required
            />
          </label>

          <label>
            Location
            <input name="location" placeholder="Bole" required />
          </label>

          <label>
            Property type
            <select name="propertyType" defaultValue="Apartment">
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Villa</option>
              <option>Commercial</option>
              <option>Warehouse</option>
            </select>
          </label>

          <label>
            Listed price
            <input
              name="listedPriceUsd"
              type="number"
              placeholder="1850000"
              required
            />
          </label>

          <label>
            Size in sqm
            <input name="sizeSqm" type="number" placeholder="95" required />
          </label>

          <label>
            Bedrooms
            <input name="bedrooms" type="number" placeholder="2" />
          </label>

          <label>
            Bathrooms
            <input name="bathrooms" type="number" placeholder="2" />
          </label>

          <label className="admin-full-input">
            Description
            <textarea
              name="description"
              placeholder="Brief property description..."
            />
          </label>

          <button type="submit" className="clean-primary-button">
            <PlusCircle size={18} />
            Add listing
          </button>
        </form>
      </section>

      <section className="admin-table-card admin-extra-section">
        <div className="admin-table-header">
          <div>
            <p className="section-kicker">Verification queue</p>
            <h2>Flagged listings to review</h2>
          </div>
          <AlertTriangle size={24} />
        </div>

        {flaggedListings.length === 0 ? (
          <div className="empty-state">
            No flagged listings are currently in the listing database.
          </div>
        ) : (
          <div className="admin-table">
            <div className="admin-table-row admin-table-head">
              <span>Listing</span>
              <span>Location</span>
              <span>Risk</span>
              <span>Price</span>
              <span>Action</span>
            </div>

            {flaggedListings.map((listing) => (
              <div className="admin-table-row" key={listing.id}>
                <span>{listing.title || listing.propertyType}</span>
                <span>{listing.location || listing.area}</span>
                <span>{getRiskLabel(listing.riskLabel)}</span>
                <span>{formatMoney(Number(listing.listedPriceUsd || 0))}</span>
                <span>
                  <form action="/api/admin/listings/delete" method="post">
                    <input type="hidden" name="id" value={String(listing.id)} />
                    <button className="admin-danger-button" type="submit">
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </form>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-table-card admin-extra-section">
        <div className="admin-table-header">
          <div>
            <p className="section-kicker">Buyer activity</p>
            <h2>Flagged property checks</h2>
          </div>
        </div>

        {flaggedChecks.length === 0 ? (
          <div className="empty-state">
            No suspicious or overpriced property checks yet.
          </div>
        ) : (
          <div className="admin-table">
            <div className="admin-table-row admin-table-head">
              <span>Property</span>
              <span>Location</span>
              <span>Risk</span>
              <span>Signal</span>
              <span>Price</span>
            </div>

            {flaggedChecks.map((report) => (
              <div className="admin-table-row" key={report.id}>
                <span>{report.propertyType}</span>
                <span>{report.location}</span>
                <span>{getRiskLabel(report.riskLevel)}</span>
                <span>{cleanText(report.priceSignal || "within range")}</span>
                <span>{formatMoney(Number(report.listedPriceUsd))}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-table-card admin-extra-section">
        <div className="admin-table-header">
          <div>
            <p className="section-kicker">All listings</p>
            <h2>Current listing records</h2>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="empty-state">No listings have been added yet.</div>
        ) : (
          <div className="admin-table">
            <div className="admin-table-row admin-table-head">
              <span>Listing</span>
              <span>Location</span>
              <span>Type</span>
              <span>Price</span>
              <span>Action</span>
            </div>

            {listings.map((listing) => (
              <div className="admin-table-row" key={listing.id}>
                <span>{listing.title || "Untitled listing"}</span>
                <span>{listing.location || listing.area}</span>
                <span>{listing.propertyType || "Property"}</span>
                <span>{formatMoney(Number(listing.listedPriceUsd || 0))}</span>
                <span>
                  <form action="/api/admin/listings/delete" method="post">
                    <input type="hidden" name="id" value={String(listing.id)} />
                    <button className="admin-danger-button" type="submit">
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </form>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-table-card admin-extra-section">
        <div className="admin-table-header">
          <div>
            <p className="section-kicker">Support</p>
            <h2>User questions and support requests</h2>
          </div>
        </div>

        {recentHelpRequests.length === 0 ? (
          <div className="empty-state">No support requests yet.</div>
        ) : (
          <div className="admin-table">
            <div className="admin-table-row admin-table-head">
              <span>Requester</span>
              <span>Email</span>
              <span>Type</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {recentHelpRequests.map((request) => (
              <div className="admin-table-row" key={request.id}>
                <span>{request.name || "Not provided"}</span>
                <span>{request.email || "Not provided"}</span>
                <span>{cleanText(String(request.type || "support"))}</span>
                <span>{cleanText(String(request.status || "open"))}</span>
                <span>
                  {formatDate(
                    request.createdAt ||
                      request.submittedAt ||
                      request.updatedAt ||
                      null
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}