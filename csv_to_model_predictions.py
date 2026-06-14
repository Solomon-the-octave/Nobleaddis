import pandas as pd
from pathlib import Path

INPUT_FILE = "data/model_predictions_for_web.csv"
OUTPUT_FILE = "lib/modelPredictions.ts"

df = pd.read_csv(INPUT_FILE)

def safe_str(value):
    return str(value).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").strip()

lines = []

lines.append("""export type ModelPrediction = {
  id: number;
  title: string;
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  sizeSqm: number;
  pricePerSqm: number;
  predictedNegotiationReference: number;
  predictedNegotiationLow: number;
  predictedNegotiationHigh: number;
  predictedReviewCategory: "normal" | "medium-risk" | "suspicious";
};

export const modelPredictions: ModelPrediction[] = [
""")

for _, row in df.iterrows():
    lines.append(f"""  {{
    id: {int(row.get("id", 0))},
    title: "{safe_str(row.get("title", ""))}",
    location: "{safe_str(row.get("location", ""))}",
    propertyType: "{safe_str(row.get("property_type", ""))}",
    listedPriceUsd: {int(float(row.get("listed_price_usd", 0)))},
    sizeSqm: {int(float(row.get("size_sqm", 0)))},
    pricePerSqm: {int(float(row.get("price_per_sqm", 0)))},
    predictedNegotiationReference: {int(float(row.get("predicted_negotiation_reference", 0)))},
    predictedNegotiationLow: {int(float(row.get("predicted_negotiation_low", 0)))},
    predictedNegotiationHigh: {int(float(row.get("predicted_negotiation_high", 0)))},
    predictedReviewCategory: "{safe_str(row.get("predicted_review_category", "normal"))}",
  }},
""")

lines.append("""];
""")

Path("lib").mkdir(exist_ok=True)
Path(OUTPUT_FILE).write_text("".join(lines), encoding="utf-8")

print("Created:", OUTPUT_FILE)
print("Rows converted:", len(df))