import { LockKeyhole } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "admin@nobleaddis.com";
const ADMIN_PASSWORD = "nobleaddis123";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

async function adminLoginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "").replace(/\s/g, "");

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    redirect("/admin/login?error=invalid");
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

  const cookieStore = await cookies();

  cookieStore.set("noble_user_id", String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const hasError = params.error === "invalid";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <LockKeyhole size={24} />
        </div>

        <p className="small-label">Admin access</p>
        <h1>Sign in to Noble Addis</h1>
        <p>Access the platform dashboard and review activity.</p>

        <form action={adminLoginAction} className="auth-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              defaultValue="admin@nobleaddis.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              required
            />
          </label>

          <button type="submit">Sign in</button>

          {hasError && (
            <p className="auth-message">
              Invalid admin email or password. Please try again.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}