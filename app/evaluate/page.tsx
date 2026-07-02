import Link from "next/link";
import { LockKeyhole, LogIn, UserPlus } from "lucide-react";
import PropertyForm from "../../components/PropertyForm";
import { getCurrentUser } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function EvaluatePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="clean-page evaluate-page">
        <section className="auth-required-card">
          <div className="auth-icon">
            <LockKeyhole size={24} />
          </div>

          <p className="small-label">Account required</p>
          <h1>Sign in to check a property</h1>
          <p>
            Create an account or sign in to use the Noble Addis price prediction
            and suspicious listing review tool.
          </p>

          <div className="auth-required-actions">
            <Link href="/login?next=/evaluate" className="clean-primary-button">
              <LogIn size={17} />
              Sign in
            </Link>

            <Link
              href="/signup?next=/evaluate"
              className="clean-secondary-button"
            >
              <UserPlus size={17} />
              Create account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="clean-page evaluate-page">
      <PropertyForm />
    </main>
  );
}