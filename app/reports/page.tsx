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

function getRiskLabel(riskLevel: string) {
  if (riskLevel === "suspicious") return "Suspicious";
  if (riskLevel === "medium-risk") return "Needs review";
  return "Standard review";
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
      <section className="clean-page-header minimal-header">
  <p className="small-label">Reports</p>
  <h1>Saved property reviews</h1>
</section>

      {reports.length === 0 ? (
        <section className="empty-state-card">
          <FileText size={24} />
          <h2>No reports saved yet</h2>
          <p>Run a listing review first, then return to this page.</p>

          <Link href="/evaluate" className="clean-primary-button">
            Evaluate a listing
          </Link>
        </section>
      ) : (
        <section className="reports-grid-clean">
          {reports.map((report) => (
            <article className="report-list-card" key={report.id}>
              <div>
                <span className="report-list-date">
                  {formatDate(report.createdAt)}
                </span>

                <h2>{report.title || `${report.propertyType} in ${report.location}`}</h2>

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
                  <span>Negotiation range</span>
                  <strong>
                    {formatMoney(report.negotiationLow)} -{" "}
                    {formatMoney(report.negotiationHigh)}
                  </strong>
                </div>

                <div>
                  <span>Review result</span>
                  <strong>{getRiskLabel(report.riskLevel)}</strong>
                </div>

                <div>
                  <span>Action</span>
                  <strong>{report.opportunitySignal}</strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}