import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("noble_user_id")?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
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
