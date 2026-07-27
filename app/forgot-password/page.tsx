"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, KeyRound, LockKeyhole } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Password reset failed.");
        setMessageType("error");
        return;
      }

      setMessage(data.message || "Password updated successfully.");
      setMessageType("success");

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card password-reset-card">
        <div className="auth-icon">
          <LockKeyhole size={24} />
        </div>

        <p className="small-label">Account recovery</p>

        <h1>Reset your password</h1>

        <p className="auth-subtitle">
          Enter your account email and create a new password.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            New password
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            <KeyRound size={18} />
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>

        {message && (
          <div
            className={
              messageType === "success"
                ? "auth-message auth-message-success"
                : "auth-message auth-message-error"
            }
          >
            {message}
          </div>
        )}

        <Link href="/login" className="auth-back-link">
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}