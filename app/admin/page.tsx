import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileText,
  HelpCircle,
  ShieldAlert,
  Users,
} from "lucide-react";

import { requireAdmin } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function safeCount(query: Promise<number>) {
  try {
    return await query;
  } catch {
    return 0;
  }
}

function getRiskLabel(riskLevel?: string | null) {
  const risk = String(riskLevel ?? "").toLowerCase();

  if (risk.includes("suspicious") || risk.includes("high")) {
    return "High caution";
  }

  if (risk.includes("medium") || risk.includes("review")) {
    return "Needs review";
  }

  return "Looks reasonable";
}

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();

  const usersCount = await safeCount(prisma.user.count());
  const listingsCount = await safeCount(prisma.propertyListing.count());
  const reportsCount = await safeCount(prisma.evaluationReport.count());
  const helpRequestsCount = await safeCount(prisma.helpRequest.count());

  const recentChecks = await prisma.evaluationReport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
    select: {
      id: true,
      riskLevel: true,
      priceSignal: true,
    },
  });

  const flaggedChecks = recentChecks.filter((check) => {
    const risk = String(check.riskLevel ?? "").toLowerCase();
    const signal = String(check.priceSignal ?? "").toLowerCase();

    return (
      risk.includes("suspicious") ||
      risk.includes("high") ||
      risk.includes("medium") ||
      risk.includes("review") ||
      signal.includes("overpriced") ||
      signal.includes("underpriced")
    );
  });

  const reasonableChecks = recentChecks.filter(
    (check) => getRiskLabel(check.riskLevel) === "Looks reasonable"
  );

  return (
    <main className="premium-admin-page">
      <section className="premium-admin-hero">
        <div>
          <p className="admin-kicker">Admin dashboard</p>
          <h1>Manage Noble Addis</h1>
          <p>
            Monitor users, listings, saved property checks, suspicious listing
            signals, and support requests from one workspace.
          </p>

          <div className="admin-welcome-note">
            Logged in as {admin?.email || "admin user"}
          </div>
        </div>
      </section>

      <section className="admin-metric-grid">
        <article className="admin-metric-card">
          <Users size={25} />
          <span>Total users</span>
          <strong>{usersCount}</strong>
          <p>Registered users on the platform.</p>
        </article>

        <article className="admin-metric-card">
          <Building2 size={25} />
          <span>Total listings</span>
          <strong>{listingsCount}</strong>
          <p>Current property records.</p>
        </article>

        <article className="admin-metric-card">
          <FileText size={25} />
          <span>Saved checks</span>
          <strong>{reportsCount}</strong>
          <p>Property reviews saved by users.</p>
        </article>

        <article className="admin-metric-card admin-metric-warning">
          <ShieldAlert size={25} />
          <span>Flagged checks</span>
          <strong>{flaggedChecks.length}</strong>
          <p>Overpriced, underpriced, or suspicious checks.</p>
        </article>

        <article className="admin-metric-card admin-metric-success">
          <CheckCircle2 size={25} />
          <span>Reasonable checks</span>
          <strong>{reasonableChecks.length}</strong>
          <p>Recent checks that look reasonable.</p>
        </article>

        <article className="admin-metric-card">
          <HelpCircle size={25} />
          <span>Help requests</span>
          <strong>{helpRequestsCount}</strong>
          <p>User questions and support messages.</p>
        </article>
      </section>

      <section className="admin-quick-grid">
        <Link href="/admin/listings" className="admin-quick-card">
          <Building2 size={28} />
          <div>
            <h2>Manage listings</h2>
            <p>Add new property records and remove outdated listings.</p>
          </div>
        </Link>

        <Link href="/admin/checks" className="admin-quick-card">
          <AlertTriangle size={28} />
          <div>
            <h2>Review property checks</h2>
            <p>See flagged, underpriced, overpriced, and recent checks.</p>
          </div>
        </Link>

        <Link href="/admin/support" className="admin-quick-card">
          <HelpCircle size={28} />
          <div>
            <h2>User support</h2>
            <p>Read questions and support requests submitted by users.</p>
          </div>
        </Link>
      </section>
    </main>
  );
}