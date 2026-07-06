from pathlib import Path
from typing import Any, Dict, List

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel


BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

PRICE_MODEL_PATH = MODELS_DIR / "price_model.pkl"
RISK_MODEL_PATH = MODELS_DIR / "risk_model.pkl"


# Compatibility patch for models exported from Colab/scikit-learn.
# This prevents the _RemainderColsList loading error.
try:
    import sklearn.compose._column_transformer as column_transformer_module

    if not hasattr(column_transformer_module, "_RemainderColsList"):
        class _RemainderColsList(list):
            pass

        column_transformer_module._RemainderColsList = _RemainderColsList
except Exception:
    pass


price_model = joblib.load(PRICE_MODEL_PATH)
risk_model = joblib.load(RISK_MODEL_PATH)

app = FastAPI(title="Noble Addis Model API")


class PropertyInput(BaseModel):
    location: str = "Bole"
    propertyType: str = "Apartment"
    listedPriceUsd: float = 1850000
    sizeSqm: float = 95
    bedrooms: int = 2
    bathrooms: int = 2
    amenitiesCount: int = 5
    descriptionLength: int = 120
    completenessScore: float = 0.85


LOCATION_COORDS: Dict[str, Dict[str, float]] = {
    "Bole": {"latitude": 8.9806, "longitude": 38.7578},
    "CMC": {"latitude": 9.0300, "longitude": 38.8300},
    "Ayat": {"latitude": 9.0308, "longitude": 38.8670},
    "Summit": {"latitude": 9.0360, "longitude": 38.8540},
    "Gerji": {"latitude": 9.0064, "longitude": 38.8108},
    "Megenagna": {"latitude": 9.0192, "longitude": 38.8021},
    "Piassa": {"latitude": 9.0350, "longitude": 38.7500},
    "Saris": {"latitude": 8.9390, "longitude": 38.7420},
    "Kality": {"latitude": 8.8910, "longitude": 38.7890},
}


def normalize_property_type(property_type: str) -> str:
    property_type = (property_type or "Apartment").strip()

    mapping = {
        "Apartment": "Apartment",
        "House": "House",
        "Condo": "Condo",
        "Villa": "Villa",
        "Commercial": "Commercial",
        "Warehouse": "Warehouse",
    }

    return mapping.get(property_type, "Apartment")


def get_location_coordinates(location: str) -> Dict[str, float]:
    return LOCATION_COORDS.get(location, LOCATION_COORDS["Bole"])


def build_price_features(data: PropertyInput) -> pd.DataFrame:
    coords = get_location_coordinates(data.location)

    row = {
        "property_type": normalize_property_type(data.propertyType),
        "listing_type": "sale",
        "size_sqm": float(data.sizeSqm),
        "latitude": coords["latitude"],
        "longitude": coords["longitude"],
        "bathrooms": int(data.bathrooms),
        "bedrooms": int(data.bedrooms),
        "image_count": int(max(data.amenitiesCount, 1)),
        "description_length": int(data.descriptionLength),
        "has_image": True,
        "completeness_score": float(data.completenessScore),
        "condition": "good",
        "furnishing": "unknown",
    }

    return pd.DataFrame([row])


def build_risk_features(data: PropertyInput) -> pd.DataFrame:
    coords = get_location_coordinates(data.location)

    listed_price = float(data.listedPriceUsd)
    size_sqm = max(float(data.sizeSqm), 1)
    price_per_sqm = listed_price / size_sqm

    row = {
        "listed_price": listed_price,
        "price_sqm": price_per_sqm,
        "price_per_sqm": price_per_sqm,
        "property_type": normalize_property_type(data.propertyType),
        "listing_type": "sale",
        "size_sqm": size_sqm,
        "latitude": coords["latitude"],
        "longitude": coords["longitude"],
        "bathrooms": int(data.bathrooms),
        "bedrooms": int(data.bedrooms),
        "image_count": int(max(data.amenitiesCount, 1)),
        "description_length": int(data.descriptionLength),
        "has_image": True,
        "completeness_score": float(data.completenessScore),
        "condition": "good",
        "furnishing": "unknown",
    }

    return pd.DataFrame([row])


def clean_price_signal(price_gap_percent: float) -> str:
    if price_gap_percent > 20:
        return "overpriced"

    if price_gap_percent < -20:
        return "underpriced"

    return "within-range"


def normalize_risk_prediction(prediction: Any, price_gap_percent: float) -> str:
    raw = str(prediction).lower().strip()

    if raw in ["1", "true", "suspicious", "high", "high-risk", "high caution"]:
        return "suspicious"

    if raw in ["medium", "medium-risk", "needs-review", "needs review"]:
        return "medium-risk"

    if abs(price_gap_percent) > 20:
        return "medium-risk"

    return "normal"


def build_risk_factors(
    risk_level: str,
    price_signal: str,
    completeness_score: float,
) -> List[str]:
    factors: List[str] = []

    if price_signal == "overpriced":
        factors.append("The listed price is much higher than the estimated value.")

    if price_signal == "underpriced":
        factors.append("The listed price is much lower than the estimated value.")

    if completeness_score < 0.7:
        factors.append("The listing details are incomplete.")

    if risk_level == "suspicious":
        factors.append("Verify ownership documents and seller identity before payment.")

    if not factors:
        factors.append("Confirm ownership documents, exact location, and seller identity.")

    return factors


@app.get("/")
def root() -> Dict[str, Any]:
    return {
        "message": "Noble Addis model API is running",
        "models": ["price_model", "risk_model"],
    }


@app.post("/predict")
def predict(data: PropertyInput) -> Dict[str, Any]:
    price_features = build_price_features(data)

    try:
        estimated_value = float(price_model.predict(price_features)[0])
    except Exception as error:
        print("Price prediction error:", error)
        estimated_value = float(data.listedPriceUsd)

    estimated_value = max(estimated_value, 0)

    listed_price = float(data.listedPriceUsd)

    if estimated_value > 0:
        price_gap_percent = ((listed_price - estimated_value) / estimated_value) * 100
    else:
        price_gap_percent = 0

    negotiation_low = estimated_value * 0.92
    negotiation_high = estimated_value * 1.08

    price_signal = clean_price_signal(price_gap_percent)

    risk_features = build_risk_features(data)

    try:
        risk_prediction = risk_model.predict(risk_features)[0]
    except Exception as error:
        print("Risk prediction error:", error)
        risk_prediction = "normal"

    risk_level = normalize_risk_prediction(risk_prediction, price_gap_percent)

    if risk_level == "suspicious":
        risk_score = 85
        opportunity_signal = "High caution"
        opportunity_note = (
            "Verify the seller, documents, exact location, and property condition."
        )
    elif risk_level == "medium-risk":
        risk_score = 60
        opportunity_signal = "Review carefully"
        opportunity_note = (
            "Review the price, documents, seller details, and exact location."
        )
    else:
        risk_score = 25
        opportunity_signal = "Looks reasonable"
        opportunity_note = "The listing looks reasonable, but confirm the key details."

    risk_factors = build_risk_factors(
        risk_level=risk_level,
        price_signal=price_signal,
        completeness_score=float(data.completenessScore),
    )

    size_sqm = max(float(data.sizeSqm), 1)

    return {
        "estimatedValue": round(estimated_value),
        "negotiationLow": round(negotiation_low),
        "negotiationHigh": round(negotiation_high),
        "priceSignal": price_signal,
        "priceGapPercent": round(price_gap_percent, 2),
        "riskLevel": risk_level,
        "riskScore": risk_score,
        "riskFactors": risk_factors,
        "opportunitySignal": opportunity_signal,
        "opportunityNote": opportunity_note,
        "explanation": "The result is based on property details, price gap, and listing risk signal.",
        "pricePerSqm": round(listed_price / size_sqm),
        "nearbyAveragePrice": round(estimated_value),
        "nearbyAveragePricePerSqm": round(estimated_value / size_sqm),
        "modelSource": "Noble Addis trained property price and listing risk models",
    }