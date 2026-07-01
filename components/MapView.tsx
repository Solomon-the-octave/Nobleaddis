type MapViewProps = {
  latitude: number;
  longitude: number;
  location: string;
};

function buildMapUrl(latitude: number, longitude: number) {
  const left = longitude - 0.018;
  const bottom = latitude - 0.014;
  const right = longitude + 0.018;
  const top = latitude + 0.014;

  const bbox = `${left},${bottom},${right},${top}`;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${latitude},${longitude}`;
}

export default function MapView({
  latitude,
  longitude,
  location,
}: MapViewProps) {
  const mapUrl = buildMapUrl(latitude, longitude);

  const openMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <section className="property-area-card">
      <div className="property-area-header">
        <div>
          <p className="section-kicker">Area preview</p>
          <h3>{location}</h3>
          <span>
            Approximate map view based on the area entered in the listing.
          </span>
        </div>

        <span className="area-badge">Area estimate</span>
      </div>

      <div className="property-map-frame">
        <iframe
          title={`Map view for ${location}`}
          src={mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="property-area-details">
        <div>
          <span>Latitude</span>
          <strong>{latitude.toFixed(4)}</strong>
        </div>

        <div>
          <span>Longitude</span>
          <strong>{longitude.toFixed(4)}</strong>
        </div>

        <div>
          <span>Source</span>
          <strong>OpenStreetMap</strong>
        </div>
      </div>

      <a
        className="property-map-link"
        href={openMapUrl}
        target="_blank"
        rel="noreferrer"
      >
        Open larger map
      </a>

      <p className="property-area-note">
        This is not the verified building address. Buyers should still confirm
        the exact location, building access, ownership documents, and viewing
        arrangements before making any payment.
      </p>
    </section>
  );
}