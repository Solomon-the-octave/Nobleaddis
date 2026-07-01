import json
import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


DATA_FILE = "data/addis_model_ready.csv"
MODEL_FILE = "models/price_model.pkl"
METRICS_FILE = "models/price_model_metrics.json"


df = pd.read_csv(DATA_FILE)

print("Loaded dataset:", df.shape)

# Remove rows with missing or unrealistic target values
df = df.dropna(subset=["listed_price", "size_sqm", "property_type"])
df = df[df["listed_price"] > 0]
df = df[df["size_sqm"] > 0]

# Optional: reduce extreme outliers so the model learns better
low_price = df["listed_price"].quantile(0.01)
high_price = df["listed_price"].quantile(0.99)

df = df[(df["listed_price"] >= low_price) & (df["listed_price"] <= high_price)]

print("After cleaning:", df.shape)

numeric_features = [
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

# Keep only columns that exist
numeric_features = [col for col in numeric_features if col in df.columns]
categorical_features = [col for col in categorical_features if col in df.columns]

features = numeric_features + categorical_features

X = df[features]
y = df["listed_price"]

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

regressor = RandomForestRegressor(
    n_estimators=120,
    max_depth=18,
    min_samples_leaf=3,
    random_state=42,
    n_jobs=-1,
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("regressor", regressor),
    ]
)

# Use log transform because property prices can be very spread out
price_model = TransformedTargetRegressor(
    regressor=model,
    func=np.log1p,
    inverse_func=np.expm1,
)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

print("Training rows:", X_train.shape[0])
print("Testing rows:", X_test.shape[0])
print("Training model...")

price_model.fit(X_train, y_train)

predictions = price_model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

median_actual_price = float(np.median(y_test))
mae_percent = float((mae / median_actual_price) * 100) if median_actual_price else 0

metrics = {
    "rows_used": int(df.shape[0]),
    "training_rows": int(X_train.shape[0]),
    "testing_rows": int(X_test.shape[0]),
    "features": features,
    "mae": float(mae),
    "mae_percent_of_median_price": mae_percent,
    "r2_score": float(r2),
    "median_actual_price": median_actual_price,
}

joblib.dump(price_model, MODEL_FILE)

with open(METRICS_FILE, "w") as file:
    json.dump(metrics, file, indent=2)

print()
print("Model saved to:", MODEL_FILE)
print("Metrics saved to:", METRICS_FILE)
print()
print("Model results:")
print("MAE:", round(mae, 2))
print("MAE as % of median price:", round(mae_percent, 2), "%")
print("R2 score:", round(r2, 4))
print()
print("Features used:")
for feature in features:
    print("-", feature)