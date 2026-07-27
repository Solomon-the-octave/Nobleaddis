import { MessageSquareHeart, Star } from "lucide-react";

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

async function getFeedbackSafely() {
  try {
    return await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminFeedbackPage() {
  await requireAdmin();

  const feedback = await getFeedbackSafely();

  const averageRating =
    feedback.length > 0
      ? feedback.reduce((total, item) => total + item.rating, 0) /
        feedback.length
      : 0;

  return (
    <main className="premium-admin-page">
      <section className="premium-admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-kicker">Feedback</p>
            <h1 className="admin-page-title">User ratings</h1>
            <p className="admin-page-subtitle">
              Review how buyers rate their experience after checking a
              property.
            </p>
          </div>
          <MessageSquareHeart size={30} />
        </div>

        <div className="admin-summary-grid admin-feedback-summary">
          <div className="admin-summary-card">
            <span>Average rating</span>
            <strong>
              {feedback.length > 0 ? averageRating.toFixed(1) : "No ratings yet"}
            </strong>
          </div>

          <div className="admin-summary-card">
            <span>Total ratings</span>
            <strong>{feedback.length}</strong>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="admin-empty-box">
            <Star size={26} />
            <p>No ratings submitted yet.</p>
          </div>
        ) : (
          <div className="admin-support-list">
            {feedback.map((item) => (
              <div key={item.id} className="admin-support-item">
                <strong className="admin-feedback-stars">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </strong>
                <span>
                  {item.user?.name || "Anonymous"} ·{" "}
                  {item.user?.email || "No account"} ·{" "}
                  {formatDate(item.createdAt)}
                </span>
                {item.comment && <p>{item.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
