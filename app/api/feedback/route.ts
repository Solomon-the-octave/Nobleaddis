import { NextResponse } from "next/server";

import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rating = Number(body.rating);
    const comment = cleanText(body.comment).slice(0, 1000);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please choose a rating between 1 and 5." },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    const feedback = await prisma.feedback.create({
      data: {
        userId: user?.id ?? null,
        rating,
        comment: comment || null,
      },
    });

    return NextResponse.json({
      message: "Thanks for rating your experience.",
      feedback: {
        id: feedback.id,
        rating: feedback.rating,
      },
    });
  } catch (error) {
    console.error("Feedback submission error:", error);

    return NextResponse.json(
      { error: "Could not submit your rating right now. Please try again." },
      { status: 500 }
    );
  }
}
