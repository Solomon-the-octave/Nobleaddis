"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Archive,
  CheckCircle,
  FileText,
  LifeBuoy,
  Search,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { formatMoney } from "../../lib/prediction";

type SavedReport = {
  id: number;
  userId: number | null;
  listingId: number | null;
  location: string | null;
  propertyType: string | null;
  listedPriceUsd: number | null;
  sizeSqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  amenitiesCount: number | null;
  completenessScore: number | null;
  description: string | null;
  negotiationLow: number | null;
  negotiationHigh: number | null;
  estimatedValue: number | null;
  priceSignal: string | null;
  priceGapPercent: number | null;
  riskLevel: string | null;
  opportunitySignal: string | null;
  opportunityNote: string | null;
  explanation: string | null;
  pricePerSqm: number | null;
  nearbyAveragePrice: number | null;
  nearbyAveragePricePerSqm: number | null;
  modelSource: string | null;
  createdAt: string;
};

const filterOptions = [
  {
    label: "All history",
    value: "all",
  },
  {
    label: "Looks reasonable",
    value: "normal",
  },
  {
    label: "Needs review",
    value: "medium-risk",
  },
  {
    label: "High caution",
    value: "suspicious",
  },
];

function safeNumber(value: number | null | undefined, fallback = 0) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return numberValue;
}

function safeText(value: string | null | undefined, fallback = "Not provided") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

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

function normalizeRiskLevel(riskLevel?: string | null) {
  const risk = String(riskLevel ?? "").toLowerCase().trim();

  if (
    risk.includes("suspicious") ||
    risk.includes("high") ||
    risk.includes("high-caution")
  ) {
    return "suspicious";
  }

  if (
    risk.includes("medium") ||
    risk.includes("review") ||
    risk.includes("needs-review")
  ) {
    return "medium-risk";
  }

  return "normal";
}

function getReviewLabel(riskLevel?: string | null) {
  const risk = normalizeRiskLevel(riskLevel);

  if (risk === "suspicious") return "High caution";
  if (risk === "medium-risk") return "Needs review";
  return "Looks reasonable";
}

function getReviewClass(riskLevel?: string | null) {
  const risk = normalizeRiskLevel(riskLevel);

  if (risk === "suspicious") return "library-status danger";
  if (risk === "medium-risk") return "library-status warning";
  return "library-status success";
}

function cleanSignal(value?: string | null) {
  const text = safeText(value, "Within range");

  return text
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPercent(value?: number | null) {
  const numberValue = safeNumber(value, 0);
  return `${numberValue.toFixed(1)}%`;
}

function getReportTitle(report: SavedReport) {
  const propertyType = safeText(report.propertyType, "Property");
  const location = safeText(report.location, "Addis Ababa").split(",")[0];
  const bedrooms = safeNumber(report.bedrooms);

  if (bedrooms > 0) {
    return `${bedrooms}-bedroom ${propertyType.toLowerCase()} in ${location}`;
  }

  return `${propertyType} in ${location}`;
}

function getSafeAction(action?: string | null) {
  const text = safeText(action, "Review details");
  return text;
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
          throw new Error(data.message || "Could not load saved history.");
        }

        setReports(data.reports || []);
      } catch (error) {
        console.error("Reports load error:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not load saved history."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchText = `${getReportTitle(report)} ${safeText(
        report.location,
        ""
      )} ${safeText(report.propertyType, "")} ${safeText(
        report.riskLevel,
        ""
      )} ${safeText(report.priceSignal, "")}`.toLowerCase();

      const matchesSearch = searchText.includes(searchTerm.toLowerCase());

      const normalizedRisk = normalizeRiskLevel(report.riskLevel);

      const matchesFilter =
        activeFilter === "all" || normalizedRisk === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [reports, searchTerm, activeFilter]);

  const normalCount = reports.filter(
    (report) => normalizeRiskLevel(report.riskLevel) === "normal"
  ).length;

  const reviewCount = reports.filter(
    (report) => normalizeRiskLevel(report.riskLevel) === "medium-risk"
  ).length;

  const suspiciousCount = reports.filter(
    (report) => normalizeRiskLevel(report.riskLevel) === "suspicious"
  ).length;

  const selectedFilterLabel =
    filterOptions.find((option) => option.value === activeFilter)?.label ||
    "All history";

  function clearFilters() {
    setSearchTerm("");
    setActiveFilter("all");
  }

  return (
    <main className="library-page">
      <section className="library-topbar">
        <div>
          <p className="library-label">History</p>
          <h1>Your property history.</h1>
          <p>
            Review saved property checks, compare earlier results, and follow up
            on listings that need closer attention.
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
          <div className="library-search-card premium-history-filter">
            <div className="history-filter-heading">
              <div>
                <p>Filter history</p>
                <h2>Find a saved check</h2>
              </div>

              <SlidersHorizontal size={22} />
            </div>

            <label className="library-search-box">
              <Search size={18} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by location, type, or signal..."
              />
            </label>

            <label className="history-select-label">
              <span>Result type</span>

              <select
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value)}
                className="history-filter-select"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="history-filter-summary">
              <span>Showing</span>
              <strong>
                {filteredReports.length} of {reports.length}
              </strong>
              <p>{selectedFilterLabel}</p>
            </div>

            {(searchTerm || activeFilter !== "all") && (
              <button
                type="button"
                className="history-clear-button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="library-note-card">
            <FileText size={22} />
            <h2>Saved to your account</h2>
            <p>
              Each property check is saved so you can compare listings and
              return to important results later.
            </p>
          </div>

          <div className="library-help-card">
            <h2>Need a second check?</h2>
            <p>
              Ask for support if a saved result looks unclear or needs more
              review before moving forward.
            </p>

            <Link href="/help">
              <LifeBuoy size={16} />
              Go to support
            </Link>
          </div>
        </aside>

        <section className="library-main">
          {isLoading ? (
            <div className="library-empty-state">
              <FileText size={32} />
              <h2>Loading history</h2>
              <p>Checking the Noble Addis database for saved property checks.</p>
            </div>
          ) : errorMessage ? (
            <div className="library-empty-state">
              <AlertTriangle size={32} />
              <h2>Could not load history</h2>
              <p>{errorMessage}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="library-empty-state">
              <FileText size={32} />
              <h2>No saved history yet</h2>
              <p>
                Run a property check first. Your saved results will appear here.
              </p>

              <Link href="/evaluate" className="library-primary-action">
                Review a listing
              </Link>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="library-empty-state">
              <Search size={32} />
              <h2>No matching history</h2>
              <p>Try another search term or choose a different filter.</p>

              <button
                type="button"
                className="library-empty-button"
                onClick={clearFilters}
              >
                Reset filters
              </button>
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
                          {safeText(report.location, "Addis Ababa")} ·{" "}
                          {safeText(report.propertyType, "Property")} ·{" "}
                          {safeNumber(report.sizeSqm)} sqm
                        </p>
                      </div>

                      <div className={getReviewClass(report.riskLevel)}>
                        {getReviewLabel(report.riskLevel)}
                      </div>
                    </div>

                    <div className="library-report-metrics">
                      <div>
                        <span>Listed price</span>
                        <strong>
                          {formatMoney(safeNumber(report.listedPriceUsd))}
                        </strong>
                      </div>

                      <div>
                        <span>Estimated value</span>
                        <strong>
                          {formatMoney(safeNumber(report.estimatedValue))}
                        </strong>
                      </div>

                      <div>
                        <span>Negotiation range</span>
                        <strong>
                          {formatMoney(safeNumber(report.negotiationLow))} -{" "}
                          {formatMoney(safeNumber(report.negotiationHigh))}
                        </strong>
                      </div>

                      <div>
                        <span>Next action</span>
                        <strong>{getSafeAction(report.opportunitySignal)}</strong>
                      </div>
                    </div>

                    <div className="library-report-footer">
                      <p>
                        Price signal:{" "}
                        <strong>{cleanSignal(report.priceSignal)}</strong> ·
                        Difference from estimate:{" "}
                        <strong>{formatPercent(report.priceGapPercent)}</strong>
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