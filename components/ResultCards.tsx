import { EvaluationResult, formatMoney } from "../lib/prediction";

type Props = {
  result: EvaluationResult;
};

function getReviewLabel(riskLevel?: string) {
  if (riskLevel === "suspicious") return "High review required";
  if (riskLevel === "medium-risk") return "Needs review";
  return "Standard review";
}

function getReviewClass(riskLevel?: string) {
  if (riskLevel === "suspicious") return "report-status danger";
  if (riskLevel === "medium-risk") return "report-status warning";
  return "report-status success";
}

function getPriceSignal(signal?: string) {
  if (signal === "overpriced") return "Above comparison";
  if (signal === "underpriced") return "Below comparison";
  if (signal === "within-range") return "Within range";
  return "Needs review";
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Not available";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
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
      : [
          "Review the listing details before negotiation.",
          "Compare the price with similar nearby listings.",
          "Confirm ownership documents and exact location.",
        ];

  return (
    <section className="property-report-panel">
      <div className="report-header">
        <div>
          <p className="section-kicker">Review result</p>
          <h2>Buyer assessment</h2>
          <span>
            A practical summary of price, listing quality, and recommended
            next steps.
          </span>
        </div>

        <div className={getReviewClass(result.riskLevel)}>
          {getReviewLabel(result.riskLevel)}
        </div>
      </div>

      <div className="report-metrics-grid">
        <div className="report-metric-card primary">
          <small>Negotiation range</small>
          <strong>
            {formatMoney(result.negotiationLow)} -{" "}
            {formatMoney(result.negotiationHigh)}
          </strong>
          <p>Suggested range to guide early buyer negotiation.</p>
        </div>

        <div className="report-metric-card">
          <small>Reference value</small>
          <strong>{formatMoney(result.estimatedValue)}</strong>
          <p>Estimated value based on available listing fields.</p>
        </div>

        <div className="report-metric-card">
          <small>Price signal</small>
          <strong>{getPriceSignal(result.priceSignal)}</strong>
          <p>
            Difference from reference value:{" "}
            <b>{formatPercent(result.priceGapPercent)}</b>
          </p>
        </div>
      </div>

      <div className="report-detail-grid">
        <div className="report-card">
          <div className="report-card-title">
            <h3>Market comparison</h3>
            <span>Price context</span>
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
            <h3>Listing review</h3>
            <span>{getReviewLabel(result.riskLevel)}</span>
          </div>

          <div className="risk-score-row">
            <div>
              <small>Review score</small>
              <strong>
                {typeof result.riskScore === "number"
                  ? result.riskScore
                  : "Review"}
              </strong>
            </div>

            <div>
              <small>Action</small>
              <strong>
                {safeText(result.opportunitySignal, "Manual review")}
              </strong>
            </div>
          </div>

          <ul className="risk-factor-list">
            {riskFactors.slice(0, 4).map((factor, index) => (
              <li key={index}>{factor}</li>
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
              "Review the listing source, confirm the location, and request ownership documents before moving forward."
            )}
          </p>
        </div>

        <div>
          <h3>Assessment note</h3>
          <p>
            {safeText(
              result.explanation,
              "This assessment is based on available listing fields and should be treated as an early review."
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