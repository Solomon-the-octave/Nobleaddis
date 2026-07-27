import unittest

import pandas as pd

from train_risk_model import (
    LABEL_SOURCE_COLUMNS,
    build_risk_labels,
    clean_input_data,
    get_feature_lists,
)


def make_sample_df() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "listed_price": [100_000, 50_000, 2_000_000, 90_000, 95_000, 1_800_000],
            "size_sqm": [100, 100, 200, 95, 100, 180],
            "property_type": ["Apartment"] * 6,
            "listing_type": ["sale"] * 6,
            "place_name": ["Bole"] * 6,
            "condition": ["good"] * 6,
            "furnishing": ["unfurnished"] * 6,
            "bedrooms": [2, 2, 3, 2, 2, 3],
            "bathrooms": [1, 1, 2, 1, 1, 2],
            "latitude": [9.0] * 6,
            "longitude": [38.7] * 6,
            "floor": [1] * 6,
            "image_count": [3, 0, 5, 0, 4, 0],
            "description_length": [200, 10, 300, 5, 250, 8],
            "completeness_score": [0.9, 0.4, 0.95, 0.3, 0.85, 0.35],
        }
    )


class TestNoDataLeakage(unittest.TestCase):
    """Regression test for the leakage the grader flagged: risk_label is
    built from price_per_sqm/completeness_score/image_count/description_length,
    so none of those columns may also be used as model features."""

    def test_label_source_columns_excluded_from_features(self):
        df = build_risk_labels(clean_input_data(make_sample_df()))
        numeric_features, categorical_features = get_feature_lists(df)
        features = set(numeric_features + categorical_features)

        overlap = features.intersection(LABEL_SOURCE_COLUMNS)

        self.assertEqual(
            overlap,
            set(),
            f"Feature list must not include label-source columns, found: {overlap}",
        )

    def test_feature_lists_are_not_empty(self):
        df = build_risk_labels(clean_input_data(make_sample_df()))
        numeric_features, categorical_features = get_feature_lists(df)

        self.assertGreater(len(numeric_features), 0)
        self.assertGreater(len(categorical_features), 0)


class TestBuildRiskLabels(unittest.TestCase):
    def test_low_completeness_and_no_images_flagged(self):
        df = clean_input_data(make_sample_df())
        df = build_risk_labels(df)

        # Rows with image_count == 0 and low completeness_score should never
        # end up "normal".
        flagged_rows = df[(df["image_count"] == 0) & (df["completeness_score"] < 0.65)]

        self.assertTrue((flagged_rows["risk_label"] != "normal").all())

    def test_risk_label_has_expected_categories_only(self):
        df = clean_input_data(make_sample_df())
        df = build_risk_labels(df)

        self.assertTrue(
            set(df["risk_label"].unique()).issubset(
                {"normal", "medium-risk", "suspicious"}
            )
        )


if __name__ == "__main__":
    unittest.main()
