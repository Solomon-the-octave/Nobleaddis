"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Archive,
  CheckCircle,
  Clock,
  FileText,
  Search,
  ShieldAlert,
} from "lucide-react";
import { formatMoney } from "../../lib/prediction";

type SavedReport = {
  id: number;
  userId: number | null;
  listingId: number | null;
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  amenitiesCount: number;
  completenessScore: number;
  description: string;
  negotiationLow: number;
  negotiationHigh: number;
  estimatedValue: number;
  priceSignal: string;
  priceGapPercent: number;
  riskLevel: string;
  opportunitySignal: string;
  opportunityNote: string;
  explanation: string;
  pricePerSqm: number;
  nearbyAveragePrice: number;
  nearbyAveragePricePerSqm: number;
  modelSource: string | null;
  createdAt: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Saved recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getReviewLabel(riskLevel: string) {
  if (riskLevel === "suspicious") return "High caution";
  if (riskLevel === "medium-risk") return "Needs review";
  return "Looks reasonable";
}

function getReviewClass(riskLevel: string) {
  if (riskLevel === "suspicious") return "library-status danger";
  if (riskLevel === "medium-risk") return "library-status warning";
  return "library-status success";
}

function getReportTitle(report: SavedReport) {
  if (report.bedrooms > 0) {
    return `${report.bedrooms}-bedroom ${report.propertyType.toLowerCase()} in ${report.location.split(",")[0]}`;
  }

  return `${report.propertyType} in ${report.location.split(",")[0]}`;
}

function getSafeAction(action?: string) {
  if (!action || action.trim().length === 0) {
    return "Review details";
  }

  return action;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch("/api/reports", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load saved reports.");
        }

        setReports(data.reports || []);
      } catch (error) {
        console.error("Reports load error:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not load saved reports."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchText = `${getReportTitle(report)} ${report.location} ${
        report.propertyType
      } ${report.riskLevel}`.toLowerCase();

      const matchesSearch = searchText.includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "all" || report.riskLevel === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [reports, searchTerm, activeFilter]);

  const normalCount = reports.filter(
    (report) => report.riskLevel === "normal"
  ).length;

  const reviewCount = reports.filter(
    (report) => report.riskLevel === "medium-risk"
  ).length;

  const suspiciousCount = reports.filter(
    (report) => report.riskLevel === "suspicious"
  ).length;

  return (
    <main className="library-page">
      <section className="library-topbar">
        <div>
          <p className="library-label">Saved reviews</p>
          <h1>Your property review library.</h1>
          <p>
            Saved reports are now loaded from the Noble Addis database, making
            it easier to compare checked listings and follow up later.
          </p>
        </div>

        <div className="library-top-actions">
          <Link href="/evaluate" className="library-primary-action">
            Check new listing
          </Link>
        </div>
      </section>

      <section className="library-summary-strip">
        <div className="library-summary-card dark">
          <Archive size={22} />
          <span>Total saved</span>
          <strong>{reports.length}</strong>
        </div>

        <div className="library-summary-card">
          <CheckCircle size={22} />
          <span>Looks reasonable</span>
          <strong>{normalCount}</strong>
        </div>

        <div className="library-summary-card warning">
          <AlertTriangle size={22} />
          <span>Needs review</span>
          <strong>{reviewCount}</strong>
        </div>

        <div className="library-summary-card danger">
          <ShieldAlert size={22} />
          <span>High caution</span>
          <strong>{suspiciousCount}</strong>
        </div>
      </section>

      <section className="library-layout">
        <aside className="library-sidebar">
          <div className="library-search-card">
            <div className="library-search-box">
              <Search size={17} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search saved reviews..."
              />
            </div>

            <div className="library-filter-list">
              <button
                type="button"
                className={activeFilter === "all" ? "active" : ""}
                onClick={() => setActiveFilter("all")}
              >
                All reviews
              </button>

              <button
                type="button"
                className={activeFilter === "normal" ? "active" : ""}
                onClick={() => setActiveFilter("normal")}
              >
                Looks reasonable
              </button>

              <button
                type="button"
                className={activeFilter === "medium-risk" ? "active" : ""}
                onClick={() => setActiveFilter("medium-risk")}
              >
                Needs review
              </button>

              <button
                type="button"
                className={activeFilter === "suspicious" ? "active" : ""}
                onClick={() => setActiveFilter("suspicious")}
              >
                High caution
              </button>
            </div>
          </div>

          <div className="library-note-card">
            <Clock size={22} />
            <h2>Database saved</h2>
            <p>
              These reports are no longer only stored in the browser. They are
              saved through Prisma and Supabase, which makes the backend more
              complete.
            </p>
          </div>

          <div className="library-help-card">
            <h2>Need a second check?</h2>
            <p>
              Send a support request if a saved review looks unclear or shows a
              high caution result.
            </p>

            <Link href="/help">Go to support</Link>
          </div>
        </aside>

        <section className="library-main">
          {isLoading ? (
            <div className="library-empty-state">
              <FileText size={32} />
              <h2>Loading saved reviews</h2>
              <p>Checking the Noble Addis database for saved reports...</p>
            </div>
          ) : errorMessage ? (
            <div className="library-empty-state">
              <AlertTriangle size={32} />
              <h2>Could not load reports</h2>
              <p>{errorMessage}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="library-empty-state">
              <FileText size={32} />
              <h2>No saved reviews yet</h2>
              <p>
                Generate a property review first. Your saved listing assessments
                will appear here from the database.
              </p>

              <Link href="/evaluate" className="library-primary-action">
                Review a listing
              </Link>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="library-empty-state">
              <Search size={32} />
              <h2>No matching reviews</h2>
              <p>
                Try another search term or change the filter to see more saved
                reports.
              </p>
            </div>
          ) : (
            <div className="library-report-stack">
              {filteredReports.map((report, index) => (
                <article className="library-report-card" key={report.id}>
                  <div className="library-report-marker">
                    <span>{index + 1}</span>
                  </div>

                  <div className="library-report-content">
                    <div className="library-report-header">
                      <div>
                        <span className="library-date">
                          {formatDate(report.createdAt)}
                        </span>

                        <h2>{getReportTitle(report)}</h2>

                        <p>
                          {report.location} · {report.propertyType} ·{" "}
                          {report.sizeSqm} sqm
                        </p>
                      </div>

                      <div className={getReviewClass(report.riskLevel)}>
                        {getReviewLabel(report.riskLevel)}
                      </div>
                    </div>

                    <div className="library-report-metrics">
                      <div>
                        <span>Listed price</span>
                        <strong>{formatMoney(report.listedPriceUsd)}</strong>
                      </div>

                      <div>
                        <span>Estimated value</span>
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
                        <strong>{getSafeAction(report.opportunitySignal)}</strong>
                      </div>
                    </div>

                    <div className="library-report-footer">
                      <p>
                        Price signal: <strong>{report.priceSignal}</strong> ·
                        Difference from estimate:{" "}
                        <strong>{report.priceGapPercent.toFixed(1)}%</strong>
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}