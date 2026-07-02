import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "admin@nobleaddis.com";
const ADMIN_PASSWORD = "nobleaddis123";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") || "")
      .replace(/\s/g, "");

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.redirect(
        new URL("/admin/login?error=invalid", request.url),
        { status: 303 }
      );
    }

    const user = await prisma.user.upsert({
      where: {
        email: ADMIN_EMAIL,
      },
      update: {
        name: "Noble Addis Admin",
        role: "ADMIN" as any,
        passwordHash: ADMIN_PASSWORD,
      },
      create: {
        name: "Noble Addis Admin",
        email: ADMIN_EMAIL,
        role: "ADMIN" as any,
        passwordHash: ADMIN_PASSWORD,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const response = NextResponse.redirect(new URL("/admin", request.url), {
      status: 303,
    });

    response.cookies.set("noble_user_id", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.redirect(
      new URL("/admin/login?error=invalid", request.url),
      { status: 303 }
    );
  }
}