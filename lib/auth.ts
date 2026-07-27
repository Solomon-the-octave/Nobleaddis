import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("noble_user_id")?.value;

  if (!userId) {
    return null;
  }

  const numericUserId = Number(userId);

  if (!numericUserId || Number.isNaN(numericUserId)) {
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
      policyAcceptedAt: true,
    },
  });

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

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }

  return user;
}