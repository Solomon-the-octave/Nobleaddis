import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileText,
} from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { formatMoney } from "../../../lib/prediction";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanText(value?: string | null) {
  if (!value) return "Not provided";

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: Date | string | null) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
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

function getRiskClass(riskLevel?: string | null) {
  const risk = String(riskLevel ?? "").toLowerCase();

  if (risk.includes("suspicious") || risk.includes("high")) {
    return "admin-pill-danger";
  }

  if (risk.includes("medium") || risk.includes("review")) {
    return "admin-pill-warning";
  }

  return "admin-pill-success";
}

export default async function AdminChecksPage() {
  await requireAdmin();

  const flaggedChecks = await prisma.evaluationReport.findMany({
    where: {
      OR: [
        { riskLevel: "suspicious" },
        { riskLevel: "medium-risk" },
        { priceSignal: "overpriced" },
        { priceSignal: "underpriced" },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  const recentChecks = await prisma.evaluationReport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 15,
  });

  return (
    <main className="premium-admin-page">
      <section className="premium-admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-kicker">Verification queue</p>
            <h1 className="admin-page-title">Property checks</h1>
            <p className="admin-page-subtitle">
              Review flagged, underpriced, overpriced, and recent property
              checks submitted by users.
            </p>
          </div>
          <AlertTriangle size={30} />
        </div>

        {flaggedChecks.length === 0 ? (
          <div className="admin-empty-box">
            <CheckCircle2 size={26} />
            <p>No flagged property checks yet.</p>
          </div>
        ) : (
          <div className="admin-review-list">
            {flaggedChecks.map((report: any) => (
              <div key={report.id} className="admin-review-item">
                <div>
                  <strong>
                    {report.propertyType || "Property"} in{" "}
                    {report.location || "Addis Ababa"}
                  </strong>
                  <span>
                    {formatDate(report.createdAt)} ·{" "}
                    {formatMoney(Number(report.listedPriceUsd || 0))} listed ·{" "}
                    {cleanText(report.priceSignal)}
                  </span>
                </div>

                <span className={`admin-pill ${getRiskClass(report.riskLevel)}`}>
                  {getRiskLabel(report.riskLevel)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="premium-admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-kicker">Recent checks</p>
            <h2>Latest property reviews</h2>
          </div>
          <BarChart3 size={28} />
        </div>

        {recentChecks.length === 0 ? (
          <div className="admin-empty-box">
            <FileText size={26} />
            <p>No saved checks yet.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="premium-admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Listed price</th>
                  <th>Estimate</th>
                  <th>Signal</th>
                  <th>Risk</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentChecks.map((report: any) => (
                  <tr key={report.id}>
                    <td>
                      <strong>
                        {report.propertyType || "Property"} in{" "}
                        {report.location || "Addis Ababa"}
                      </strong>
                      <span>{report.sizeSqm || 0} sqm</span>
                    </td>
                    <td>{formatMoney(Number(report.listedPriceUsd || 0))}</td>
                    <td>{formatMoney(Number(report.estimatedValue || 0))}</td>
                    <td>{cleanText(report.priceSignal)}</td>
                    <td>
                      <span className={`admin-pill ${getRiskClass(report.riskLevel)}`}>
                        {getRiskLabel(report.riskLevel)}
                      </span>
                    </td>
                    <td>{formatDate(report.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}