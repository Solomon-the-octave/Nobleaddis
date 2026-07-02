"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";
import { formatMoney } from "../lib/prediction";

type FormState = {
  location: string;
  propertyType: string;
  listedPriceUsd: string;
  sizeSqm: string;
  bedrooms: string;
  bathrooms: string;
  amenitiesCount: string;
  description: string;
};

type ReviewResult = {
  estimatedValue?: number;
  negotiationLow?: number;
  negotiationHigh?: number;
  priceSignal?: string;
  priceGapPercent?: number;
  riskLevel?: string;
  riskScore?: number;
  pricePerSqm?: number;
  nearbyAveragePrice?: number;
  nearbyAveragePricePerSqm?: number;
  riskFactors?: string[];
  opportunitySignal?: string;
  opportunityNote?: string;
  explanation?: string;
  modelSource?: string;
};

const initialForm: FormState = {
  location: "Bole",
  propertyType: "Apartment",
  listedPriceUsd: "1850000",
  sizeSqm: "95",
  bedrooms: "2",
  bathrooms: "2",
  amenitiesCount: "5",
  description:
    "Two bedroom apartment in Bole with good access, listed amenities, and clear property details.",
};

function cleanSignal(value?: string) {
  if (!value) return "Within expected range";

  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRiskDisplay(riskLevel?: string) {
  if (riskLevel === "suspicious") {
    return {
      label: "Suspicious listing",
      className: "danger",
      icon: ShieldAlert,
      note: "This listing needs strong verification before contacting the seller or making payment.",
    };
  }

  if (riskLevel === "medium-risk") {
    return {
      label: "Needs review",
      className: "warning",
      icon: AlertTriangle,
      note: "This listing may still be valid, but the buyer should verify the price, documents, and seller details.",
    };
  }

  return {
    label: "Looks reasonable",
    className: "success",
    icon: CheckCircle2,
    note: "This listing looks reasonable for an initial review, but the buyer should still confirm the details.",
  };
}

export default function PropertyForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsChecking(true);
    setMessage("");
    setResult(null);

    const listedPrice = Number(form.listedPriceUsd);
    const sizeSqm = Number(form.sizeSqm);

    if (!listedPrice || listedPrice <= 0) {
      setMessage("Please enter a valid listed price.");
      setIsChecking(false);
      return;
    }

    if (!sizeSqm || sizeSqm <= 0) {
      setMessage("Please enter a valid property size.");
      setIsChecking(false);
      return;
    }

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: form.location,
          propertyType: form.propertyType,
          listedPriceUsd: listedPrice,
          sizeSqm,
          bedrooms: Number(form.bedrooms) || 0,
          bathrooms: Number(form.bathrooms) || 0,
          amenitiesCount: Number(form.amenitiesCount) || 0,
          description: form.description,
          descriptionLength: form.description.length,
          completenessScore: form.description.length > 60 ? 0.85 : 0.6,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to review this property.");
        setIsChecking(false);
        return;
      }

      setResult(data);
    } catch {
      setMessage("Unable to review this property. Please try again.");
    } finally {
      setIsChecking(false);
    }
  }

  const riskDisplay = getRiskDisplay(result?.riskLevel);
  const RiskIcon = riskDisplay.icon;

  return (
    <section className="property-review-shell simple-evaluate-shell">
      <div className="property-review-hero simple-evaluate-hero">
        <div>
          <p className="small-label">Property review</p>
          <h2>Check a property price and risk level</h2>
          <p>
            Enter the main listing details to estimate a fair value and identify
            whether the property looks reasonable, needs review, or appears
            suspicious.
          </p>
        </div>

        <div className="property-review-hero-stat">
          <span>Model data</span>
          <strong>85,400 records</strong>
        </div>
      </div>

      <div className="simple-evaluate-grid">
        <form onSubmit={handleSubmit} className="rental-form-panel">
          <div className="form-panel-header">
            <div>
              <p className="section-kicker">Listing details</p>
              <h3>Property information</h3>
              <span>
                Keep the input simple. The review focuses on price prediction
                and suspicious listing signals.
              </span>
            </div>
            <SearchCheck size={28} />
          </div>

          <div className="input-grid">
            <label>
              Location
              <input
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Bole"
              />
            </label>

            <label>
              Property type
              <select
                value={form.propertyType}
                onChange={(event) =>
                  updateField("propertyType", event.target.value)
                }
              >
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
                type="number"
                value={form.listedPriceUsd}
                onChange={(event) =>
                  updateField("listedPriceUsd", event.target.value)
                }
                placeholder="1850000"
              />
            </label>

            <label>
              Size in sqm
              <input
                type="number"
                value={form.sizeSqm}
                onChange={(event) => updateField("sizeSqm", event.target.value)}
                placeholder="95"
              />
            </label>

            <label>
              Bedrooms
              <input
                type="number"
                value={form.bedrooms}
                onChange={(event) => updateField("bedrooms", event.target.value)}
              />
            </label>

            <label>
              Bathrooms
              <input
                type="number"
                value={form.bathrooms}
                onChange={(event) => updateField("bathrooms", event.target.value)}
              />
            </label>

            <label>
              Amenities count
              <input
                type="number"
                value={form.amenitiesCount}
                onChange={(event) =>
                  updateField("amenitiesCount", event.target.value)
                }
              />
            </label>
          </div>

          <label className="full-input">
            Short listing description
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Briefly describe the property..."
            />
          </label>

          <button className="submit-review-button" type="submit">
            {isChecking ? (
              <>
                <Loader2 className="spin-icon" size={18} />
                Checking property...
              </>
            ) : (
              <>
                <SearchCheck size={18} />
                Check property
              </>
            )}
          </button>

          {message && <div className="review-message error">{message}</div>}
        </form>

        <aside className="property-report-panel simple-result-panel">
          {!result ? (
            <div className="simple-empty-result">
              <SearchCheck size={34} />
              <h3>Review result will appear here</h3>
              <p>
                The result will show the estimated property value, price signal,
                and suspicion level.
              </p>
            </div>
          ) : (
            <>
              <div className="report-header">
                <div>
                  <h2>Property review result</h2>
                  <span>
                    Based on the submitted details and the trained Noble Addis
                    model.
                  </span>
                </div>

                <span className={`report-status ${riskDisplay.className}`}>
                  {riskDisplay.label}
                </span>
              </div>

              <div className="report-metrics-grid simple-metrics-grid">
                <div className="report-metric-card primary">
                  <small>Estimated fair value</small>
                  <strong>{formatMoney(Number(result.estimatedValue || 0))}</strong>
                  <p>
                    Suggested fair value based on the trained property price
                    model.
                  </p>
                </div>

                <div className="report-metric-card">
                  <small>Listed price</small>
                  <strong>{formatMoney(Number(form.listedPriceUsd))}</strong>
                  <p>Price entered from the property listing.</p>
                </div>

                <div className="report-metric-card">
                  <small>Price signal</small>
                  <strong>{cleanSignal(result.priceSignal)}</strong>
                  <p>
                    Difference:{" "}
                    {typeof result.priceGapPercent === "number"
                      ? `${result.priceGapPercent}%`
                      : "Not available"}
                  </p>
                </div>
              </div>

              <div className={`simple-risk-box ${riskDisplay.className}`}>
                <RiskIcon size={24} />
                <div>
                  <h3>{riskDisplay.label}</h3>
                  <p>{riskDisplay.note}</p>
                </div>
              </div>

              <div className="report-card simple-guidance-card">
                <div className="report-card-title">
                  <h3>Buyer guidance</h3>
                </div>

                <ul className="risk-factor-list">
                  {(result.riskFactors || [
                    "Confirm the exact location and ownership documents.",
                    "Compare the price with similar properties in the same area.",
                    "Verify the seller or agent before making any payment.",
                  ]).map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>

              <p className="model-source-note">
                Model source:{" "}
                {result.modelSource ||
                  "Trained Noble Addis price and listing risk models."}
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}