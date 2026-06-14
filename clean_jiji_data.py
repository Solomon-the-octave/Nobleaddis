import pandas as pd
import re
from pathlib import Path

RAW_FILE = "data/jiji_raw_listings.csv"
OUTPUT_FILE = "data/addis_property_listings.csv"

df = pd.read_csv(RAW_FILE)

def clean_price_etb(value):
    try:
        return int(str(value).replace(",", "").strip())
    except:
        return 0

def extract_location(text):
    text = str(text)

    locations = [
        "Bole", "Kirkos", "Akaky Kaliti", "Yeka", "Nifas Silk-Lafto",
        "Lideta", "Gulele", "Arada", "Kolfe Keranio", "Addis Ketema",
        "CMC", "Ayat", "Megenagna", "Saris", "Gerji", "Summit"
    ]

    for loc in locations:
        if loc.lower() in text.lower():
            return loc

    if "Addis Ababa" in text:
        return "Addis Ababa"

    return "Addis Ababa"

def extract_size(text):
    text = str(text).lower()
    match = re.search(r"(\d+)\s*sqm", text)
    if match:
        return int(match.group(1))
    return 100

def extract_bedrooms(text):
    text = str(text).lower()

    match = re.search(r"(\d+)\s*(bdrm|bedroom|bedrooms|bed)", text)
    if match:
        return int(match.group(1))

    return 2

def extract_property_type(text):
    text = str(text).lower()

    if "warehouse" in text:
        return "Commercial"
    if "villa" in text:
        return "Villa"
    if "house" in text:
        return "House"
    if "apartment" in text:
        return "Apartment"
    if "land" in text or "plot" in text:
        return "Land"

    return "Property"

def estimate_bathrooms(bedrooms):
    if bedrooms <= 1:
        return 1
    if bedrooms == 2:
        return 2
    return min(bedrooms, 4)

def completeness_score(text, image_url, size_sqm):
    score = 0.45

    if len(str(text)) > 80:
        score += 0.20
    if len(str(text)) > 140:
        score += 0.10
    if image_url and str(image_url).startswith("http"):
        score += 0.15
    if size_sqm and size_sqm > 0:
        score += 0.10

    return round(min(score, 0.95), 2)

def assign_risk(price_etb, size_sqm, completeness):
    if size_sqm <= 0:
        return "medium-risk"

    price_per_sqm = price_etb / size_sqm

    if completeness < 0.55:
        return "suspicious"

    if price_per_sqm > 50000 and completeness < 0.75:
        return "suspicious"

    if completeness < 0.70:
        return "medium-risk"

    return "normal"

clean_rows = []

for index, row in df.iterrows():
    raw_text = str(row.get("raw_text", ""))
    price_etb = clean_price_etb(row.get("price_etb", 0))
    image_url = str(row.get("image_url", ""))
    listing_url = str(row.get("listing_url", ""))

    location = extract_location(raw_text)
    size_sqm = extract_size(raw_text)
    bedrooms = extract_bedrooms(raw_text)
    bathrooms = estimate_bathrooms(bedrooms)
    property_type = extract_property_type(raw_text)
    completeness = completeness_score(raw_text, image_url, size_sqm)
    risk_label = assign_risk(price_etb, size_sqm, completeness)

    title = raw_text.split(" ETB")[0].strip()
    if len(title) < 5:
        title = f"{property_type} listing in {location}"

    clean_rows.append({
        "id": index + 1,
        "title": title[:90],
        "location": location,
        "property_type": property_type,
        "listed_price_etb": price_etb,
        "listed_price_usd": round(price_etb / 57),
        "size_sqm": size_sqm,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "amenities_count": 2,
        "completeness_score": completeness,
        "description_length": len(raw_text),
        "risk_label": risk_label,
        "image_url": image_url,
        "source_platform": "Jiji Ethiopia",
        "listing_url": listing_url,
        "source_note": "Public listing data collected from Jiji Ethiopia for academic MVP demonstration. Private seller details excluded."
    })

clean_df = pd.DataFrame(clean_rows)

Path("data").mkdir(exist_ok=True)
clean_df.to_csv(OUTPUT_FILE, index=False)

print("Cleaned dataset saved to:", OUTPUT_FILE)
print("Rows:", len(clean_df))
print(clean_df.head())