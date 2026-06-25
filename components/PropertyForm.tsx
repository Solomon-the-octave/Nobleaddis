"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import {
  locations,
  propertyTypes,
  sampleListings,
  PropertyListing,
} from "../lib/sampleData";
import { EvaluationResult } from "../lib/prediction";
import ResultCards from "./ResultCards";
import MapView from "./MapView";
import DevelopmentPreview from "./DevelopmentPreview";

type FormState = {
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  amenitiesCount: number;
  completenessScore: number;
  description: string;
};

type SavedReport = FormState &
  EvaluationResult & {
    id: string;
    title: string;
    imageUrl: string;
    sourcePlatform: string;
    listingUrl: string;
    createdAt: string;
  };

function formatUsd(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatEtb(value?: number) {
  if (!value || Number.isNaN(value)) return "ETB not available";
  return `ETB ${Math.round(value).toLocaleString("en-US")}`;
}

function getStatusLabel(status: PropertyListing["status"]) {
  if (status === "flagged") return "Needs review";
  if (status === "needs-review") return "Review required";
  return "Standard";
}

function getStatusClass(status: PropertyListing["status"]) {
  if (status === "flagged") return "listing-status flagged";
  if (status === "needs-review") return "listing-status review";
  return "listing-status verified";
}

function saveReportLocally(report: SavedReport) {
  const savedReports = localStorage.getItem("noble_addis_reports");
  const reports: SavedReport[] = savedReports ? JSON.parse(savedReports) : [];

  localStorage.setItem(
    "noble_addis_reports",
    JSON.stringify([report, ...reports])
  );
}

export default function PropertyForm() {
  const standardListing =
    sampleListings.find((listing) => listing.status === "verified") ??
    sampleListings[0];

  const flaggedListing =
    sampleListings.find(
      (listing) =>
        listing.status === "flagged" || listing.riskLabel === "suspicious"
    ) ?? sampleListings[1];

  const landListing =
    sampleListings.find(
      (listing) => listing.propertyType.toLowerCase() === "land"
    ) ?? sampleListings[2];

  const [selectedListing, setSelectedListing] =
    useState<PropertyListing>(standardListing);

  const [form, setForm] = useState<FormState>({
    location: standardListing.location,
    propertyType: standardListing.propertyType,
    listedPriceUsd: standardListing.listedPriceUsd,
    sizeSqm: standardListing.sizeSqm,
    bedrooms: standardListing.bedrooms,
    bathrooms: standardListing.bathrooms,
    amenitiesCount: standardListing.amenitiesCount,
    completenessScore: standardListing.completenessScore,
    description: standardListing.description,
  });

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const matchingListings = useMemo(() => {
    return sampleListings.filter(
      (listing) =>
        listing.location === form.location &&
        listing.propertyType === form.propertyType
    );
  }, [form.location, form.propertyType]);

  function applyListing(listing: PropertyListing) {
    setSelectedListing(listing);

    setForm({
      location: listing.location,
      propertyType: listing.propertyType,
      listedPriceUsd: listing.listedPriceUsd,
      sizeSqm: listing.sizeSqm,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      amenitiesCount: listing.amenitiesCount,
      completenessScore: listing.completenessScore,
      description: listing.description,
    });

    setResult(null);
    setSaveMessage("");
  }

  function isSelected(listing: PropertyListing) {
    return selectedListing.id === listing.id;
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    const updatedForm = {
      ...form,
      [key]: value,
    };

    setForm(updatedForm);

    const exactMatch = sampleListings.find(
      (listing) =>
        listing.location === updatedForm.location &&
        listing.propertyType === updatedForm.propertyType &&
        Math.round(listing.listedPriceUsd) ===
          Math.round(updatedForm.listedPriceUsd)
    );

    if (exactMatch) {
      setSelectedListing(exactMatch);
    }

    setResult(null);
    setSaveMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate listing.");
      }

      const data: EvaluationResult = await response.json();

      setResult(data);

      saveReportLocally({
        id: crypto.randomUUID(),
        title: selectedListing.title,
        imageUrl: selectedListing.imageUrl,
        sourcePlatform: selectedListing.sourcePlatform,
        listingUrl: selectedListing.listingUrl,
        createdAt: new Date().toISOString(),
        ...form,
        ...data,
      });

      setSaveMessage("Review complete. Report saved.");
    } catch (error) {
      console.error("Evaluation error:", error);
      setSaveMessage("Unable to complete the review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const messageIsError = saveMessage.includes("Unable to complete");

  return (
    <section className="review-workspace">
      <div className="review-toolbar">
        <div>
          <p className="section-kicker">Property review</p>
          <h2>Select a listing</h2>
        </div>

        <div className="dataset-actions">
          <button
            type="button"
            className={isSelected(standardListing) ? "active-demo-button" : ""}
            onClick={() => applyListing(standardListing)}
          >
            Apartment
          </button>

          <button
            type="button"
            className={isSelected(flaggedListing) ? "active-demo-button" : ""}
            onClick={() => applyListing(flaggedListing)}
          >
            Needs review
          </button>

          <button
            type="button"
            className={isSelected(landListing) ? "active-demo-button" : ""}
            onClick={() => applyListing(landListing)}
          >
            Land
          </button>
        </div>
      </div>

      <div className="review-grid">
        <aside className="selected-listing-panel">
          <div className="selected-image-wrap">
            <img
              src={selectedListing.imageUrl}
              alt={selectedListing.title}
              className="selected-listing-image"
            />

            <span className={getStatusClass(selectedListing.status)}>
              {getStatusLabel(selectedListing.status)}
            </span>
          </div>

          <div className="selected-listing-body">
            <h3>{selectedListing.title}</h3>

            <div className="selected-location">
              <MapPin size={16} />
              <span>{selectedListing.location}</span>
            </div>

            <div className="selected-price-row">
              <div>
                <small>Listed price</small>
                <strong>{formatUsd(selectedListing.listedPriceUsd)}</strong>
              </div>

              <div>
                <small>Local price</small>
                <strong>{formatEtb(selectedListing.listedPriceEtb)}</strong>
              </div>
            </div>

            <div className="source-box">
              <small>Source</small>
              <strong>{selectedListing.sourcePlatform}</strong>

              <p>
                Listing details are used for property review. Private seller
                contact information is not displayed.
              </p>

              {selectedListing.listingUrl && (
                <a
                  href={selectedListing.listingUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View original listing
                </a>
              )}
            </div>
          </div>
        </aside>

        <form className="review-form-panel" onSubmit={handleSubmit}>
          <div className="form-panel-header">
            <div>
              <h3>Property details</h3>
              <p>Review the listing information before generating the assessment.</p>
            </div>

            <Search size={22} />
          </div>

          <div className="input-grid">
            <label>
              Location
              <select
                value={form.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
              >
                {locations.map((location) => (
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
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Listed price in USD
              <input
                type="number"
                value={form.listedPriceUsd}
                onChange={(event) =>
                  updateField("listedPriceUsd", Number(event.target.value))
                }
              />
            </label>

            <label>
              Size in sqm
              <input
                type="number"
                value={form.sizeSqm}
                onChange={(event) =>
                  updateField("sizeSqm", Number(event.target.value))
                }
              />
            </label>

            <label>
              Bedrooms
              <input
                type="number"
                value={form.bedrooms}
                onChange={(event) =>
                  updateField("bedrooms", Number(event.target.value))
                }
              />
            </label>

            <label>
              Bathrooms
              <input
                type="number"
                value={form.bathrooms}
                onChange={(event) =>
                  updateField("bathrooms", Number(event.target.value))
                }
              />
            </label>

            <label>
              Amenities count
              <input
                type="number"
                value={form.amenitiesCount}
                onChange={(event) =>
                  updateField("amenitiesCount", Number(event.target.value))
                }
              />
            </label>

            <label>
              Completeness score
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={form.completenessScore}
                onChange={(event) =>
                  updateField("completenessScore", Number(event.target.value))
                }
              />
            </label>
          </div>

          <label className="full-input">
            Listing description
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
            />
          </label>

          {matchingListings.length > 1 && (
            <div className="matching-listing-note">
              <FileText size={18} />
              <span>
                {matchingListings.length} similar listings found in this
                location and property type.
              </span>
            </div>
          )}

          <button
            className="submit-review-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="spin-icon" size={18} />
                Running review...
              </>
            ) : (
              <>
                Generate review
                <CheckCircle size={18} />
              </>
            )}
          </button>

          {saveMessage && (
            <div
              className={
                messageIsError ? "review-message error" : "review-message"
              }
            >
              {messageIsError ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle size={18} />
              )}

              <span>{saveMessage}</span>
            </div>
          )}
        </form>
      </div>

      {result && (
        <div className="review-results-stack">
          <ResultCards result={result} />

          <div className="review-lower-grid">
            <MapView
              latitude={selectedListing.latitude}
              longitude={selectedListing.longitude}
              location={selectedListing.location}
            />

            <DevelopmentPreview
              propertyType={form.propertyType}
              sizeSqm={form.sizeSqm}
              bedrooms={form.bedrooms}
              bathrooms={form.bathrooms}
              location={form.location}
              imageUrl={selectedListing.imageUrl}
            />
          </div>
        </div>
      )}
    </section>
  );
}