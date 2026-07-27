import test from "node:test";
import assert from "node:assert/strict";

import { evaluateProperty, formatMoney, type PropertyInput } from "./prediction";

function baseInput(overrides: Partial<PropertyInput> = {}): PropertyInput {
  return {
    location: "Bole",
    propertyType: "Apartment",
    listedPriceUsd: 85000,
    sizeSqm: 95,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 5,
    completenessScore: 0.9,
    description:
      "Two bedroom apartment in Bole with good access, listed amenities, and clear property details.",
    ...overrides,
  };
}

test("evaluateProperty returns a well-formed result for typical input", () => {
  const result = evaluateProperty(baseInput());

  assert.ok(["overpriced", "underpriced", "within-range"].includes(result.priceSignal));
  assert.ok(["normal", "medium-risk", "suspicious"].includes(result.riskLevel));
  assert.ok(result.estimatedValue > 0);
  assert.ok(result.riskFactors.length > 0);
  assert.ok(result.negotiationLow <= result.negotiationHigh);
});

test("a listing priced far above comparables is flagged overpriced", () => {
  const result = evaluateProperty(
    baseInput({ listedPriceUsd: 10_000_000, sizeSqm: 95 })
  );

  assert.equal(result.priceSignal, "overpriced");
  assert.ok(result.priceGapPercent > 18);
});

test("a listing priced far below comparables is flagged underpriced", () => {
  const result = evaluateProperty(baseInput({ listedPriceUsd: 1000 }));

  assert.equal(result.priceSignal, "underpriced");
  assert.ok(result.priceGapPercent < -18);
});

test("low completeness, no amenities, and a short description raise risk level", () => {
  const cleanResult = evaluateProperty(baseInput());

  const riskyResult = evaluateProperty(
    baseInput({
      completenessScore: 0.2,
      amenitiesCount: 0,
      description: "cheap",
    })
  );

  const riskRank = { normal: 0, "medium-risk": 1, suspicious: 2 };

  assert.ok(riskRank[riskyResult.riskLevel] >= riskRank[cleanResult.riskLevel]);
  assert.ok(riskyResult.riskScore <= cleanResult.riskScore);
});

test("zero size does not divide by zero or produce NaN/Infinity", () => {
  const result = evaluateProperty(baseInput({ sizeSqm: 0 }));

  assert.ok(Number.isFinite(result.pricePerSqm));
  assert.ok(Number.isFinite(result.estimatedValue));
});

test("negative listed price falls back to a safe positive value instead of crashing", () => {
  const result = evaluateProperty(baseInput({ listedPriceUsd: -500 }));

  assert.ok(Number.isFinite(result.estimatedValue));
  assert.ok(result.estimatedValue >= 0);
});

test("formatMoney formats a numeric value and handles bad input", () => {
  assert.equal(formatMoney(1850000), "ETB 1,850,000");
  assert.equal(formatMoney(undefined), "ETB 0");
  assert.equal(formatMoney(Number.NaN), "ETB 0");
});
