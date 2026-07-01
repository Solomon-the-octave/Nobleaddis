"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle,
  ImageIcon,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { EvaluationResult, formatMoney } from "../lib/prediction";
import ResultCards from "./ResultCards";
import MapView from "./MapView";

type ListingRecord = {
  id: string;
  title: string;
  area: string;
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  amenitiesCount: number;
  descriptionLength?: number;
  completenessScore: number;
  pricePerSqm?: number;
  riskLabel?: string;
  description: string;
  imageUrl?: string;
  sourceUrl?: string;
};

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

const emptyForm: FormState = {
  location: "",
  propertyType: "Apartment",
  listedPriceUsd: 0,
  sizeSqm: 0,
  bedrooms: 0,
  bathrooms: 0,
  amenitiesCount: 0,
  completenessScore: 0.7,
  description: "",
};

function cleanText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getRiskClass(value?: string) {
  const cleanValue = value?.toLowerCase() || "";

  if (cleanValue.includes("suspicious") || cleanValue.includes("flagged")) {
    return "model-pill danger";
  }

  if (cleanValue.includes("medium") || cleanValue.includes("review")) {
    return "model-pill warning";
  }

  return "model-pill success";
}

function getRiskLabel(value?: string) {
  if (!value) return "normal";

  if (value === "medium-risk") return "needs review";

  return value;
}

function listingToForm(listing: ListingRecord): FormState {
  return {
    location: listing.location,
    propertyType: listing.propertyType,
    listedPriceUsd: listing.listedPriceUsd,
    sizeSqm: listing.sizeSqm,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    amenitiesCount: listing.amenitiesCount,
    completenessScore: listing.completenessScore,
    description: listing.description,
  };
}

function findMatchingListing(form: FormState, listings: ListingRecord[]) {
  const enteredLocation = cleanText(form.location);
  const enteredType = cleanText(form.propertyType);

  return (
    listings.find((listing) => {
      const listingArea = cleanText(listing.area);
      const listingLocation = cleanText(listing.location);
      const listingType = cleanText(listing.propertyType);

      const locationMatches =
        enteredLocation.includes(listingArea) ||
        enteredLocation.includes(listingLocation) ||
        listingLocation.includes(enteredLocation);

      const typeMatches = enteredType === listingType;
      const bedroomsMatch = Number(form.bedrooms) === listing.bedrooms;
      const bathroomsMatch = Number(form.bathrooms) === listing.bathrooms;
      const sizeMatches = Math.abs(Number(form.sizeSqm) - listing.sizeSqm) <= 15;

      return (
        locationMatches &&
        typeMatches &&
        bedroomsMatch &&
        bathroomsMatch &&
        sizeMatches
      );
    }) || null
  );
}

async function saveReportToDatabase(
  form: FormState,
  result: EvaluationResult
) {
  const response = await fetch("/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      ...result,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Report could not be saved.");
  }

  return data.report;
}

function getLocationCoordinates(location: string) {
  const cleanLocation = location.toLowerCase();

  if (cleanLocation.includes("bole")) {
    return { latitude: 8.9806, longitude: 38.7578 };
  }

  if (cleanLocation.includes("cmc")) {
    return { latitude: 9.0206, longitude: 38.8462 };
  }

  if (cleanLocation.includes("ayat")) {
    return { latitude: 9.0487, longitude: 38.8903 };
  }

  if (cleanLocation.includes("summit")) {
    return { latitude: 9.0564, longitude: 38.8725 };
  }

  if (cleanLocation.includes("gerji")) {
    return { latitude: 9.0128, longitude: 38.8354 };
  }

  if (cleanLocation.includes("saris")) {
    return { latitude: 8.9242, longitude: 38.7469 };
  }

  if (cleanLocation.includes("kality")) {
    return { latitude: 8.9096, longitude: 38.7737 };
  }

  if (cleanLocation.includes("megenagna")) {
    return { latitude: 9.0201, longitude: 38.8028 };
  }

  if (cleanLocation.includes("piassa")) {
    return { latitude: 9.0373, longitude: 38.7524 };
  }

  return { latitude: 9.03, longitude: 38.74 };
}

export default function PropertyForm() {
  const [listings, setListings] = useState<ListingRecord[]>([]);
  const [selectedListing, setSelectedListing] =
    useState<ListingRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [pageMessage, setPageMessage] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        const response = await fetch("/api/listings");

        if (!response.ok) {
          throw new Error("Could not load listings.");
        }

        const data = await response.json();
        const loadedListings: ListingRecord[] = data.listings || [];

        setListings(loadedListings);

        if (loadedListings.length > 0) {
          setSelectedListing(loadedListings[0]);
          setForm(listingToForm(loadedListings[0]));
        }
      } catch (error) {
        console.error("Listing load error:", error);
        setPageMessage("Unable to load available listing records.");
      } finally {
        setIsLoadingListings(false);
      }
    }

    loadListings();
  }, []);

  const matchedListing = findMatchingListing(form, listings);
  const isAvailable = Boolean(matchedListing);
  const coordinates = getLocationCoordinates(
    matchedListing ? matchedListing.location : form.location
  );

  function applyListing(listing: ListingRecord) {
    setSelectedListing(listing);
    setForm(listingToForm(listing));
    setResult(null);
    setPageMessage("");
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setResult(null);
    setPageMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!matchedListing) {
      setPageMessage(
        "This property is not available in the current Noble Addis records."
      );
      return;
    }

    setIsLoading(true);
    setPageMessage("");

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to review listing.");
      }

      const reviewResult = data as EvaluationResult;

      setResult(reviewResult);

      try {
        await saveReportToDatabase(form, reviewResult);
        setPageMessage("Review complete. Saved to your reports.");
      } catch (saveError) {
        console.error("Report save error:", saveError);
        setPageMessage(
          "Review complete, but the report could not be saved to the database."
        );
      }
    } catch (error) {
      console.error("Review error:", error);
      setPageMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete the review. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const messageIsError =
    pageMessage.includes("Unable") ||
    pageMessage.includes("not available") ||
    pageMessage.includes("Failed") ||
    pageMessage.includes("Could not") ||
    pageMessage.includes("could not");

  return (
    <section className="property-review-shell">
      <div className="property-review-hero">
        <div>
          <p className="section-kicker">Property review</p>
          <h2>Check listing availability</h2>
          <p>
            Enter the property details to check whether the listing exists in
            the current Noble Addis records. If it is available, the platform
            prepares a buyer review with price guidance and next steps.
          </p>
        </div>

        <div className="property-review-hero-stat">
          <span>Available records</span>
          <strong>{isLoadingListings ? "..." : listings.length}</strong>
        </div>
      </div>

      <div className="property-review-grid">
        <aside className="rental-record-panel">
          <div className="panel-heading">
            <p className="section-kicker">Records</p>
            <h3>Available listings</h3>
          </div>

          {isAvailable && matchedListing ? (
            matchedListing.imageUrl ? (
              <div className="selected-property-photo">
                <img src={matchedListing.imageUrl} alt={matchedListing.title} />

                <div className="selected-property-photo-content">
                  <span>Matched property</span>
                  <strong>{matchedListing.title}</strong>
                  <p>{matchedListing.description}</p>
                </div>
              </div>
            ) : (
              <div className="property-photo-placeholder">
                <div>
                  <ImageIcon size={36} />
                  <h4>Photo not added yet</h4>
                  <p>
                    This listing is available, but no property image has been
                    attached yet. Once listing photos are added, they will appear
                    here.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="not-available-photo-card">
              <ImageIcon size={34} />
              <h4>No matching property found</h4>
              <p>
                The details entered do not match a listing currently stored in
                Noble Addis.
              </p>
            </div>
          )}

          <div className="rental-record-list">
            {isLoadingListings ? (
              <div className="not-available-photo-card">
                <Loader2 className="spin-icon" size={28} />
                <h4>Loading listings</h4>
                <p>Checking the current Noble Addis records...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="not-available-photo-card">
                <XCircle size={34} />
                <h4>No listings loaded</h4>
                <p>
                  The listing records could not be loaded. Check the listings
                  API or data file.
                </p>
              </div>
            ) : (
              listings.map((listing) => (
                <button
                  type="button"
                  key={listing.id}
                  className={
                    selectedListing?.id === listing.id
                      ? "rental-record-card active"
                      : "rental-record-card"
                  }
                  onClick={() => applyListing(listing)}
                >
                  <div className="rental-record-main">
                    <span>{listing.area}</span>
                    <strong>{listing.title}</strong>
                    <small>
                      {listing.bedrooms} bed · {listing.bathrooms} bath ·{" "}
                      {listing.sizeSqm} sqm
                    </small>
                  </div>

                  <div className="rental-record-price">
                    <strong>{formatMoney(listing.listedPriceUsd)}</strong>
                    <span>listed price</span>
                  </div>

                  <div className={getRiskClass(listing.riskLabel)}>
                    {getRiskLabel(listing.riskLabel)}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <form className="rental-form-panel" onSubmit={handleSubmit}>
          <div className="form-panel-header">
            <div>
              <p className="section-kicker">Search criteria</p>
              <h3>Listing details</h3>
              <span>
                Fill in the property details to check whether the listing is
                available in the current records.
              </span>
            </div>

            <Search size={22} />
          </div>

          <div
            className={
              isAvailable
                ? "availability-card available"
                : "availability-card unavailable"
            }
          >
            <div>
              <span>Availability status</span>

              {isAvailable && matchedListing ? (
                <>
                  <strong>Available</strong>
                  <p>
                    A matching record was found for {matchedListing.area}. You
                    can generate a buyer review for this listing.
                  </p>
                </>
              ) : (
                <>
                  <strong>Not available</strong>
                  <p>
                    No matching record was found. Check the area, property type,
                    bedroom count, bathroom count, and size.
                  </p>
                </>
              )}
            </div>

            {isAvailable ? <CheckCircle size={28} /> : <XCircle size={28} />}
          </div>

          {isAvailable && matchedListing && (
            <div className="selected-rental-summary">
              <div>
                <span>Matched listing</span>
                <strong>{matchedListing.title}</strong>
              </div>

              <div>
                <span>Listed price</span>
                <strong>{formatMoney(matchedListing.listedPriceUsd)}</strong>
              </div>

              <div>
                <span>Listing status</span>
                <strong>{getRiskLabel(matchedListing.riskLabel)}</strong>
              </div>
            </div>
          )}

          <div className="input-grid">
            <label>
              Area / location
              <input
                value={form.location}
                placeholder="Example: Bole"
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
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
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Villa">Villa</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Commercial">Commercial</option>
                <option value="Studio">Studio</option>
              </select>
            </label>

            <label>
              Listed price
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
              Amenities listed
              <input
                type="number"
                value={form.amenitiesCount}
                onChange={(event) =>
                  updateField("amenitiesCount", Number(event.target.value))
                }
              />
            </label>

            <label>
              Listing completeness
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

          <button
            className="submit-review-button"
            type="submit"
            disabled={isLoading || isLoadingListings || !isAvailable}
          >
            {isLoading ? (
              <>
                <Loader2 className="spin-icon" size={18} />
                Reviewing listing...
              </>
            ) : isAvailable ? (
              <>
                Generate review
                <CheckCircle size={18} />
              </>
            ) : (
              <>
                Listing not available
                <XCircle size={18} />
              </>
            )}
          </button>

          {pageMessage && (
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

              <span>{pageMessage}</span>
            </div>
          )}
        </form>
      </div>

      {result && matchedListing && (
        <div className="review-results-stack">
          <ResultCards result={result} />

          <div className="review-lower-grid">
            <MapView
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              location={matchedListing.location}
            />

            <div className="property-review-note">
              <MapPin size={22} />
              <div>
                <h3>Location note</h3>
                <p>
                  The map gives an area reference only. Buyers should confirm
                  the exact address, access road, ownership documents, and
                  viewing arrangements before making any payment.
                </p>
              </div>
            </div>
          </div>

          <div className="property-review-note">
            <SlidersHorizontal size={22} />
            <div>
              <h3>What affects the review?</h3>
              <p>
                The review changes when the listed price, property size,
                bedrooms, bathrooms, amenities, and listing completeness are
                adjusted. This helps test fair listings, overpriced listings,
                low-price listings, and incomplete listings.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}