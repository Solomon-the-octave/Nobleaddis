import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getSafeNextPath(value?: string) {
  if (!value || !value.startsWith("/")) {
    return "/evaluate";
  }

  if (value.startsWith("/admin")) {
    return "/evaluate";
  }

  return value;
}

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "").trim();
  const nextPath = getSafeNextPath(String(formData.get("next") || ""));

  if (!email || !password) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const user = await prisma.user.findUnique({
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

  if (!user || user.passwordHash !== password) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();

  cookieStore.set("noble_user_id", String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  redirect(nextPath);
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const nextPath = getSafeNextPath(params.next);
  const hasError = params.error === "invalid";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <LockKeyhole size={24} />
        </div>

        <p className="small-label">User access</p>
        <h1>Sign in to Noble Addis</h1>
        <p>Log in to check property prices, review suspicious signals, and save your results.</p>

        <form action={loginAction} className="auth-form">
          <input type="hidden" name="next" value={nextPath} />

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit">Sign in</button>

          {hasError && (
            <p className="auth-message">
              Invalid email or password. Please try again.
            </p>
          )}
        </form>

        <div className="auth-switch">
          <span>New to Noble Addis?</span>
          <Link href={`/signup?next=${encodeURIComponent(nextPath)}`}>
            Create an account
          </Link>
        </div>
      </section>
    </main>
  );
}