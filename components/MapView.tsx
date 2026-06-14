type MapViewProps = {
  latitude: number;
  longitude: number;
  location: string;
  propertyType?: string;
  sizeSqm?: number;
};

export default function MapView({
  latitude,
  longitude,
  location,
}: MapViewProps) {
  const bbox = `${longitude - 0.012},${latitude - 0.012},${longitude + 0.012},${
    latitude + 0.012
  }`;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <section className="map-panel">
      <h3>Live location view</h3>

      <p className="result-note">
        Approximate property area shown for {location}. This map is for location
        context only. The development concept is shown separately below as a
        planning preview.
      </p>

      <iframe
        title={`Map view for ${location}`}
        className="map-frame"
        src={mapUrl}
        loading="lazy"
      />

      <p className="result-note">
        Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </p>
    </section>
  );
}