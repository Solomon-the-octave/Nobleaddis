type LayoutSuggestionProps = {
  propertyType: string;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
};

function getDevelopmentPotential(
  propertyType: string,
  sizeSqm: number,
  bedrooms: number,
  bathrooms: number
) {
  if (propertyType === "Land") {
    if (sizeSqm >= 300) {
      return {
        title: "Strong development potential",
        ideas: [
          "Possible use: residential units, mixed-use rental block, or commercial frontage depending on zoning.",
          "Suggested layout: 3–4 bedroom main house, parking, service area, and small garden/courtyard.",
          "Next check: road access, water, electricity, title/ownership documents, and local building rules.",
        ],
      };
    }

    if (sizeSqm >= 150) {
      return {
        title: "Moderate development potential",
        ideas: [
          "Possible use: compact family home, small rental units, or long-term holding.",
          "Suggested layout: 2–3 bedrooms, open living/dining area, kitchen, 2 bathrooms, and limited parking.",
          "Next check: plot shape, access road, drainage, utilities, and zoning restrictions.",
        ],
      };
    }

    return {
      title: "Limited development potential",
      ideas: [
        "Possible use: compact unit, extension project, or strategic holding depending on location.",
        "Suggested layout: 1–2 bedroom unit with basic living, kitchen, and service area.",
        "Next check: exact plot dimensions and legal buildability.",
      ],
    };
  }

  if (propertyType === "Apartment" || propertyType === "Condo") {
    return {
      title: "Apartment layout potential",
      ideas: [
        `Suggested layout: ${bedrooms} bedroom(s), ${bathrooms} bathroom(s), open living/dining area, kitchen, and balcony or utility space where possible.`,
        "Improvement focus: natural light, storage, ventilation, and quality of shared building services.",
        "Next check: building condition, service fees, parking, access, and neighborhood rental demand.",
      ],
    };
  }

  if (propertyType === "House" || propertyType === "Villa") {
    return {
      title: "Residential layout potential",
      ideas: [
        `Suggested layout: living room, dining area, kitchen, ${bedrooms} bedroom(s), ${bathrooms} bathroom(s), parking, and outdoor utility space.`,
        "Improvement focus: room flow, parking, compound size, security, and possible rental or family use.",
        "Next check: land documents, building condition, water supply, road access, and renovation needs.",
      ],
    };
  }

  return {
    title: "Property use potential",
    ideas: [
      "Suggested use should be checked against size, access, zoning, and surrounding market activity.",
      "Improvement focus: access, visibility, layout efficiency, utilities, and maintenance condition.",
      "Next check: ownership records, location demand, and comparable properties nearby.",
    ],
  };
}

export default function LayoutSuggestion({
  propertyType,
  sizeSqm,
  bedrooms,
  bathrooms,
  location,
}: LayoutSuggestionProps) {
  const potential = getDevelopmentPotential(
    propertyType,
    sizeSqm,
    bedrooms,
    bathrooms
  );

  return (
    <section className="layout-panel">
      <h3>Property and land potential</h3>
      <p className="result-note">
        Based on the property type, size, and location, Noble Addis gives an
        early-use idea. This is not an architectural plan, but it helps the buyer
        think through development or layout potential.
      </p>

      <div className="suggestion-list">
        <div className="suggestion-item">
          <strong>{potential.title}</strong>
          <p className="result-note">
            Location context: {location} should be checked for road access,
            utilities, zoning, neighborhood demand, and future development trends.
          </p>
        </div>

        {potential.ideas.map((idea) => (
          <div className="suggestion-item" key={idea}>
            {idea}
          </div>
        ))}
      </div>
    </section>
  );
}