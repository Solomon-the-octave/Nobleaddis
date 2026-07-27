"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";

export default function RatingWidget() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating < 1) {
      setStatus("error");
      setMessage("Please select a star rating first.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Could not submit your rating.");
        return;
      }

      setStatus("done");
      setMessage(data.message || "Thanks for your feedback.");
    } catch {
      setStatus("error");
      setMessage("Could not submit your rating. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rating-widget rating-widget-done">
        <ThumbsUp size={22} />
        <div>
          <h3>Thanks for rating your experience.</h3>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <form className="rating-widget" onSubmit={handleSubmit}>
      <p className="small-label">Rate your experience</p>
      <h3>How useful was this property review?</h3>

      <div className="rating-stars" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = value <= (hoverRating || rating);

          return (
            <button
              key={value}
              type="button"
              className={filled ? "rating-star rating-star-filled" : "rating-star"}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={value === rating}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
            >
              <Star size={22} fill={filled ? "currentColor" : "none"} />
            </button>
          );
        })}
      </div>

      <textarea
        className="rating-comment"
        placeholder="Optional: tell us what worked or what felt off (optional)"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={1000}
      />

      {status === "error" && <p className="rating-error">{message}</p>}

      <button
        type="submit"
        className="clean-primary-button"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Submit rating"}
      </button>
    </form>
  );
}
