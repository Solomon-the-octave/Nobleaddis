import csv
import json
from pathlib import Path

INPUT_FILE = Path("data/noble_addis_kaggle_rental_predictions.csv")
OUTPUT_FILE = Path("lib/kaggleRentalPredictions.ts")

def clean_text(value):
    return str(value or "").strip()

def to_number(value):
    try:
        return float(value)
    except:
        return 0

records = []

with INPUT_FILE.open("r", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for index, row in enumerate(reader):
        records.append({
            "id": index + 1,
            "city": clean_text(row.get("city")),
            "areaLocality": clean_text(row.get("area_locality")),
            "bhk": int(to_number(row.get("bhk"))),
            "size": int(to_number(row.get("size"))),
            "bathroom": int(to_number(row.get("bathroom"))),
            "rent": round(to_number(row.get("rent"))),
            "predictedRent": round(to_number(row.get("predicted_rent"))),
            "predictedRentLow": round(to_number(row.get("predicted_rent_low"))),
            "predictedRentHigh": round(to_number(row.get("predicted_rent_high"))),
            "reviewCategory": clean_text(row.get("review_category")),
            "predictedReviewCategory": clean_text(row.get("predicted_review_category")),
            "completenessScore": round(to_number(row.get("completeness_score")), 2),
            "furnishingStatus": clean_text(row.get("furnishing_status")),
            "tenantPreferred": clean_text(row.get("tenant_preferred")),
            "pointOfContact": clean_text(row.get("point_of_contact")),
        })

OUTPUT_FILE.write_text(
    "export type KaggleRentalPrediction = {\n"
    "  id: number;\n"
    "  city: string;\n"
    "  areaLocality: string;\n"
    "  bhk: number;\n"
    "  size: number;\n"
    "  bathroom: number;\n"
    "  rent: number;\n"
    "  predictedRent: number;\n"
    "  predictedRentLow: number;\n"
    "  predictedRentHigh: number;\n"
    "  reviewCategory: string;\n"
    "  predictedReviewCategory: string;\n"
    "  completenessScore: number;\n"
    "  furnishingStatus: string;\n"
    "  tenantPreferred: string;\n"
    "  pointOfContact: string;\n"
    "};\n\n"
    "export const kaggleRentalPredictions: KaggleRentalPrediction[] = " +
    json.dumps(records[:500], indent=2) +
    ";\n",
    encoding="utf-8"
)

print(f"Converted {len(records)} records")
print(f"Saved first 500 records to {OUTPUT_FILE}")