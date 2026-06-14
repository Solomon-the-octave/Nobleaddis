import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

function safeNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return numberValue;
}

function safeString(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value;
}

export async function GET() {
  try {
    const reports = await prisma.propertyReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);

    return NextResponse.json(
      { error: "Failed to fetch reports." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const listedPriceUsd = safeNumber(body.listedPriceUsd);
    const sizeSqm = safeNumber(body.sizeSqm, 100);

    const report = await prisma.propertyReport.create({
      data: {
        location: safeString(body.location, "Addis Ababa"),
        propertyType: safeString(body.propertyType, "Property"),
        listedPriceUsd,
        sizeSqm,
        bedrooms: safeNumber(body.bedrooms),
        bathrooms: safeNumber(body.bathrooms),
        amenitiesCount: safeNumber(body.amenitiesCount),
        completenessScore: safeNumber(body.completenessScore, 0.6),
        description: safeString(body.description, "No description provided."),

        negotiationLow: safeNumber(body.negotiationLow),
        negotiationHigh: safeNumber(body.negotiationHigh),
        estimatedValue: safeNumber(body.estimatedValue),
        priceSignal: safeString(body.priceSignal, "within-range"),
        priceGapPercent: safeNumber(body.priceGapPercent),
        riskLevel: safeString(body.riskLevel, "normal"),
        opportunitySignal: safeString(body.opportunitySignal, "Standard review"),
        opportunityNote: safeString(
          body.opportunityNote,
          "Review the listing before moving forward."
        ),
        explanation: safeString(
          body.explanation,
          "This review is based on available listing fields."
        ),
        pricePerSqm: safeNumber(
          body.pricePerSqm,
          sizeSqm > 0 ? Math.round(listedPriceUsd / sizeSqm) : 0
        ),
        nearbyAveragePrice: safeNumber(body.nearbyAveragePrice),
        nearbyAveragePricePerSqm: safeNumber(body.nearbyAveragePricePerSqm),
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Failed to save report:", error);

    return NextResponse.json(
      { error: "Failed to save report." },
      { status: 500 }
    );
  }
}