"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { formatMoney } from "../../lib/prediction";

type SavedReport = {
  id: string;
  title: string;
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  negotiationLow: number;
  negotiationHigh: number;
  estimatedValue: number;
  riskLevel: string;
  opportunitySignal: string;
  createdAt: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getReviewLabel(riskLevel: string) {
  if (riskLevel === "suspicious") return "High review required";
  if (riskLevel === "medium-risk") return "Needs review";
  return "Standard review";
}

function getReviewClass(riskLevel: string) {
  if (riskLevel === "suspicious") return "report-status danger";
  if (riskLevel === "medium-risk") return "report-status warning";
  return "report-status success";
}

function getReportTitle(report: SavedReport) {
  if (report.title && report.title.trim().length > 0) {
    return report.title;
  }

  return `${report.propertyType} in ${report.location}`;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const savedReports = localStorage.getItem("noble_addis_reports");

    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  return (
    <main className="clean-page">
      <section className="clean-page-header no-line-header">
        <p className="small-label">Reports</p>
        <h1>Saved property assessments</h1>
        <p>
          Keep reviewed listings in one place for comparison and follow-up.
        </p>
      </section>

      {reports.length === 0 ? (
        <section className="empty-state-card">
          <FileText size={24} />

          <h2>No saved assessments yet</h2>

          <p>
            Generate a listing review first. Saved assessments will appear here.
          </p>

          <Link href="/evaluate" className="clean-primary-button">
            Review a listing
          </Link>
        </section>
      ) : (
        <section className="reports-grid-clean">
          {reports.map((report) => (
            <article className="report-list-card" key={report.id}>
              <div className="report-list-main">
                <div className="report-list-top">
                  <span className="report-list-date">
                    {formatDate(report.createdAt)}
                  </span>

                  <span className={getReviewClass(report.riskLevel)}>
                    {getReviewLabel(report.riskLevel)}
                  </span>
                </div>

                <h2>{getReportTitle(report)}</h2>

                <p>
                  {report.location} · {report.propertyType}
                </p>
              </div>

              <div className="report-list-metrics">
                <div>
                  <span>Listed price</span>
                  <strong>{formatMoney(report.listedPriceUsd)}</strong>
                </div>

                <div>
                  <span>Reference value</span>
                  <strong>{formatMoney(report.estimatedValue)}</strong>
                </div>

                <div>
                  <span>Negotiation range</span>
                  <strong>
                    {formatMoney(report.negotiationLow)} -{" "}
                    {formatMoney(report.negotiationHigh)}
                  </strong>
                </div>

                <div>
                  <span>Next action</span>
                  <strong>{report.opportunitySignal || "Review details"}</strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}