type DevelopmentPreviewProps = {
  propertyType: string;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  imageUrl: string;
};

function isLand(propertyType: string) {
  return propertyType.toLowerCase() === "land";
}

export default function DevelopmentPreview({
  propertyType,
  sizeSqm,
  bedrooms,
  bathrooms,
  location,
  imageUrl,
}: DevelopmentPreviewProps) {
  const landMode = isLand(propertyType);

  return (
    <section className="listing-evidence-section">
      <div className="listing-evidence-header">
        <div>
          <p className="section-kicker">Listing evidence</p>
          <h3>Property media and verification review</h3>
          <span>
            This section uses the collected listing image and basic property
            details to support first-level review.
          </span>
        </div>

        <div className="evidence-badge">
          {landMode ? "Land listing" : "Built property"}
        </div>
      </div>

      <div className="listing-evidence-grid">
        <div className="listing-photo-card">
          <img src={imageUrl} alt={`${propertyType} listing in ${location}`} />

          <div className="listing-photo-content">
            <h4>
              {propertyType} in {location}
            </h4>

            <p>
              Image collected from the listing source for academic MVP
              demonstration. Private seller details are excluded.
            </p>
          </div>
        </div>

        <div className="listing-facts-card">
          <div className="facts-header">
            <h4>Listing facts</h4>
            <span>{propertyType}</span>
          </div>

          <div className="facts-grid">
            <div>
              <small>Location</small>
              <strong>{location}</strong>
            </div>

            <div>
              <small>Size</small>
              <strong>{sizeSqm} sqm</strong>
            </div>

            {!landMode && (
              <>
                <div>
                  <small>Bedrooms</small>
                  <strong>{bedrooms}</strong>
                </div>

                <div>
                  <small>Bathrooms</small>
                  <strong>{bathrooms}</strong>
                </div>
              </>
            )}

            {landMode && (
              <>
                <div>
                  <small>Use case</small>
                  <strong>Plot review</strong>
                </div>

                <div>
                  <small>Review type</small>
                  <strong>Location + size</strong>
                </div>
              </>
            )}
          </div>

          <div className="verification-list">
            <h5>Recommended checks</h5>

            <div className="verification-row">
              <span />
              <p>Compare price per sqm with similar listings in the same area.</p>
            </div>

            <div className="verification-row">
              <span />
              <p>Confirm exact location before negotiation or site visit.</p>
            </div>

            <div className="verification-row">
              <span />
              <p>Request ownership documents before making any payment.</p>
            </div>

            <div className="verification-row">
              <span />
              <p>Check whether listing details match the property image.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="evidence-note">
        This is not a final valuation or legal verification. It is a first-level
        review layer to help remote buyers decide whether a listing deserves
        further due diligence.
      </div>
    </section>
  );
}
