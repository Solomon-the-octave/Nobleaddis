"use client";

import { useEffect, useState } from "react";
import { Home, ShieldCheck, TrendingUp } from "lucide-react";

const slides = [
  {
    eyebrow: "Step 1",
    title: "Enter listing details",
    description:
      "Add the property location, type, listed price, size, bedrooms, bathrooms, amenities, and a short description.",
    icon: Home,
    rows: [
      ["Location", "Bole"],
      ["Property type", "Apartment"],
      ["Size", "95 sqm"],
    ],
  },
  {
    eyebrow: "Step 2",
    title: "Estimate fair value",
    description:
      "The platform compares the listing information with trained Addis Ababa property data to estimate a fair property value.",
    icon: TrendingUp,
    rows: [
      ["Listed price", "ETB 1,850,000"],
      ["Estimated value", "ETB 1,914,721"],
      ["Price signal", "Within range"],
    ],
  },
  {
    eyebrow: "Step 3",
    title: "Review buyer guidance",
    description:
      "Noble Addis shows the suspicion level and gives simple guidance on what the buyer should verify before moving forward.",
    icon: ShieldCheck,
    rows: [
      ["Suspicion level", "Looks reasonable"],
      ["Price gap", "-3.4%"],
      ["Next step", "Verify documents"],
    ],
  },
];

export default function HeroShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[activeSlide];
  const Icon = slide.icon;

  return (
    <div className="hero-showcase">
      <div className="hero-showcase-card">
        <div className="hero-showcase-header">
          <div className="hero-showcase-icon">
            <Icon size={24} strokeWidth={2.4} />
          </div>

          <div>
            <p>{slide.eyebrow}</p>
            <h3>{slide.title}</h3>
          </div>
        </div>

        <p className="hero-showcase-description">{slide.description}</p>

        <div className="hero-showcase-rows">
          {slide.rows.map(([label, value]) => (
            <div key={label} className="hero-showcase-row">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="hero-showcase-dots">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show ${item.title}`}
              onClick={() => setActiveSlide(index)}
              className={
                activeSlide === index
                  ? "hero-showcase-dot hero-showcase-dot-active"
                  : "hero-showcase-dot"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}