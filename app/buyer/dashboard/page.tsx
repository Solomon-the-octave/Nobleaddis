import Link from "next/link";
import { FileText, Home, SearchCheck, CalendarCheck } from "lucide-react";
import { requireRole } from "../../../lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function BuyerDashboardPage() {
  const user = await requireRole([UserRole.BUYER]);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="clean-page">
      <section className="clean-page-header no-line-header">
        <p className="small-label">Buyer dashboard</p>
        <h1>Welcome, {user.name}</h1>
        <p>
          Review listings, save property assessments, and manage viewing
          requests from one place.
        </p>
      </section>

      <section className="dashboard-card-grid">
        <Link href="/evaluate" className="dashboard-action-card">
          <SearchCheck size={24} />
          <h2>Review a listing</h2>
          <p>Check price signals, review status, and recommended next steps.</p>
        </Link>

        <Link href="/reports" className="dashboard-action-card">
          <FileText size={24} />
          <h2>Saved reports</h2>
          <p>View property assessments you have already generated.</p>
        </Link>

        <Link href="/buyer/reservations" className="dashboard-action-card">
          <CalendarCheck size={24} />
          <h2>Viewing requests</h2>
          <p>Track requested viewing slots and reservation status.</p>
        </Link>

        <Link href="/" className="dashboard-action-card">
          <Home size={24} />
          <h2>Public site</h2>
          <p>Return to the main Noble Addis platform.</p>
        </Link>
      </section>
    </main>
  );
}