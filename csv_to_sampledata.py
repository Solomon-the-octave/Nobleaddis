import pandas as pd
from pathlib import Path

INPUT_FILE = "data/addis_property_listings.csv"
OUTPUT_FILE = "lib/sampleData.ts"

df = pd.read_csv(INPUT_FILE)

def safe_str(value):
    return str(value).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").strip()

def status_from_risk(risk):
    if risk == "suspicious":
        return "flagged"
    if risk == "medium-risk":
        return "needs-review"
    return "verified"

def property_type_to_title(value):
    value = str(value).strip()
    if value.lower() == "property":
        return "Property"
    return value

lat_lng_by_location = {
    "Bole": (8.9806, 38.7992),
    "Kirkos": (9.0054, 38.7636),
    "Akaky Kaliti": (8.8767, 38.7894),
    "Yeka": (9.0301, 38.8122),
    "Nifas Silk-Lafto": (8.9588, 38.7348),
    "Lideta": (9.0105, 38.7423),
    "Gulele": (9.045, 38.745),
    "Arada": (9.035, 38.752),
    "Kolfe Keranio": (9.033, 38.69),
    "Addis Ketema": (9.035, 38.735),
    "CMC": (9.013, 38.845),
    "Ayat": (9.032, 38.882),
    "Megenagna": (9.018, 38.8),
    "Saris": (8.935, 38.745),
    "Gerji": (9.005, 38.815),
    "Summit": (9.043, 38.851),
    "Addis Ababa": (9.03, 38.74),
}

lines = []

lines.append("""export type PropertyListing = {
  id: number;
  title: string;
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  listedPriceEtb: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  amenitiesCount: number;
  completenessScore: number;
  riskLabel: "normal" | "medium-risk" | "suspicious";
  latitude: number;
  longitude: number;
  status: "verified" | "needs-review" | "flagged";
  description: string;
  imageUrl: string;
  sourcePlatform: string;
  sourceNote: string;
  listingUrl: string;
  verificationStatus: string;
  listingAge: string;
  agentType: string;
};

export const sampleListings: PropertyListing[] = [
""")

for _, row in df.iterrows():
    location = safe_str(row.get("location", "Addis Ababa"))
    lat, lng = lat_lng_by_location.get(location, lat_lng_by_location["Addis Ababa"])

    risk = safe_str(row.get("risk_label", "normal"))
    status = status_from_risk(risk)

    property_type = property_type_to_title(row.get("property_type", "Property"))

    if status == "flagged":
        verification = "Flagged for manual verification"
        agent_type = "Marketplace listing"
    elif status == "needs-review":
        verification = "Needs document and location review"
        agent_type = "Broker or marketplace listing"
    else:
        verification = "Listing details mostly complete"
        agent_type = "Public marketplace listing"

    lines.append(f"""  {{
    id: {int(row.get("id", 0))},
    title: "{safe_str(row.get("title", "Property listing"))}",
    location: "{location}",
    propertyType: "{safe_str(property_type)}",
    listedPriceUsd: {int(row.get("listed_price_usd", 0))},
    listedPriceEtb: {int(row.get("listed_price_etb", 0))},
    sizeSqm: {int(row.get("size_sqm", 100))},
    bedrooms: {int(row.get("bedrooms", 2))},
    bathrooms: {int(row.get("bathrooms", 1))},
    amenitiesCount: {int(row.get("amenities_count", 2))},
    completenessScore: {float(row.get("completeness_score", 0.7))},
    riskLabel: "{risk}",
    latitude: {lat},
    longitude: {lng},
    status: "{status}",
    description: "{safe_str(row.get("title", "Public listing collected for academic MVP demonstration."))}",
    imageUrl: "{safe_str(row.get("image_url", ""))}",
    sourcePlatform: "{safe_str(row.get("source_platform", "Jiji Ethiopia"))}",
    sourceNote: "{safe_str(row.get("source_note", "Public listing data collected for academic MVP demonstration."))}",
    listingUrl: "{safe_str(row.get("listing_url", ""))}",
    verificationStatus: "{verification}",
    listingAge: "Collected for MVP dataset",
    agentType: "{agent_type}",
  }},
""")

lines.append("""];

export const locations = Array.from(
  new Set(sampleListings.map((listing) => listing.location))
);

export const propertyTypes = Array.from(
  new Set(sampleListings.map((listing) => listing.propertyType))
);

export function getListingsForReview() {
  return sampleListings.filter(
    (listing) => listing.status === "needs-review" || listing.status === "flagged"
  );
}

export function getAveragePriceByLocation(location: string) {
  const listingsInLocation = sampleListings.filter(
    (listing) => listing.location === location
  );

  if (listingsInLocation.length === 0) {
    return 0;
  }

  const total = listingsInLocation.reduce(
    (sum, listing) => sum + listing.listedPriceUsd,
    0
  );

  return Math.round(total / listingsInLocation.length);
}

export function getAveragePricePerSqmByLocation(location: string) {
  const listingsInLocation = sampleListings.filter(
    (listing) => listing.location === location
  );

  if (listingsInLocation.length === 0) {
    return 0;
  }

  const total = listingsInLocation.reduce(
    (sum, listing) => sum + listing.listedPriceUsd / listing.sizeSqm,
    0
  );

  return Math.round(total / listingsInLocation.length);
}
""")

Path("lib").mkdir(exist_ok=True)
Path(OUTPUT_FILE).write_text("".join(lines), encoding="utf-8")

print("Updated:", OUTPUT_FILE)
print("Rows converted:", len(df))