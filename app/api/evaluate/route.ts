import { NextResponse } from "next/server";
import { evaluateProperty } from "../../../lib/prediction";
import type { PropertyInput } from "../../../lib/prediction";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL_API_URL =
  process.env.MODEL_API_URL || "http://127.0.0.1:8000/predict";

// Render's free tier spins the model API down after inactivity, and a cold
// start can take 30-60+ seconds. Without a bound, a sleeping model API makes
// every check hang instead of falling back to the local review. Bail out
// well before Vercel's own function timeout so the fallback always gets a
// chance to run.
const MODEL_API_TIMEOUT_MS = 6000;

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
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    MODEL_API_TIMEOUT_MS
  );

  try {
    // Field names here must match model_api's PropertyInput schema exactly
    // (model_api/main.py) — it resolves location coordinates itself, so this
    // payload only needs to carry the raw user input, not a duplicated
    // location/coordinates lookup.
    const response = await fetch(MODEL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: input.location,
        propertyType: input.propertyType,
        listedPriceUsd: input.listedPriceUsd,
        sizeSqm: input.sizeSqm,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        amenitiesCount: input.amenitiesCount,
        descriptionLength: input.description.trim().length,
        completenessScore: input.completenessScore,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Model API could not complete the prediction.");
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
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
