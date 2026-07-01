import { formatMoney } from "../lib/prediction";
import type { EvaluationResult } from "../lib/prediction";

type Props = {
  result: EvaluationResult;
};

const fallbackRiskFactors = [
  "Compare the price with similar listings in the same area.",
  "Confirm the exact property location before visiting.",
  "Ask for ownership documents before making any payment.",
  "Check the agent or seller details before negotiation.",
];

function getReviewLabel(riskLevel?: string) {
  if (riskLevel === "suspicious") return "High caution";
  if (riskLevel === "medium-risk") return "Needs closer review";
  return "Looks reasonable";
}

function getReviewClass(riskLevel?: string) {
  if (riskLevel === "suspicious") return "report-status danger";
  if (riskLevel === "medium-risk") return "report-status warning";
  return "report-status success";
}

function getPriceSignal(signal?: string) {
  if (signal === "overpriced") return "Above expected range";
  if (signal === "underpriced") return "Below expected range";
  if (signal === "within-range") return "Within expected range";
  return "Needs review";
}

function getActionText(riskLevel?: string) {
  if (riskLevel === "suspicious") return "Verify first";
  if (riskLevel === "medium-risk") return "Review carefully";
  return "Safe to continue";
}

function formatPriceGap(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Not enough data";
  }

  if (Math.abs(value) > 200) {
    return "Large difference";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Not scored";
  }

  return `${value}/100`;
}

function safeText(value?: string | null, fallback = "Review required") {
  if (!value || value.trim().length === 0) {
    return fallback;
  }

  return value;
}

export default function ResultCards({ result }: Props) {
  const riskFactors =
    result.riskFactors && result.riskFactors.length > 0
      ? result.riskFactors
      : fallbackRiskFactors;

  return (
    <section className="property-report-panel">
      <div className="report-header">
        <div>
          <p className="section-kicker">Buyer review</p>
          <h2>Listing assessment</h2>
          <span>
            A practical review of the asking price, listing quality, and next
            steps before contacting the seller or agent.
          </span>
        </div>

        <div className={getReviewClass(result.riskLevel)}>
          {getReviewLabel(result.riskLevel)}
        </div>
      </div>

      <div className="report-metrics-grid">
        <div className="report-metric-card primary">
          <small>Suggested negotiation range</small>
          <strong>
            {formatMoney(result.negotiationLow)} -{" "}
            {formatMoney(result.negotiationHigh)}
          </strong>
          <p>
            A starting range the buyer can use before discussing the final
            price.
          </p>
        </div>

        <div className="report-metric-card">
          <small>Estimated fair value</small>
          <strong>{formatMoney(result.estimatedValue)}</strong>
          <p>
            Estimated from the listing details provided: area, size, rooms,
            amenities, and listing completeness.
          </p>
        </div>

        <div className="report-metric-card">
          <small>Price signal</small>
          <strong>{getPriceSignal(result.priceSignal)}</strong>
          <p>
            Difference from estimated value:{" "}
            <b>{formatPriceGap(result.priceGapPercent)}</b>
          </p>
        </div>
      </div>

      <div className="report-detail-grid">
        <div className="report-card">
          <div className="report-card-title">
            <h3>Price context</h3>
            <span>Market check</span>
          </div>

          <div className="comparison-list">
            <div>
              <small>Listing price per sqm</small>
              <strong>{formatMoney(result.pricePerSqm)}</strong>
            </div>

            <div>
              <small>Nearby average price</small>
              <strong>{formatMoney(result.nearbyAveragePrice)}</strong>
            </div>

            <div>
              <small>Nearby average per sqm</small>
              <strong>{formatMoney(result.nearbyAveragePricePerSqm)}</strong>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-title">
            <h3>Listing checks</h3>
            <span>{getReviewLabel(result.riskLevel)}</span>
          </div>

          <div className="risk-score-row">
            <div>
              <small>Review score</small>
              <strong>{formatScore(result.riskScore)}</strong>
            </div>

            <div>
              <small>Suggested action</small>
              <strong>{getActionText(result.riskLevel)}</strong>
            </div>
          </div>

          <ul className="risk-factor-list">
            {riskFactors.slice(0, 4).map((factor, index) => (
              <li key={`${factor}-${index}`}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="next-step-card">
        <div>
          <h3>Recommended next step</h3>
          <p>
            {safeText(
              result.opportunityNote,
              "Contact the seller only after confirming the location, ownership documents, and viewing arrangements."
            )}
          </p>
        </div>

        <div>
          <h3>Review note</h3>
          <p>
            {safeText(
              result.explanation,
              "This review uses the available listing details to give an early price and risk signal. It should support, not replace, buyer verification."
            )}
          </p>
        </div>
      </div>

      {result.modelSource && (
        <p className="model-source-note">Source: {result.modelSource}</p>
      )}
    </section>
  );
}