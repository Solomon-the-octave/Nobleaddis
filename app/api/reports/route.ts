import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return numberValue;
}

function safeString(value: unknown, fallback = "") {
  const stringValue = String(value ?? "").trim();

  if (!stringValue) {
    return fallback;
  }

  return stringValue;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    const reports = await prisma.evaluationReport.findMany({
      where: user?.role === "BUYER" ? { userId: user.id } : undefined,
      include: {
        listing: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Failed to fetch reports:", error);

    return NextResponse.json(
      {
        reports: [],
        message: "Noble Addis could not fetch saved reports.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const listedPriceUsd = safeNumber(body.listedPriceUsd);
    const sizeSqm = safeNumber(body.sizeSqm, 100);
    const listingId = body.listingId ? safeNumber(body.listingId) : null;

    const report = await prisma.evaluationReport.create({
      data: {
        userId: user?.id ?? null,
        listingId: listingId && listingId > 0 ? listingId : null,

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
        opportunitySignal: safeString(
          body.opportunitySignal,
          "Review details"
        ),
        opportunityNote: safeString(
          body.opportunityNote,
          "Review listing details before moving forward."
        ),
        explanation: safeString(
          body.explanation,
          "This assessment is based on available listing fields."
        ),
        pricePerSqm: safeNumber(
          body.pricePerSqm,
          sizeSqm > 0 ? Math.round(listedPriceUsd / sizeSqm) : 0
        ),
        nearbyAveragePrice: safeNumber(body.nearbyAveragePrice),
        nearbyAveragePricePerSqm: safeNumber(body.nearbyAveragePricePerSqm),
        modelSource: body.modelSource
          ? safeString(body.modelSource)
          : undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        report,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save report:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Noble Addis could not save this report.",
      },
      { status: 500 }
    );
  }
}