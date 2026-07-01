import json
import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


DATA_FILE = "data/addis_model_ready.csv"
MODEL_FILE = "models/risk_model.pkl"
METRICS_FILE = "models/risk_model_metrics.json"


df = pd.read_csv(DATA_FILE)

print("Loaded dataset:", df.shape)

df = df.dropna(subset=["listed_price", "size_sqm", "property_type"])
df = df[df["listed_price"] > 0]
df = df[df["size_sqm"] > 0]

# Make sure price_per_sqm exists
if "price_per_sqm" not in df.columns or df["price_per_sqm"].isna().all():
    df["price_per_sqm"] = df["listed_price"] / df["size_sqm"]

df["price_per_sqm"] = pd.to_numeric(df["price_per_sqm"], errors="coerce")
df["price_per_sqm"] = df["price_per_sqm"].fillna(df["price_per_sqm"].median())

# Make sure required quality fields exist
if "image_count" not in df.columns:
    df["image_count"] = 0

if "description_length" not in df.columns:
    df["description_length"] = 0

if "completeness_score" not in df.columns:
    df["completeness_score"] = 0.7

df["image_count"] = pd.to_numeric(df["image_count"], errors="coerce").fillna(0)
df["description_length"] = pd.to_numeric(
    df["description_length"], errors="coerce"
).fillna(0)
df["completeness_score"] = pd.to_numeric(
    df["completeness_score"], errors="coerce"
).fillna(0.7)

# Create stronger risk labels for training
low_price_threshold = df["price_per_sqm"].quantile(0.10)
high_price_threshold = df["price_per_sqm"].quantile(0.90)

very_low_price_threshold = df["price_per_sqm"].quantile(0.03)
very_high_price_threshold = df["price_per_sqm"].quantile(0.97)

df["risk_label"] = "normal"

# Medium risk: unusually low/high price, weak details, or missing images
df.loc[
    (df["price_per_sqm"] < low_price_threshold)
    | (df["price_per_sqm"] > high_price_threshold)
    | (df["completeness_score"] < 0.65)
    | (df["image_count"] == 0),
    "risk_label",
] = "medium-risk"

# Suspicious: very unusual price plus weak listing quality
df.loc[
    (
        (df["price_per_sqm"] < very_low_price_threshold)
        | (df["price_per_sqm"] > very_high_price_threshold)
    )
    & (
        (df["completeness_score"] < 0.75)
        | (df["image_count"] == 0)
        | (df["description_length"] < 40)
    ),
    "risk_label",
] = "suspicious"

# If suspicious class is still empty, force the most extreme price rows into suspicious.
# This keeps the model useful for a 3-class final product demo.
if (df["risk_label"] == "suspicious").sum() == 0:
    extreme_low = df["price_per_sqm"] <= very_low_price_threshold
    extreme_high = df["price_per_sqm"] >= very_high_price_threshold

    df.loc[extreme_low | extreme_high, "risk_label"] = "suspicious"

print()
print("Risk label distribution:")
print(df["risk_label"].value_counts())

numeric_features = [
    "listed_price",
    "price_per_sqm",
    "size_sqm",
    "bedrooms",
    "bathrooms",
    "image_count",
    "latitude",
    "longitude",
    "floor",
    "description_length",
    "completeness_score",
]

categorical_features = [
    "property_type",
    "listing_type",
    "place_name",
    "condition",
    "furnishing",
]

numeric_features = [col for col in numeric_features if col in df.columns]
categorical_features = [col for col in categorical_features if col in df.columns]

features = numeric_features + categorical_features

X = df[features]
y = df["risk_label"]

numeric_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
    ]
)

categorical_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_pipeline, numeric_features),
        ("cat", categorical_pipeline, categorical_features),
    ]
)

risk_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            RandomForestClassifier(
                n_estimators=150,
                max_depth=18,
                min_samples_leaf=3,
                random_state=42,
                n_jobs=-1,
                class_weight="balanced",
            ),
        ),
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

print()
print("Training rows:", X_train.shape[0])
print("Testing rows:", X_test.shape[0])
print("Training risk model...")

risk_model.fit(X_train, y_train)

predictions = risk_model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)
report = classification_report(y_test, predictions, output_dict=True)

metrics = {
    "rows_used": int(df.shape[0]),
    "training_rows": int(X_train.shape[0]),
    "testing_rows": int(X_test.shape[0]),
    "features": features,
    "accuracy": float(accuracy),
    "classification_report": report,
    "risk_label_distribution": df["risk_label"].value_counts().to_dict(),
}

joblib.dump(risk_model, MODEL_FILE)

with open(METRICS_FILE, "w") as file:
    json.dump(metrics, file, indent=2)

# Save the updated training data with final risk labels
df.to_csv("data/addis_model_ready_with_risk.csv", index=False)

print()
print("Risk model saved to:", MODEL_FILE)
print("Metrics saved to:", METRICS_FILE)
print("Updated data saved to: data/addis_model_ready_with_risk.csv")
print()
print("Accuracy:", round(accuracy, 4))
print()
print("Classification report:")
print(classification_report(y_test, predictions))
print()
print("Features used:")
for feature in features:
    print("-", feature)