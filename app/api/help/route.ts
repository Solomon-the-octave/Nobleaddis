import { NextResponse } from "next/server";
import { HelpRequestType } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const validIssueTypes = new Set(Object.values(HelpRequestType));

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const phone = cleanText(body.phone);
    const location = cleanText(body.location);
    const listingName = cleanText(body.listingName);
    const message = cleanText(body.message);
    const issueType = cleanText(body.issueType) as HelpRequestType;

    if (!name || !email || !issueType || !message) {
      return NextResponse.json(
        {
          error: "Please fill in your name, email, issue type, and message.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!validIssueTypes.has(issueType)) {
      return NextResponse.json(
        {
          error: "Please select a valid help request type.",
        },
        { status: 400 }
      );
    }

    const helpRequest = await prisma.helpRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        issueType,
        location: location || null,
        listingName: listingName || null,
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        helpRequestId: helpRequest.id,
        message: "Your request has been received.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Help request error:", error);

    return NextResponse.json(
      {
        error:
          "Noble Addis could not submit your request. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}