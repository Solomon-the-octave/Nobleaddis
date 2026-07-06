import { HelpCircle, LifeBuoy } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatDate(value?: Date | string | null) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

async function getHelpRequestsSafely() {
  try {
    return await prisma.helpRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  } catch {
    return [];
  }
}

export default async function AdminSupportPage() {
  await requireAdmin();

  const helpRequests = await getHelpRequestsSafely();

  return (
    <main className="premium-admin-page">
      <section className="premium-admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-kicker">Support</p>
            <h1 className="admin-page-title">User questions</h1>
            <p className="admin-page-subtitle">
              Review support messages submitted through the Noble Addis help
              page.
            </p>
          </div>
          <LifeBuoy size={30} />
        </div>

        {helpRequests.length === 0 ? (
          <div className="admin-empty-box">
            <HelpCircle size={26} />
            <p>No support requests yet.</p>
          </div>
        ) : (
          <div className="admin-support-list">
            {helpRequests.map((request: any) => (
              <div key={request.id} className="admin-support-item">
                <strong>{request.subject || "Support request"}</strong>
                <span>
                  {request.name || "User"} · {request.email || "No email"} ·{" "}
                  {formatDate(request.createdAt)}
                </span>
                <p>{request.message || "No message provided."}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}