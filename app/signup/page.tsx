import Link from "next/link";
import { UserPlus } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

type SignupPageProps = {
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

async function signupAction(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();
  const nextPath = getSafeNextPath(String(formData.get("next") || ""));

  if (!name || !email || !password || password !== confirmPassword) {
    redirect(`/signup?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    redirect(`/signup?error=exists&next=${encodeURIComponent(nextPath)}`);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: password,
      role: "BUYER" as any,
    },
    select: {
      id: true,
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

  redirect(nextPath);
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : {};
  const nextPath = getSafeNextPath(params.next);
  const error = params.error;

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <UserPlus size={24} />
        </div>

        <p className="small-label">Create account</p>
        <h1>Join Noble Addis</h1>
        <p>Create an account to check listings and save your property reviews.</p>

        <form action={signupAction} className="auth-form">
          <input type="hidden" name="next" value={nextPath} />

          <label>
            Full name
            <input name="name" placeholder="Your name" required />
          </label>

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
              placeholder="Create a password"
              required
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              required
            />
          </label>

          <button type="submit">Create account</button>

          {error === "invalid" && (
            <p className="auth-message">
              Please complete all fields and make sure both passwords match.
            </p>
          )}

          {error === "exists" && (
            <p className="auth-message">
              An account with this email already exists. Please sign in instead.
            </p>
          )}
        </form>

        <div className="auth-switch">
          <span>Already have an account?</span>
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}