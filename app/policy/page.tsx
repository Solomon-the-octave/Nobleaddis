import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ScrollText } from "lucide-react";

import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

type PolicyPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

function getSafeNextPath(value?: string) {
  if (!value || !value.startsWith("/")) {
    return "/evaluate";
  }

  if (value.startsWith("/admin") || value.startsWith("/policy")) {
    return "/evaluate";
  }

  return value;
}

export default async function PolicyPage({ searchParams }: PolicyPageProps) {
  const params = searchParams ? await searchParams : {};
  const nextPath = getSafeNextPath(params.next);

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/policy?next=${nextPath}`)}`);
  }

  if (user.policyAcceptedAt) {
    redirect(nextPath);
  }

  async function acceptPolicyAction(formData: FormData) {
    "use server";

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      redirect("/login");
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { policyAcceptedAt: new Date() },
    });

    redirect(getSafeNextPath(String(formData.get("next") || "")));
  }

  return (
    <main className="clean-page policy-page">
      <section className="policy-card">
        <div className="auth-icon">
          <ScrollText size={24} />
        </div>

        <p className="small-label">Before you continue</p>
        <h1>Noble Addis platform policy</h1>
        <p className="auth-subtitle">
          Please read and accept this policy before checking a property.
          You&apos;ll only need to do this once.
        </p>

        <div className="policy-body">
          <div className="policy-point">
            <h3>Decision support only</h3>
            <p>
              Price estimates, negotiation ranges, and risk signals are
              decision-support tools, not a professional valuation, legal
              opinion, or guarantee of a fair price or a safe transaction.
            </p>
          </div>

          <div className="policy-point">
            <h3>Verify before you pay</h3>
            <p>
              A &quot;normal&quot; or &quot;low caution&quot; result does not
              confirm a listing is genuine. Always verify ownership documents,
              seller identity, exact location, and property condition before
              contacting an agent, visiting a property, or making any payment.
            </p>
          </div>

          <div className="policy-point">
            <h3>Model limitations</h3>
            <p>
              Estimates are based on historical Addis Ababa listing data and
              may not reflect real-time market changes, exact building
              condition, or legal status. Treat every result as a starting
              point for your own research, not a final answer.
            </p>
          </div>

          <div className="policy-point">
            <h3>Your data</h3>
            <p>
              Property details you submit are stored against your account so
              you can review your saved history. Do not enter private seller
              contact details or personal documents into the listing form.
            </p>
          </div>
        </div>

        <form action={acceptPolicyAction} className="policy-form">
          <input type="hidden" name="next" value={nextPath} />

          <label className="policy-checkbox">
            <input type="checkbox" name="accepted" value="yes" required />
            <span>
              I have read this policy and understand Noble Addis results are
              decision-support only.
            </span>
          </label>

          <button type="submit" className="clean-primary-button">
            Accept and continue
          </button>
        </form>

        <Link href="/" className="auth-back-link">
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </section>
    </main>
  );
}
