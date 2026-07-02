import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CsvRow = Record<string, string>;

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (const char of line) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

function toNumber(value: string | undefined, fallback = 0) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return numberValue;
}

function getText(row: CsvRow, key: string, fallback = "") {
  return row[key] || fallback;
}

function makeTitle(row: CsvRow) {
  const bedrooms = toNumber(row["bedrooms"]);
  const propertyType = getText(row, "property_type", "Property");
  const location = getText(row, "location", "Addis Ababa");

  if (bedrooms > 0) {
    return `${bedrooms}-bedroom ${propertyType.toLowerCase()} in ${location}`;
  }

  return `${propertyType} property in ${location}`;
}

function makeDescription(row: CsvRow) {
  const bedrooms = toNumber(row["bedrooms"]);
  const bathrooms = toNumber(row["bathrooms"]);
  const propertyType = getText(row, "property_type", "Property");
  const location = getText(row, "location", "Addis Ababa");
  const size = toNumber(row["size_sqm"]);
  const amenities = toNumber(row["amenities_count"]);

  const roomText =
    bedrooms > 0
      ? `${bedrooms} bedroom${bedrooms === 1 ? "" : "s"} and ${bathrooms} bathroom${
          bathrooms === 1 ? "" : "s"
        }`
      : `${bathrooms} bathroom${bathrooms === 1 ? "" : "s"}`;

  return `${propertyType} listing in ${location}, Addis Ababa with ${roomText}, ${size} sqm, and ${amenities} listed amenities.`;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "sample_listings.csv");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        listings: [],
        error: "sample_listings.csv was not found.",
      });
    }

    const csvText = fs.readFileSync(filePath, "utf-8");
    const rows = parseCsv(csvText);

    const listings = rows.map((row) => {
      const location = getText(row, "location", "Addis Ababa");
      const propertyType = getText(row, "property_type", "Property");
      const listedPrice = toNumber(row["listed_price_usd"]);
      const sizeSqm = toNumber(row["size_sqm"]);

      return {
        id: getText(row, "listing_id"),
        title: makeTitle(row),
        area: location,
        location: `${location}, Addis Ababa`,
        propertyType,
        listedPriceUsd: listedPrice,
        sizeSqm,
        bedrooms: toNumber(row["bedrooms"]),
        bathrooms: toNumber(row["bathrooms"]),
        amenitiesCount: toNumber(row["amenities_count"]),
        descriptionLength: toNumber(row["description_length"]),
        completenessScore: toNumber(row["completeness_score"], 0.7),
        pricePerSqm:
          toNumber(row["price_per_sqm"]) ||
          (sizeSqm > 0 ? listedPrice / sizeSqm : 0),
        riskLabel: getText(row, "risk_label", "normal"),
        description: makeDescription(row),
        imageUrl: getText(row, "image_url"),
        sourceUrl: getText(row, "source_url"),
      };
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Failed to load listings:", error);

    return NextResponse.json(
      {
        listings: [],
        error: "Unable to load listing records.",
      },
      { status: 500 }
    );
  }
}