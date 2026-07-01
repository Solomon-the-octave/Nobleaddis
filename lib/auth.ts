import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("noble_user_id")?.value;

  if (!userId) {
    return null;
  }

  const numericUserId = Number(userId);

  if (Number.isNaN(numericUserId)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: numericUserId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/admin/login");
  }

  return user;
}

export async function setUserSession(userId: number) {
  const cookieStore = await cookies();

  cookieStore.set("noble_user_id", String(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();

  cookieStore.delete("noble_user_id");
}