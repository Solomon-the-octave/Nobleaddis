import { EvaluationResult, formatMoney } from "../lib/prediction";

type Props = {
  result: EvaluationResult;
};

function getRiskLabel(riskLevel?: string) {
  if (riskLevel === "suspicious") return "High review required";
  if (riskLevel === "medium-risk") return "Needs review";
  return "Standard review";
}

function getRiskClass(riskLevel?: string) {
  if (riskLevel === "suspicious") return "report-status danger";
  if (riskLevel === "medium-risk") return "report-status warning";
  return "report-status success";
}

function getPriceSignalText(signal?: string) {
  if (signal === "overpriced") return "Above local comparison";
  if (signal === "underpriced") return "Below local comparison";
  if (signal === "within-range") return "Within expected range";
  return "Review required";
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
          "Review listing completeness before negotiation.",
          "Compare the price per sqm with nearby listings.",
          "Confirm ownership documents and exact location.",
        ];

  return (
    <section className="property-report-panel">
      <div className="report-header">
        <div>
          <p className="section-kicker">Listing review</p>
          <h2>Property evaluation summary</h2>
          <span>
            Price comparison, listing risk, and recommended verification steps
            based on the collected listing fields.
          </span>
        </div>

        <div className={getRiskClass(result.riskLevel)}>
          {getRiskLabel(result.riskLevel)}
        </div>
      </div>

      <div className="report-metrics-grid">
        <div className="report-metric-card primary">
          <small>Recommended negotiation range</small>
          <strong>
            {formatMoney(result.negotiationLow)} -{" "}
            {formatMoney(result.negotiationHigh)}
          </strong>
          <p>
            Suggested range for opening negotiation after comparing the listing
            with similar records.
          </p>
        </div>

        <div className="report-metric-card">
          <small>Estimated reference value</small>
          <strong>{formatMoney(result.estimatedValue)}</strong>
          <p>
            Not a final valuation. This is a reference estimate for early
            screening.
          </p>
        </div>

        <div className="report-metric-card">
          <small>Price signal</small>
          <strong>{getPriceSignalText(result.priceSignal)}</strong>
          <p>
            Price gap: <b>{formatPercent(result.priceGapPercent)}</b> compared
            with the estimated reference value.
          </p>
        </div>
      </div>

      <div className="report-detail-grid">
        <div className="report-card">
          <div className="report-card-title">
            <h3>Market comparison</h3>
            <span>Local benchmark</span>
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
            <h3>Risk review</h3>
            <span>{safeText(result.riskLevel, "standard review")}</span>
          </div>

          <div className="risk-score-row">
            <div>
              <small>Risk score</small>
              <strong>
                {typeof result.riskScore === "number"
                  ? result.riskScore
                  : "Review"}
              </strong>
            </div>

            <div>
              <small>Recommended action</small>
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
          <h3>Evaluation note</h3>
          <p>
            {safeText(
              result.explanation,
              "This review is based on available listing fields and should be treated as an early screening result."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}