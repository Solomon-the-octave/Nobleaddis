import { sampleListings } from "./sampleData";
import { modelPredictions } from "./modelPredictions";

export type PropertyInput = {
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  amenitiesCount: number;
  completenessScore: number;
  description: string;
};

export type EvaluationResult = {
  negotiationLow: number;
  negotiationHigh: number;
  estimatedValue: number;
  priceSignal: "overpriced" | "underpriced" | "within-range";
  priceGapPercent: number;
  riskLevel: "normal" | "medium-risk" | "suspicious";
  riskScore: number;
  riskFactors: string[];
  opportunitySignal: string;
  opportunityNote: string;
  explanation: string;
  pricePerSqm: number;
  nearbyAveragePrice: number;
  nearbyAveragePricePerSqm: number;
  modelSource: string;
};

function safeNumber(value: number | undefined | null, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return fallback;
  }

  return value;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function findModelPrediction(input: PropertyInput) {
  return modelPredictions.find(
    (prediction) =>
      prediction.location === input.location &&
      prediction.propertyType === input.propertyType &&
      Math.round(prediction.listedPriceUsd) === Math.round(input.listedPriceUsd) &&
      Math.round(prediction.sizeSqm) === Math.round(input.sizeSqm)
  );
}

function getComparableListings(input: PropertyInput) {
  const cleanListings = sampleListings.filter(
    (listing) =>
      listing.listedPriceUsd > 0 &&
      listing.sizeSqm > 0 &&
      listing.riskLabel !== "suspicious"
  );

  const sameLocation = cleanListings.filter(
    (listing) => listing.location === input.location
  );

  const sameType = cleanListings.filter(
    (listing) => listing.propertyType === input.propertyType
  );

  if (sameLocation.length >= 2) return sameLocation;
  if (sameType.length >= 2) return sameType;

  return cleanListings;
}

function getPriceSignal(priceGapPercent: number): EvaluationResult["priceSignal"] {
  if (priceGapPercent > 12) return "overpriced";
  if (priceGapPercent < -8) return "underpriced";
  return "within-range";
}

function getRiskScore(category: EvaluationResult["riskLevel"]) {
  if (category === "suspicious") return 75;
  if (category === "medium-risk") return 45;
  return 15;
}

function getRiskFactors(
  category: EvaluationResult["riskLevel"],
  priceGapPercent: number,
  completenessScore: number
) {
  if (category === "suspicious") {
    return [
      "Model prediction places this listing in the suspicious review category.",
      "Verify ownership documents before any payment or commitment.",
      "Confirm the exact property location and listing source.",
      "Compare the price with similar listings before negotiation.",
    ];
  }

  if (category === "medium-risk") {
    return [
      "Model prediction places this listing in the needs review category.",
      "Some listing details may need additional confirmation.",
      "Compare the price per square meter with similar listings.",
      "Request more evidence before moving to negotiation.",
    ];
  }

  const factors = ["Model prediction places this listing in the standard review category."];

  if (Math.abs(priceGapPercent) > 10) {
    factors.push("Price still needs comparison with similar listings.");
  }

  if (completenessScore < 0.75) {
    factors.push("Listing completeness should still be checked.");
  }

  factors.push("Document and site verification are still recommended.");

  return factors;
}

function getOpportunitySignal(
  riskLevel: EvaluationResult["riskLevel"],
  priceSignal: EvaluationResult["priceSignal"]
) {
  if (riskLevel === "suspicious") {
    return {
      opportunitySignal: "High review required",
      opportunityNote:
        "Do not proceed before verifying ownership documents, exact location, and seller credibility.",
    };
  }

  if (riskLevel === "medium-risk") {
    return {
      opportunitySignal: "Needs review",
      opportunityNote:
        "Request more listing evidence and compare similar properties before negotiation.",
    };
  }

  if (priceSignal === "overpriced") {
    return {
      opportunitySignal: "Negotiate first",
      opportunityNote:
        "The listing appears above the model reference value, so negotiation should begin below the asking price.",
    };
  }

  if (priceSignal === "underpriced") {
    return {
      opportunitySignal: "Verify before moving fast",
      opportunityNote:
        "The listing appears below the model reference value, so confirm details before treating it as an opportunity.",
    };
  }

  return {
    opportunitySignal: "Standard review",
    opportunityNote:
      "The listing appears within the expected range, but document and location checks are still required.",
  };
}

function fallbackEvaluation(input: PropertyInput): EvaluationResult {
  const listedPriceUsd = safeNumber(input.listedPriceUsd, 1);
  const sizeSqm = safeNumber(input.sizeSqm, 100);
  const pricePerSqm = Math.round(listedPriceUsd / sizeSqm);

  const comparables = getComparableListings(input);

  const nearbyAveragePrice =
    Math.round(
      average(
        comparables.map((listing) =>
          safeNumber(listing.listedPriceUsd, listedPriceUsd)
        )
      )
    ) || listedPriceUsd;

  const nearbyAveragePricePerSqm =
    Math.round(
      average(
        comparables.map(
          (listing) =>
            safeNumber(listing.listedPriceUsd, listedPriceUsd) /
            safeNumber(listing.sizeSqm, sizeSqm)
        )
      )
    ) || pricePerSqm;

  const estimatedValue = Math.round(
    nearbyAveragePricePerSqm * sizeSqm * 0.6 + listedPriceUsd * 0.4
  );

  const priceGapPercent =
    estimatedValue > 0
      ? ((listedPriceUsd - estimatedValue) / estimatedValue) * 100
      : 0;

  const priceSignal = getPriceSignal(priceGapPercent);

  const riskLevel =
    input.completenessScore < 0.55
      ? "suspicious"
      : input.completenessScore < 0.7
      ? "medium-risk"
      : "normal";

  const riskScore = getRiskScore(riskLevel);
  const opportunity = getOpportunitySignal(riskLevel, priceSignal);

  return {
    negotiationLow: Math.round(estimatedValue * 0.9),
    negotiationHigh: Math.round(estimatedValue * 1.02),
    estimatedValue,
    priceSignal,
    priceGapPercent: Number(priceGapPercent.toFixed(1)),
    riskLevel,
    riskScore,
    riskFactors: getRiskFactors(riskLevel, priceGapPercent, input.completenessScore),
    opportunitySignal: opportunity.opportunitySignal,
    opportunityNote: opportunity.opportunityNote,
    explanation:
      "This review uses backend fallback logic because no matching trained model prediction was found for this listing.",
    pricePerSqm,
    nearbyAveragePrice,
    nearbyAveragePricePerSqm,
    modelSource: "Backend fallback",
  };
}

export function evaluateProperty(input: PropertyInput): EvaluationResult {
  const listedPriceUsd = safeNumber(input.listedPriceUsd, 1);
  const sizeSqm = safeNumber(input.sizeSqm, 100);
  const pricePerSqm = Math.round(listedPriceUsd / sizeSqm);

  const trainedPrediction = findModelPrediction(input);

  if (!trainedPrediction) {
    return fallbackEvaluation(input);
  }

  const estimatedValue = safeNumber(
    trainedPrediction.predictedNegotiationReference,
    listedPriceUsd
  );

  const negotiationLow = safeNumber(
    trainedPrediction.predictedNegotiationLow,
    Math.round(estimatedValue * 0.9)
  );

  const negotiationHigh = safeNumber(
    trainedPrediction.predictedNegotiationHigh,
    Math.round(estimatedValue * 1.02)
  );

  const riskLevel = trainedPrediction.predictedReviewCategory;

  const priceGapPercent =
    estimatedValue > 0
      ? ((listedPriceUsd - estimatedValue) / estimatedValue) * 100
      : 0;

  const priceSignal = getPriceSignal(priceGapPercent);

  const comparables = getComparableListings(input);

  const nearbyAveragePrice =
    Math.round(
      average(
        comparables.map((listing) =>
          safeNumber(listing.listedPriceUsd, listedPriceUsd)
        )
      )
    ) || listedPriceUsd;

  const nearbyAveragePricePerSqm =
    Math.round(
      average(
        comparables.map(
          (listing) =>
            safeNumber(listing.listedPriceUsd, listedPriceUsd) /
            safeNumber(listing.sizeSqm, sizeSqm)
        )
      )
    ) || pricePerSqm;

  const riskScore = getRiskScore(riskLevel);
  const opportunity = getOpportunitySignal(riskLevel, priceSignal);

  return {
    negotiationLow,
    negotiationHigh,
    estimatedValue,
    priceSignal,
    priceGapPercent: Number(priceGapPercent.toFixed(1)),
    riskLevel,
    riskScore,
    riskFactors: getRiskFactors(riskLevel, priceGapPercent, input.completenessScore),
    opportunitySignal: opportunity.opportunitySignal,
    opportunityNote: opportunity.opportunityNote,
    explanation:
      "This result uses prediction outputs exported from the trained notebook model.",
    pricePerSqm,
    nearbyAveragePrice,
    nearbyAveragePricePerSqm,
    modelSource: "Trained notebook prediction",
  };
}

export function formatMoney(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "$0";
  }

  return `$${Math.round(value).toLocaleString("en-US")}`;
}