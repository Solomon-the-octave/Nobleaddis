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

type ComparableRecord = {
  location: string;
  propertyType: string;
  listedPriceUsd: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  amenitiesCount: number;
  completenessScore: number;
  riskLabel: "normal" | "medium-risk" | "suspicious";
};

const addisComparables: ComparableRecord[] = [
  {
    location: "Bole",
    propertyType: "Apartment",
    listedPriceUsd: 85000,
    sizeSqm: 95,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 5,
    completenessScore: 0.9,
    riskLabel: "normal",
  },
  {
    location: "CMC",
    propertyType: "House",
    listedPriceUsd: 120000,
    sizeSqm: 160,
    bedrooms: 3,
    bathrooms: 3,
    amenitiesCount: 6,
    completenessScore: 0.95,
    riskLabel: "normal",
  },
  {
    location: "Ayat",
    propertyType: "Condo",
    listedPriceUsd: 68000,
    sizeSqm: 85,
    bedrooms: 2,
    bathrooms: 1,
    amenitiesCount: 4,
    completenessScore: 0.85,
    riskLabel: "normal",
  },
  {
    location: "Summit",
    propertyType: "Apartment",
    listedPriceUsd: 95000,
    sizeSqm: 90,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 3,
    completenessScore: 0.7,
    riskLabel: "medium-risk",
  },
  {
    location: "Gerji",
    propertyType: "Villa",
    listedPriceUsd: 240000,
    sizeSqm: 220,
    bedrooms: 4,
    bathrooms: 4,
    amenitiesCount: 7,
    completenessScore: 0.95,
    riskLabel: "normal",
  },
  {
    location: "Saris",
    propertyType: "House",
    listedPriceUsd: 70000,
    sizeSqm: 140,
    bedrooms: 3,
    bathrooms: 2,
    amenitiesCount: 2,
    completenessScore: 0.6,
    riskLabel: "medium-risk",
  },
  {
    location: "Bole",
    propertyType: "Apartment",
    listedPriceUsd: 160000,
    sizeSqm: 80,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 2,
    completenessScore: 0.55,
    riskLabel: "suspicious",
  },
  {
    location: "CMC",
    propertyType: "Condo",
    listedPriceUsd: 45000,
    sizeSqm: 100,
    bedrooms: 2,
    bathrooms: 1,
    amenitiesCount: 1,
    completenessScore: 0.5,
    riskLabel: "suspicious",
  },
  {
    location: "Ayat",
    propertyType: "House",
    listedPriceUsd: 115000,
    sizeSqm: 180,
    bedrooms: 4,
    bathrooms: 3,
    amenitiesCount: 5,
    completenessScore: 0.88,
    riskLabel: "normal",
  },
  {
    location: "Kality",
    propertyType: "Warehouse",
    listedPriceUsd: 180000,
    sizeSqm: 300,
    bedrooms: 0,
    bathrooms: 1,
    amenitiesCount: 3,
    completenessScore: 0.8,
    riskLabel: "normal",
  },
  {
    location: "Megenagna",
    propertyType: "Apartment",
    listedPriceUsd: 110000,
    sizeSqm: 105,
    bedrooms: 3,
    bathrooms: 2,
    amenitiesCount: 4,
    completenessScore: 0.86,
    riskLabel: "normal",
  },
  {
    location: "Piassa",
    propertyType: "Commercial",
    listedPriceUsd: 220000,
    sizeSqm: 180,
    bedrooms: 0,
    bathrooms: 2,
    amenitiesCount: 5,
    completenessScore: 0.9,
    riskLabel: "normal",
  },
  {
    location: "Bole",
    propertyType: "Villa",
    listedPriceUsd: 300000,
    sizeSqm: 250,
    bedrooms: 5,
    bathrooms: 5,
    amenitiesCount: 8,
    completenessScore: 0.96,
    riskLabel: "normal",
  },
  {
    location: "Summit",
    propertyType: "Condo",
    listedPriceUsd: 40000,
    sizeSqm: 95,
    bedrooms: 2,
    bathrooms: 1,
    amenitiesCount: 1,
    completenessScore: 0.45,
    riskLabel: "suspicious",
  },
  {
    location: "Gerji",
    propertyType: "Apartment",
    listedPriceUsd: 98000,
    sizeSqm: 100,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 4,
    completenessScore: 0.85,
    riskLabel: "normal",
  },
  {
    location: "Ayat",
    propertyType: "Apartment",
    listedPriceUsd: 72000,
    sizeSqm: 90,
    bedrooms: 2,
    bathrooms: 1,
    amenitiesCount: 3,
    completenessScore: 0.82,
    riskLabel: "normal",
  },
  {
    location: "CMC",
    propertyType: "House",
    listedPriceUsd: 200000,
    sizeSqm: 170,
    bedrooms: 3,
    bathrooms: 3,
    amenitiesCount: 4,
    completenessScore: 0.58,
    riskLabel: "medium-risk",
  },
  {
    location: "Saris",
    propertyType: "Apartment",
    listedPriceUsd: 50000,
    sizeSqm: 70,
    bedrooms: 1,
    bathrooms: 1,
    amenitiesCount: 2,
    completenessScore: 0.78,
    riskLabel: "normal",
  },
  {
    location: "Kality",
    propertyType: "Commercial",
    listedPriceUsd: 150000,
    sizeSqm: 240,
    bedrooms: 0,
    bathrooms: 2,
    amenitiesCount: 3,
    completenessScore: 0.72,
    riskLabel: "medium-risk",
  },
  {
    location: "Bole",
    propertyType: "Apartment",
    listedPriceUsd: 250000,
    sizeSqm: 75,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 1,
    completenessScore: 0.48,
    riskLabel: "suspicious",
  },
  {
    location: "Megenagna",
    propertyType: "Condo",
    listedPriceUsd: 90000,
    sizeSqm: 95,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 4,
    completenessScore: 0.84,
    riskLabel: "normal",
  },
  {
    location: "Piassa",
    propertyType: "Apartment",
    listedPriceUsd: 130000,
    sizeSqm: 110,
    bedrooms: 3,
    bathrooms: 2,
    amenitiesCount: 5,
    completenessScore: 0.88,
    riskLabel: "normal",
  },
  {
    location: "Gerji",
    propertyType: "House",
    listedPriceUsd: 160000,
    sizeSqm: 190,
    bedrooms: 4,
    bathrooms: 3,
    amenitiesCount: 5,
    completenessScore: 0.87,
    riskLabel: "normal",
  },
  {
    location: "Ayat",
    propertyType: "Villa",
    listedPriceUsd: 210000,
    sizeSqm: 230,
    bedrooms: 4,
    bathrooms: 4,
    amenitiesCount: 6,
    completenessScore: 0.92,
    riskLabel: "normal",
  },
  {
    location: "Summit",
    propertyType: "Apartment",
    listedPriceUsd: 88000,
    sizeSqm: 82,
    bedrooms: 2,
    bathrooms: 2,
    amenitiesCount: 2,
    completenessScore: 0.62,
    riskLabel: "medium-risk",
  },
];

function cleanText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function safeNumber(value: number | undefined | null, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return fallback;
  }

  return value;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function average(values: number[]) {
  if (values.length === 0) return 0;

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length
  );
}

function getExactRecord(input: PropertyInput) {
  const enteredLocation = cleanText(input.location);
  const enteredType = cleanText(input.propertyType);

  return (
    addisComparables.find((record) => {
      const recordLocation = cleanText(record.location);
      const recordType = cleanText(record.propertyType);

      const locationMatches =
        enteredLocation.includes(recordLocation) ||
        recordLocation.includes(enteredLocation);

      const typeMatches = enteredType === recordType;
      const bedroomsMatch = Number(input.bedrooms) === record.bedrooms;
      const bathroomsMatch = Number(input.bathrooms) === record.bathrooms;
      const sizeMatches = Math.abs(Number(input.sizeSqm) - record.sizeSqm) <= 15;

      return (
        locationMatches &&
        typeMatches &&
        bedroomsMatch &&
        bathroomsMatch &&
        sizeMatches
      );
    }) || null
  );
}

function getComparableRecords(input: PropertyInput) {
  const enteredLocation = cleanText(input.location);
  const enteredType = cleanText(input.propertyType);

  const sameAreaAndType = addisComparables.filter((record) => {
    const recordLocation = cleanText(record.location);
    const recordType = cleanText(record.propertyType);

    const locationMatches =
      enteredLocation.includes(recordLocation) ||
      recordLocation.includes(enteredLocation);

    return locationMatches && enteredType === recordType;
  });

  if (sameAreaAndType.length > 0) {
    return sameAreaAndType;
  }

  const sameType = addisComparables.filter(
    (record) => cleanText(record.propertyType) === enteredType
  );

  if (sameType.length > 0) {
    return sameType;
  }

  return addisComparables;
}

function getPriceSignal(gapPercent: number): EvaluationResult["priceSignal"] {
  if (gapPercent > 18) return "overpriced";
  if (gapPercent < -18) return "underpriced";
  return "within-range";
}

function getRiskLevel(points: number): EvaluationResult["riskLevel"] {
  if (points >= 45) return "suspicious";
  if (points >= 20) return "medium-risk";
  return "normal";
}

function getReviewScore(points: number) {
  return clamp(100 - points, 20, 95);
}

function getRiskFactors({
  priceSignal,
  priceGapPercent,
  completenessScore,
  amenitiesCount,
  description,
}: {
  priceSignal: EvaluationResult["priceSignal"];
  priceGapPercent: number;
  completenessScore: number;
  amenitiesCount: number;
  description: string;
}) {
  const factors: string[] = [];

  if (priceSignal === "overpriced") {
    factors.push(
      "The asking price is above the expected range for similar listings."
    );
  }

  if (priceSignal === "underpriced") {
    factors.push(
      "The asking price is below the expected range, so the buyer should confirm why."
    );
  }

  if (Math.abs(priceGapPercent) > 30) {
    factors.push(
      "The price difference is large enough to require extra comparison before negotiation."
    );
  }

  if (completenessScore < 0.6) {
    factors.push(
      "The listing has limited details, so ownership and property information should be confirmed."
    );
  }

  if (amenitiesCount <= 1) {
    factors.push(
      "Few amenities are listed, so the buyer should request more property details."
    );
  }

  if (!description || description.trim().length < 45) {
    factors.push(
      "The description is short and may not provide enough information for a confident decision."
    );
  }

  if (factors.length === 0) {
    factors.push("The listing is close to the expected price range.");
    factors.push("The listed details are enough for an initial buyer review.");
    factors.push(
      "The buyer should still confirm location and ownership before payment."
    );
  }

  return factors;
}

function getOpportunity(
  riskLevel: EvaluationResult["riskLevel"],
  priceSignal: EvaluationResult["priceSignal"]
) {
  if (riskLevel === "suspicious") {
    return {
      opportunitySignal: "Verify first",
      opportunityNote:
        "Do not make any payment yet. Confirm ownership, seller identity, exact location, and viewing arrangements first.",
    };
  }

  if (riskLevel === "medium-risk") {
    return {
      opportunitySignal: "Review carefully",
      opportunityNote:
        "Ask for more listing evidence, compare nearby prices, and confirm the property details before negotiation.",
    };
  }

  if (priceSignal === "overpriced") {
    return {
      opportunitySignal: "Negotiate first",
      opportunityNote:
        "The listing may still be valid, but the asking price is above the expected range. Start negotiation below the listed price.",
    };
  }

  if (priceSignal === "underpriced") {
    return {
      opportunitySignal: "Confirm details",
      opportunityNote:
        "The price looks lower than expected. Confirm the listing source, property condition, and ownership details before moving quickly.",
    };
  }

  return {
    opportunitySignal: "Safe to continue",
    opportunityNote:
      "The listing looks reasonable for an initial review. The buyer can contact the seller or agent, but should still verify documents and location.",
  };
}

export function evaluateProperty(input: PropertyInput): EvaluationResult {
  const listedPriceUsd = safeNumber(input.listedPriceUsd, 1);
  const sizeSqm = safeNumber(input.sizeSqm, 1);
  const amenitiesCount = safeNumber(input.amenitiesCount, 0);
  const completenessScore = clamp(
    safeNumber(input.completenessScore, 0.5),
    0,
    1
  );

  const exactRecord = getExactRecord(input);
  const comparableRecords = getComparableRecords(input);

  const pricePerSqm = Math.round(listedPriceUsd / sizeSqm);

  const comparablePricesPerSqm = comparableRecords.map((record) =>
    Math.round(record.listedPriceUsd / record.sizeSqm)
  );

  const nearbyAveragePricePerSqm =
    average(comparablePricesPerSqm) || pricePerSqm;

  const nearbyAveragePrice =
    average(comparableRecords.map((record) => record.listedPriceUsd)) ||
    listedPriceUsd;

  const rawEstimatedValue = nearbyAveragePricePerSqm * sizeSqm;

  const estimatedValue = exactRecord
    ? exactRecord.listedPriceUsd
    : Math.round(rawEstimatedValue * 0.75 + listedPriceUsd * 0.25);

  const priceGapPercent =
    estimatedValue > 0
      ? ((listedPriceUsd - estimatedValue) / estimatedValue) * 100
      : 0;

  const priceSignal = getPriceSignal(priceGapPercent);

  let riskPoints = 0;

  if (Math.abs(priceGapPercent) > 45) {
    riskPoints += 35;
  } else if (Math.abs(priceGapPercent) > 30) {
    riskPoints += 25;
  } else if (Math.abs(priceGapPercent) > 18) {
    riskPoints += 12;
  }

  if (completenessScore < 0.55) {
    riskPoints += 20;
  } else if (completenessScore < 0.7) {
    riskPoints += 10;
  }

  if (amenitiesCount <= 1) {
    riskPoints += 8;
  }

  if (!input.description || input.description.trim().length < 45) {
    riskPoints += 8;
  }

  if (exactRecord?.riskLabel === "suspicious") {
    riskPoints = Math.max(riskPoints, 55);
  }

  if (exactRecord?.riskLabel === "medium-risk") {
    riskPoints = Math.max(riskPoints, 25);
  }

  if (exactRecord?.riskLabel === "normal" && priceSignal === "within-range") {
    riskPoints = Math.min(riskPoints, 10);
  }

  const riskLevel = getRiskLevel(riskPoints);
  const riskScore = getReviewScore(riskPoints);
  const opportunity = getOpportunity(riskLevel, priceSignal);

  const negotiationLow = Math.round(estimatedValue * 0.92);
  const negotiationHigh = Math.round(estimatedValue * 1.05);

  return {
    negotiationLow,
    negotiationHigh,
    estimatedValue,
    priceSignal,
    priceGapPercent: Number(priceGapPercent.toFixed(1)),
    riskLevel,
    riskScore,
    riskFactors: getRiskFactors({
      priceSignal,
      priceGapPercent,
      completenessScore,
      amenitiesCount,
      description: input.description,
    }),
    opportunitySignal: opportunity.opportunitySignal,
    opportunityNote: opportunity.opportunityNote,
    explanation:
      "This review compares the listing with available Noble Addis records and checks price, size, room count, amenities, and listing completeness.",
    pricePerSqm,
    nearbyAveragePrice,
    nearbyAveragePricePerSqm,
    modelSource: "Noble Addis listing records",
  };
}

export function formatMoney(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "ETB 0";
  }

  return `ETB ${Math.round(value).toLocaleString("en-US")}`;
}