import pandas as pd
import numpy as np

INPUT_FILE = "data/addis_real_estate.csv"
OUTPUT_FILE = "data/addis_model_ready.csv"

df = pd.read_csv(INPUT_FILE)

print("Original shape:", df.shape)
print("Columns:", list(df.columns))

# Keep only useful columns that exist in the dataset
wanted_columns = [
    "price",
    "price_adj",
    "price_sqm",
    "price_adj_sqm",
    "property_type",
    "listing_type",
    "size_sqm",
    "lat",
    "lng",
    "address",
    "address_main",
    "place_name",
    "num_bathrooms",
    "num_bedrooms",
    "num_images",
    "floor",
    "features",
    "condition",
    "furnishing",
]

available_columns = [col for col in wanted_columns if col in df.columns]

df = df[available_columns].copy()

# Rename columns to match Noble Addis style
rename_map = {
    "num_bedrooms": "bedrooms",
    "num_bathrooms": "bathrooms",
    "num_images": "image_count",
    "lat": "latitude",
    "lng": "longitude",
    "price_adj": "listed_price",
    "price_adj_sqm": "price_per_sqm",
}

df = df.rename(columns=rename_map)

# Use adjusted price if available, otherwise fall back to price
if "listed_price" not in df.columns and "price" in df.columns:
    df["listed_price"] = df["price"]

if "price_per_sqm" not in df.columns and "price_sqm" in df.columns:
    df["price_per_sqm"] = df["price_sqm"]

# Clean numeric columns
numeric_columns = [
    "listed_price",
    "price_per_sqm",
    "size_sqm",
    "bedrooms",
    "bathrooms",
    "image_count",
    "latitude",
    "longitude",
    "floor",
]

for col in numeric_columns:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

# Remove rows that cannot train the model
required_columns = [
    "listed_price",
    "size_sqm",
    "property_type",
]

df = df.dropna(subset=[col for col in required_columns if col in df.columns])

# Remove unrealistic values
df = df[df["listed_price"] > 0]
df = df[df["size_sqm"] > 0]

# Fill missing values
if "bedrooms" in df.columns:
    df["bedrooms"] = df["bedrooms"].fillna(0)

if "bathrooms" in df.columns:
    df["bathrooms"] = df["bathrooms"].fillna(0)

if "image_count" in df.columns:
    df["image_count"] = df["image_count"].fillna(0)
else:
    df["image_count"] = 0

if "latitude" in df.columns:
    df["latitude"] = df["latitude"].fillna(df["latitude"].median())

if "longitude" in df.columns:
    df["longitude"] = df["longitude"].fillna(df["longitude"].median())

text_columns = [
    "property_type",
    "listing_type",
    "address",
    "address_main",
    "place_name",
    "features",
    "condition",
    "furnishing",
]

for col in text_columns:
    if col in df.columns:
        df[col] = df[col].fillna("Unknown").astype(str)

# Create extra useful features
df["description_length"] = 0

if "features" in df.columns:
    df["description_length"] += df["features"].astype(str).str.len()

if "address" in df.columns:
    df["description_length"] += df["address"].astype(str).str.len()

df["has_image"] = (df["image_count"] > 0).astype(int)

# Create listing completeness score
df["completeness_score"] = 0.5

if "bedrooms" in df.columns:
    df["completeness_score"] += np.where(df["bedrooms"] > 0, 0.1, 0)

if "bathrooms" in df.columns:
    df["completeness_score"] += np.where(df["bathrooms"] > 0, 0.1, 0)

df["completeness_score"] += np.where(df["size_sqm"] > 0, 0.1, 0)
df["completeness_score"] += np.where(df["image_count"] > 0, 0.1, 0)
df["completeness_score"] += np.where(df["description_length"] > 40, 0.1, 0)

df["completeness_score"] = df["completeness_score"].clip(0, 1)

# Create risk label for suspicious listing model
# This is rule-based first, then we train a classifier to learn the pattern.
df["risk_label"] = "normal"

if "price_per_sqm" in df.columns:
    high_price_threshold = df["price_per_sqm"].quantile(0.90)
    low_price_threshold = df["price_per_sqm"].quantile(0.10)

    df.loc[df["price_per_sqm"] > high_price_threshold, "risk_label"] = "medium-risk"
    df.loc[df["price_per_sqm"] < low_price_threshold, "risk_label"] = "medium-risk"

df.loc[df["completeness_score"] < 0.6, "risk_label"] = "medium-risk"

df.loc[
    (df["completeness_score"] < 0.5) & (df["image_count"] == 0),
    "risk_label",
] = "suspicious"

# Save cleaned dataset
df.to_csv(OUTPUT_FILE, index=False)

print("Cleaned shape:", df.shape)
print("Saved to:", OUTPUT_FILE)
print()
print("Preview:")
print(df.head())
print()
print("Risk labels:")
print(df["risk_label"].value_counts())