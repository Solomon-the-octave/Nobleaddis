"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MapPin,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";
import { formatMoney } from "../lib/prediction";
import RatingWidget from "./RatingWidget";

type FormState = {
  location: string;
  addressOption: string;
  customAddress: string;
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

const ADDIS_LOCATIONS = [
  "Bole",
  "CMC",
  "Ayat",
  "Summit",
  "Gerji",
  "Megenagna",
  "Piassa",
  "Saris",
  "Kality",
];

const ADDRESS_OPTIONS: Record<string, string[]> = {
  Bole: [
    "Bole Medhanialem",
    "Edna Mall, Bole",
    "Bole Atlas",
    "Bole Rwanda",
    "Bole Airport area",
  ],
  CMC: ["CMC Michael", "CMC Road", "CMC Square", "Civil Service area"],
  Ayat: ["Ayat Roundabout", "Ayat Real Estate", "Ayat Square", "Tafo Road"],
  Summit: ["Summit Condominium", "Summit 72", "Summit Safari", "Figa area"],
  Gerji: ["Gerji Mebrat Hail", "Gerji Imperial", "Gerji Condominium"],
  Megenagna: [
    "Megenagna Square",
    "Zefmesh Grand Mall",
    "24 area",
    "Lem Hotel area",
  ],
  Piassa: ["Piassa Square", "Arada", "Churchill Road", "Taitu Hotel area"],
  Saris: ["Saris Abo", "Saris Addisu Sefer", "Saris Total", "Gotera area"],
  Kality: ["Kality Total", "Kality Industrial area", "Akaki Kality", "Tulu Dimtu"],
};

const initialForm: FormState = {
  location: "Bole",
  addressOption: "Bole Medhanialem",
  customAddress: "",
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
  if (!value) return "Within range";

  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRiskDisplay(riskLevel?: string) {
  if (riskLevel === "suspicious") {
    return {
      label: "High caution",
      className: "danger",
      icon: ShieldAlert,
      note: "Verify the seller, documents, location, and property condition before moving forward.",
    };
  }

  if (riskLevel === "medium-risk") {
    return {
      label: "Needs review",
      className: "warning",
      icon: AlertTriangle,
      note: "Review the price, documents, seller details, and exact location carefully.",
    };
  }

  return {
    label: "Looks reasonable",
    className: "success",
    icon: CheckCircle2,
    note: "The listing looks reasonable, but the buyer should still confirm the key details.",
  };
}

export default function PropertyForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const addressOptions = ADDRESS_OPTIONS[form.location] || [];

  const selectedAddress =
    form.addressOption === "custom"
      ? form.customAddress
      : form.addressOption || form.location;

  const mapQuery = useMemo(() => {
    const address = selectedAddress || form.location || "Addis Ababa";
    return `${address}, ${form.location}, Addis Ababa, Ethiopia`;
  }, [selectedAddress, form.location]);

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&z=15&output=embed`;

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateLocation(value: string) {
    const firstAddress = ADDRESS_OPTIONS[value]?.[0] || "";

    setForm((current) => ({
      ...current,
      location: value,
      addressOption: firstAddress,
      customAddress: "",
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsChecking(true);
    setMessage("");
    setResult(null);

    const listedPrice = Number(form.listedPriceUsd);
    const sizeSqm = Number(form.sizeSqm);

    if (!form.location) {
      setMessage("Please select a location.");
      setIsChecking(false);
      return;
    }

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
      const evaluateResponse = await fetch("/api/evaluate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: form.location,
          address: selectedAddress,
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

      const data = await evaluateResponse.json();

      if (!evaluateResponse.ok) {
        setMessage(data.message || "Unable to review this property.");
        setIsChecking(false);
        return;
      }

      setResult(data);

      const saveResponse = await fetch("/api/reports", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: form.location,
          address: selectedAddress,
          propertyType: form.propertyType,

          listedPriceUsd: listedPrice,
          sizeSqm,
          bedrooms: Number(form.bedrooms) || 0,
          bathrooms: Number(form.bathrooms) || 0,
          amenitiesCount: Number(form.amenitiesCount) || 0,
          completenessScore: form.description.length > 60 ? 0.85 : 0.6,
          description: form.description,

          estimatedValue: Number(data.estimatedValue || 0),
          negotiationLow: Number(data.negotiationLow || 0),
          negotiationHigh: Number(data.negotiationHigh || 0),
          priceSignal: data.priceSignal || "within-range",
          priceGapPercent: Number(data.priceGapPercent || 0),

          riskLevel: data.riskLevel || "normal",
          riskScore: Number(data.riskScore || 0),

          opportunitySignal:
            data.opportunitySignal ||
            (data.riskLevel === "medium-risk"
              ? "Review carefully"
              : "Proceed with verification"),

          opportunityNote:
            data.opportunityNote ||
            "Review listing details before moving forward.",

          explanation:
            data.explanation ||
            "This assessment is based on the submitted property details.",

          pricePerSqm: Number(
            data.pricePerSqm || Math.round(listedPrice / sizeSqm)
          ),
          nearbyAveragePrice: Number(data.nearbyAveragePrice || 0),
          nearbyAveragePricePerSqm: Number(data.nearbyAveragePricePerSqm || 0),
          modelSource:
            data.modelSource ||
            "Trained Noble Addis price and listing risk models.",
        }),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error("Failed to save report:", errorText);

        setMessage("Checked, but not saved to History. Please sign in again.");

        return;
      }

      setMessage("Checked and saved to History.");
    } catch (error) {
      console.error("Property review error:", error);
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
          <h2>Check property details</h2>
          <p>Review price, location, and listing signals before moving forward.</p>
        </div>

        <div className="property-review-hero-stat">
          <span>Dataset</span>
          <strong>85,400 records</strong>
        </div>
      </div>

      <div className="simple-evaluate-grid fixed-evaluate-grid">
        <form
          onSubmit={handleSubmit}
          className="rental-form-panel fixed-form-card"
        >
          <div className="form-panel-header">
            <div>
              <p className="section-kicker">Listing details</p>
              <h3>Property information</h3>
            </div>

            <SearchCheck size={28} />
          </div>

          <div className="input-grid">
            <label>
              Location
              <select
                value={form.location}
                onChange={(event) => updateLocation(event.target.value)}
                required
              >
                <option value="">Select location</option>
                {ADDIS_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
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
              Nearby address / landmark
              <select
                value={form.addressOption}
                onChange={(event) =>
                  updateField("addressOption", event.target.value)
                }
              >
                {addressOptions.map((address) => (
                  <option key={address} value={address}>
                    {address}
                  </option>
                ))}
                <option value="custom">Enter custom address</option>
              </select>
            </label>

            {form.addressOption === "custom" && (
              <label>
                Custom address
                <input
                  value={form.customAddress}
                  onChange={(event) =>
                    updateField("customAddress", event.target.value)
                  }
                  placeholder="Example: Near Edna Mall, Bole"
                />
              </label>
            )}

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
                onChange={(event) =>
                  updateField("bathrooms", event.target.value)
                }
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
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Briefly describe the property..."
            />
          </label>

          <button className="submit-review-button" type="submit">
            {isChecking ? (
              <>
                <Loader2 className="spin-icon" size={18} />
                Checking...
              </>
            ) : (
              <>
                <SearchCheck size={18} />
                Check property
              </>
            )}
          </button>

          {message && (
            <div
              className={
                message.includes("saved") && !message.includes("not saved")
                  ? "review-message success"
                  : "review-message error"
              }
            >
              {message}
            </div>
          )}
        </form>

        <aside className="fixed-side-panel">
          <div className="fixed-map-card">
            <div className="fixed-map-header">
              <div>
                <p className="section-kicker">Location preview</p>
                <h3>{selectedAddress || "Select an address"}</h3>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  mapQuery
                )}`}
                target="_blank"
                rel="noreferrer"
                className="map-open-link"
              >
                <MapPin size={16} />
                Open map
              </a>
            </div>

            <iframe
              title="Selected property location map"
              src={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="property-report-panel simple-result-panel fixed-result-card">
            {!result ? (
              <div className="simple-empty-result fixed-empty-result">
                <SearchCheck size={34} />
                <h3>Review result will appear here</h3>
              </div>
            ) : (
              <>
                <div className="report-header">
                  <div>
                    <h2>Property review result</h2>
                  </div>

                  <span className={`report-status ${riskDisplay.className}`}>
                    {riskDisplay.label}
                  </span>
                </div>

                <div className="report-metrics-grid simple-metrics-grid">
                  <div className="report-metric-card primary">
                    <small>Estimated value</small>
                    <strong>
                      {formatMoney(Number(result.estimatedValue || 0))}
                    </strong>
                  </div>

                  <div className="report-metric-card">
                    <small>Listed price</small>
                    <strong>{formatMoney(Number(form.listedPriceUsd))}</strong>
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
                      "Confirm ownership documents.",
                      "Verify the seller or agent.",
                      "Check the exact location before payment.",
                    ]).map((factor) => (
                      <li key={factor}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <RatingWidget />
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}