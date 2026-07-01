"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle,
  FileWarning,
  HelpCircle,
  Mail,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

type HelpFormState = {
  name: string;
  email: string;
  phone: string;
  issueType: string;
  location: string;
  listingName: string;
  message: string;
};

const defaultForm: HelpFormState = {
  name: "",
  email: "",
  phone: "",
  issueType: "REVIEW_EXPLANATION",
  location: "",
  listingName: "",
  message: "",
};

const issueTypes = [
  {
    label: "Understand a review",
    value: "REVIEW_EXPLANATION",
    icon: HelpCircle,
  },
  {
    label: "Report suspicious listing",
    value: "SUSPICIOUS_LISTING",
    icon: FileWarning,
  },
  {
    label: "Verify a property",
    value: "PROPERTY_VERIFICATION",
    icon: ShieldCheck,
  },
  {
    label: "Report wrong information",
    value: "WRONG_INFORMATION",
    icon: SearchCheck,
  },
];

export default function HelpPage() {
  const [form, setForm] = useState<HelpFormState>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function updateField<K extends keyof HelpFormState>(
    key: K,
    value: HelpFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setStatusMessage("");
    setIsError(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatusMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not submit request.");
      }

      setStatusMessage(
        `Request received. Your reference number is #${data.helpRequestId}.`
      );

      setForm(defaultForm);
    } catch (error) {
      setIsError(true);

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not submit your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="support-page">
      <section className="support-hero">
        <div>
          <p className="support-label">Noble Addis Support</p>
          <h1>Get a second check before you move forward.</h1>
          <p>
            Use support when a listing feels unclear, the review result needs
            explaining, or you want help knowing what to verify before calling,
            visiting, negotiating, or paying.
          </p>
        </div>

        <div className="support-response-card">
          <Mail size={24} />
          <span>Support request</span>
          <strong>We review the issue and guide your next step.</strong>
          <p>
            Best for suspicious listings, unclear price signals, missing
            property details, and verification questions.
          </p>
        </div>
      </section>

      <section className="support-issue-strip">
        {issueTypes.map((issue) => {
          const Icon = issue.icon;
          const active = form.issueType === issue.value;

          return (
            <button
              key={issue.value}
              type="button"
              className={
                active ? "support-issue-card active" : "support-issue-card"
              }
              onClick={() => updateField("issueType", issue.value)}
            >
              <Icon size={20} />
              <span>{issue.label}</span>
            </button>
          );
        })}
      </section>

      <section className="support-layout">
        <form className="support-form" onSubmit={handleSubmit}>
          <div className="support-form-heading">
            <MessageCircle size={24} />
            <div>
              <h2>Send a request</h2>
              <p>Share the listing and what you need help with.</p>
            </div>
          </div>

          <div className="support-input-grid">
            <label>
              Full name
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Phone number
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="Optional"
              />
            </label>

            <label>
              Area / location
              <input
                value={form.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="Example: Bole"
              />
            </label>
          </div>

          <label>
            Listing name
            <input
              value={form.listingName}
              onChange={(event) =>
                updateField("listingName", event.target.value)
              }
              placeholder="Example: 2-bedroom apartment in Bole"
            />
          </label>

          <label>
            Message
            <textarea
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Explain what looks unclear or what you want verified..."
              rows={6}
            />
          </label>

          <button
            type="submit"
            className="support-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting request..." : "Submit support request"}
          </button>

          {statusMessage && (
            <div className={isError ? "support-status error" : "support-status"}>
              {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              <span>{statusMessage}</span>
            </div>
          )}
        </form>

        <aside className="support-guide">
          <div className="support-guide-card dark">
            <ShieldCheck size={24} />
            <h3>Before you pay</h3>
            <p>
              Always confirm the exact property location, ownership documents,
              seller identity, and viewing arrangements before making any
              payment.
            </p>
          </div>

          <div className="support-guide-card">
            <h3>What happens next?</h3>

            <div className="support-steps">
              <div>
                <span>1</span>
                <p>Your request is saved in Noble Addis.</p>
              </div>

              <div>
                <span>2</span>
                <p>The issue is reviewed based on the listing details.</p>
              </div>

              <div>
                <span>3</span>
                <p>You get a clearer next step before moving forward.</p>
              </div>
            </div>
          </div>

          <div className="support-note-card">
            <strong>Good request example</strong>
            <p>
              “The Bole apartment result says high caution. The price looks low
              and the listing has few details. What should I verify first?”
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}