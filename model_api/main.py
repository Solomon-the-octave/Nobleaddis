from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd


PRICE_MODEL_PATH = "models/price_model.pkl"
RISK_MODEL_PATH = "models/risk_model.pkl"

price_model = joblib.load(PRICE_MODEL_PATH)
risk_model = joblib.load(RISK_MODEL_PATH)

app = FastAPI(title="Noble Addis Model API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ListingInput(BaseModel):
    listed_price: float
    size_sqm: float
    bedrooms: float = 0
    bathrooms: float = 0
    image_count: float = 0
    latitude: float = 9.03
    longitude: float = 38.74
    floor: float = 0
    description_length: float = 0
    completeness_score: float = 0.7
    property_type: str = "apartment"
    listing_type: str = "for sale"
    place_name: str = "Unknown"
    condition: str = "Unknown"
    furnishing: str = "Unknown"


def get_price_signal(listed_price: float, estimated_price: float):
    if estimated_price <= 0:
        return "within-range"

    gap_percent = ((listed_price - estimated_price) / estimated_price) * 100

    if gap_percent > 18:
        return "overpriced"

    if gap_percent < -18:
        return "underpriced"

    return "within-range"


def get_opportunity_signal(risk_label: str, price_signal: str):
    if risk_label == "suspicious":
        return "Verify first"

    if risk_label == "medium-risk":
        return "Review carefully"

    if price_signal == "overpriced":
        return "Negotiate first"

    if price_signal == "underpriced":
        return "Confirm details"

    return "Safe to continue"


def get_risk_score(risk_label: str):
    if risk_label == "suspicious":
        return 40

    if risk_label == "medium-risk":
        return 65

    return 85


@app.get("/")
def home():
    return {
        "message": "Noble Addis model API is running",
        "models": ["price_model", "risk_model"],
    }


@app.post("/predict")
def predict_listing(data: ListingInput):
    price_per_sqm = data.listed_price / data.size_sqm if data.size_sqm > 0 else 0

    input_row = pd.DataFrame(
        [
            {
                "size_sqm": data.size_sqm,
                "bedrooms": data.bedrooms,
                "bathrooms": data.bathrooms,
                "image_count": data.image_count,
                "latitude": data.latitude,
                "longitude": data.longitude,
                "floor": data.floor,
                "description_length": data.description_length,
                "completeness_score": data.completeness_score,
                "property_type": data.property_type,
                "listing_type": data.listing_type,
                "place_name": data.place_name,
                "condition": data.condition,
                "furnishing": data.furnishing,
                "listed_price": data.listed_price,
                "price_per_sqm": price_per_sqm,
            }
        ]
    )

    estimated_price = float(price_model.predict(input_row)[0])
    risk_label = str(risk_model.predict(input_row)[0])

    price_gap_percent = (
        ((data.listed_price - estimated_price) / estimated_price) * 100
        if estimated_price > 0
        else 0
    )

    price_signal = get_price_signal(data.listed_price, estimated_price)
    opportunity_signal = get_opportunity_signal(risk_label, price_signal)

    negotiation_low = estimated_price * 0.92
    negotiation_high = estimated_price * 1.05

    return {
        "estimatedValue": round(estimated_price),
        "negotiationLow": round(negotiation_low),
        "negotiationHigh": round(negotiation_high),
        "priceSignal": price_signal,
        "priceGapPercent": round(price_gap_percent, 1),
        "riskLevel": risk_label,
        "riskScore": get_risk_score(risk_label),
        "pricePerSqm": round(price_per_sqm),
        "nearbyAveragePrice": round(estimated_price),
        "nearbyAveragePricePerSqm": round(estimated_price / data.size_sqm)
        if data.size_sqm > 0
        else 0,
        "riskFactors": [
            "Review the listing price against similar properties.",
            "Confirm the exact location and ownership documents.",
            "Check whether the listing has enough photos and details.",
            "Verify the seller or agent before payment.",
        ],
        "opportunitySignal": opportunity_signal,
        "opportunityNote": "Use this result as an early buyer review before contacting the seller or agent.",
        "explanation": "This result uses the trained Noble Addis price and listing risk models.",
        "modelSource": "Zenodo Addis Ababa real estate dataset",
    }