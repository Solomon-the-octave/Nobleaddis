import PropertyForm from "../../components/PropertyForm";

export default function EvaluatePage() {
  return (
    <main className="clean-page">
      <section className="clean-page-header no-line-header">
        <p className="small-label">Listing review</p>
        <h1>Evaluate a property listing</h1>
        <p>
          Select a listing, review the details, and generate a buyer-side
          property assessment.
        </p>
      </section>

      <PropertyForm />
    </main>
  );
}