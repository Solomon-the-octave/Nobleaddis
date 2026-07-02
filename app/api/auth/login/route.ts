import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUYER_EMAIL = "buyer@nobleaddis.com";
const BUYER_PASSWORD = "buyer123";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user && email === BUYER_EMAIL && password === BUYER_PASSWORD) {
      user = await prisma.user.create({
        data: {
          name: "Noble Addis Buyer",
          email: BUYER_EMAIL,
          role: "BUYER" as any,
          passwordHash: BUYER_PASSWORD,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          passwordHash: true,
        },
      });
    }

    if (!user || user.passwordHash !== password) {
      return NextResponse.redirect(new URL("/login?error=invalid", request.url), {
        status: 303,
      });
    }

    const targetPath = user.role === "ADMIN" ? "/admin" : "/buyer/dashboard";

    const response = NextResponse.redirect(new URL(targetPath, request.url), {
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
    console.error("Buyer login error:", error);

    return NextResponse.redirect(new URL("/login?error=invalid", request.url), {
      status: 303,
    });
  }
}