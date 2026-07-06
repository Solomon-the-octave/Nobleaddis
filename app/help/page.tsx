"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
} from "lucide-react";

type HelpForm = {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
};

const initialForm: HelpForm = {
  name: "",
  email: "",
  category: "Property check",
  subject: "",
  message: "",
};

const helpTopics = [
  {
    icon: ShieldCheck,
    title: "Property check",
    text: "Questions about price signals, risk levels, or buyer guidance.",
  },
  {
    icon: MapPin,
    title: "Location issue",
    text: "Problems with selected areas, landmarks, or map preview.",
  },
  {
    icon: MessageSquare,
    title: "History support",
    text: "Help with saved property checks or account history.",
  },
];

export default function HelpPage() {
  const [form, setForm] = useState<HelpForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  function updateField(field: keyof HelpForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatusMessage("");
    setStatusType("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatusType("error");
      setStatusMessage("Please add your name, email, and message.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          category: form.category,
          subject: form.subject || form.category,
          message: form.message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStatusType("error");
        setStatusMessage(
          data?.message || "Your request could not be sent. Please try again."
        );
        return;
      }

      setStatusType("success");
      setStatusMessage("Your request has been sent.");
      setForm(initialForm);
    } catch (error) {
      console.error("Help request error:", error);
      setStatusType("error");
      setStatusMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="help-page">
      <section className="help-hero">
        <div>
          <p className="small-label">Help center</p>
          <h1>Get support with Noble Addis.</h1>
          <p>
            Send a question about property checks, map locations, saved history,
            or suspicious listing signals.
          </p>
        </div>

        <div className="help-hero-card">
          <HelpCircle size={30} />
          <h3>Buyer reminder</h3>
          <p>
            Noble Addis gives an early review. Always verify documents, seller
            identity, exact location, and property condition before payment.
          </p>
        </div>
      </section>

      <section className="help-content-grid">
        <div className="help-left-column">
          <div className="help-topic-grid">
            {helpTopics.map((topic) => {
              const Icon = topic.icon;

              return (
                <article key={topic.title} className="help-topic-card">
                  <div>
                    <Icon size={24} />
                  </div>
                  <h3>{topic.title}</h3>
                  <p>{topic.text}</p>
                </article>
              );
            })}
          </div>

          <div className="help-note-card">
            <div className="help-note-icon">
              <Mail size={22} />
            </div>

            <div>
              <h3>Support requests</h3>
              <p>
                Submitted messages are saved so the admin can review and follow
                up where needed.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="help-form-card">
          <div className="help-form-header">
            <div>
              <p className="section-kicker">Contact support</p>
              <h2>Send a request</h2>
            </div>
            <Send size={24} />
          </div>

          <div className="help-form-grid">
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
              >
                <option>Property check</option>
                <option>Map or location</option>
                <option>History</option>
                <option>Account</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Subject
              <input
                value={form.subject}
                onChange={(event) =>
                  updateField("subject", event.target.value)
                }
                placeholder="Short subject"
              />
            </label>
          </div>

          <label>
            Message
            <textarea
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Write your message..."
            />
          </label>

          <button type="submit" className="help-submit-button">
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send size={18} />
                Send request
              </>
            )}
          </button>

          {statusMessage && (
            <div className={`help-status ${statusType}`}>
              {statusType === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <HelpCircle size={18} />
              )}
              <span>{statusMessage}</span>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}