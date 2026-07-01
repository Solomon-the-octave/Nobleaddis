import { NextResponse } from "next/server";
import { evaluateProperty } from "../../../lib/prediction";
import type { PropertyInput } from "../../../lib/prediction";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL_API_URL =
  process.env.MODEL_API_URL || "http://127.0.0.1:8000/predict";

function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return numberValue;
}

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function getAreaName(location: string) {
  return location.split(",")[0]?.trim() || "Unknown";
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

function validateInput(input: PropertyInput) {
  const errors: string[] = [];

  if (!input.location || input.location.trim().length === 0) {
    errors.push("location");
  }

  if (!input.propertyType || input.propertyType.trim().length === 0) {
    errors.push("property type");
  }

  if (input.listedPriceUsd <= 0) {
    errors.push("listed price");
  }

  if (input.sizeSqm <= 0) {
    errors.push("property size");
  }

  if (input.bedrooms < 0) {
    errors.push("bedrooms");
  }

  if (input.bathrooms < 0) {
    errors.push("bathrooms");
  }

  if (input.amenitiesCount < 0) {
    errors.push("amenities");
  }

  if (input.completenessScore < 0 || input.completenessScore > 1) {
    errors.push("listing completeness");
  }

  return errors;
}

async function getModelPrediction(input: PropertyInput) {
  const coordinates = getLocationCoordinates(input.location);
  const descriptionLength = input.description.trim().length;
  const placeName = getAreaName(input.location);

  const response = await fetch(MODEL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listed_price: input.listedPriceUsd,
      size_sqm: input.sizeSqm,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      image_count: 1,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      floor: 0,
      description_length: descriptionLength,
      completeness_score: input.completenessScore,
      property_type: input.propertyType.toLowerCase(),
      listing_type: "for sale",
      place_name: placeName,
      condition: "Unknown",
      furnishing: "Unknown",
    }),
  });

  if (!response.ok) {
    throw new Error("Model API could not complete the prediction.");
  }

  return response.json();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const input: PropertyInput = {
      location: cleanText(body.location),
      propertyType: cleanText(body.propertyType),
      listedPriceUsd: toNumber(body.listedPriceUsd),
      sizeSqm: toNumber(body.sizeSqm),
      bedrooms: toNumber(body.bedrooms),
      bathrooms: toNumber(body.bathrooms),
      amenitiesCount: toNumber(body.amenitiesCount),
      completenessScore: toNumber(body.completenessScore, 0.5),
      description: cleanText(body.description),
    };

    const errors = validateInput(input);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Some listing details need to be corrected.",
          fields: errors,
        },
        { status: 400 }
      );
    }

    try {
      const modelResult = await getModelPrediction(input);

      return NextResponse.json({
        ...modelResult,
        modelSource: "Trained Noble Addis models using Zenodo Addis Ababa real estate data",
      });
    } catch (modelError) {
      console.error("Model API error. Falling back to local review:", modelError);

      const fallbackResult = evaluateProperty(input);

      return NextResponse.json({
        ...fallbackResult,
        modelSource:
          "Local fallback review. Start the FastAPI model server for trained model results.",
      });
    }
  } catch (error) {
    console.error("Evaluation error:", error);

    return NextResponse.json(
      {
        error:
          "Noble Addis could not complete this listing review. Please check the property details and try again.",
      },
      { status: 500 }
    );
  }
}