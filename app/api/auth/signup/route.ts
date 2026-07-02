import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!name || !email || !password) {
      return NextResponse.redirect(new URL("/signup?error=invalid", request.url), {
        status: 303,
      });
    }

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        role: "BUYER" as any,
        passwordHash: password,
      },
      create: {
        name,
        email,
        role: "BUYER" as any,
        passwordHash: password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const response = NextResponse.redirect(
      new URL("/buyer/dashboard", request.url),
      { status: 303 }
    );

    response.cookies.set("noble_user_id", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.redirect(new URL("/signup?error=invalid", request.url), {
      status: 303,
    });
  }
}