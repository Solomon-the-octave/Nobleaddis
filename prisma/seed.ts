import {
  PrismaClient,
  UserRole,
  AdminDepartment,
  ListingStatus,
  ReviewLevel,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.reservationRequest.deleteMany();
  await prisma.savedListing.deleteMany();
  await prisma.evaluationReport.deleteMany();
  await prisma.propertyListing.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "Demo Buyer",
        email: "buyer@nobleaddis.com",
        passwordHash: "buyer123",
        role: UserRole.BUYER,
      },
      {
        name: "Super Admin",
        email: "admin@nobleaddis.com",
        passwordHash: "nobleaddis123",
        role: UserRole.ADMIN,
        adminDepartment: AdminDepartment.SUPER_ADMIN,
      },
      {
        name: "Listings Admin",
        email: "listings@nobleaddis.com",
        passwordHash: "listings123",
        role: UserRole.ADMIN,
        adminDepartment: AdminDepartment.LISTINGS,
      },
      {
        name: "Finance Admin",
        email: "finance@nobleaddis.com",
        passwordHash: "finance123",
        role: UserRole.ADMIN,
        adminDepartment: AdminDepartment.FINANCE,
      },
      {
        name: "Verification Admin",
        email: "verify@nobleaddis.com",
        passwordHash: "verify123",
        role: UserRole.ADMIN,
        adminDepartment: AdminDepartment.VERIFICATION,
      },
      {
        name: "Support Admin",
        email: "support@nobleaddis.com",
        passwordHash: "support123",
        role: UserRole.ADMIN,
        adminDepartment: AdminDepartment.SUPPORT,
      },
    ],
  });

  await prisma.propertyListing.createMany({
    data: [
      {
        title: "Modern Apartment in Bole",
        location: "Bole",
        propertyType: "Apartment",
        listedPriceUsd: 4386,
        listedPriceEtb: 180000,
        sizeSqm: 100,
        bedrooms: 3,
        bathrooms: 2,
        amenitiesCount: 5,
        completenessScore: 0.86,
        description:
          "Modern apartment in Bole with access to transport, shops, and nearby services.",
        imageUrl: "/listings/apartment-1.jpg",
        listingUrl: "",
        sourcePlatform: "Noble Addis",
        latitude: 8.9806,
        longitude: 38.7578,
        status: ListingStatus.APPROVED,
        reviewLevel: ReviewLevel.STANDARD,
      },
      {
        title: "Apartment in Kirkos Requiring Review",
        location: "Kirkos",
        propertyType: "Apartment",
        listedPriceUsd: 2965,
        listedPriceEtb: 169000,
        sizeSqm: 90,
        bedrooms: 4,
        bathrooms: 2,
        amenitiesCount: 3,
        completenessScore: 0.52,
        description:
          "Apartment listing with limited details that requires additional verification.",
        imageUrl: "/listings/apartment-2.jpg",
        listingUrl: "",
        sourcePlatform: "Noble Addis",
        latitude: 9.0108,
        longitude: 38.7612,
        status: ListingStatus.NEEDS_REVIEW,
        reviewLevel: ReviewLevel.NEEDS_REVIEW,
      },
      {
        title: "Residential Land in Bole",
        location: "Bole",
        propertyType: "Land",
        listedPriceUsd: 5263,
        listedPriceEtb: 300000,
        sizeSqm: 250,
        bedrooms: 0,
        bathrooms: 0,
        amenitiesCount: 1,
        completenessScore: 0.68,
        description:
          "Residential land listing in Bole suitable for future development.",
        imageUrl: "/listings/land-1.jpg",
        listingUrl: "",
        sourcePlatform: "Noble Addis",
        latitude: 8.9905,
        longitude: 38.7902,
        status: ListingStatus.PENDING,
        reviewLevel: ReviewLevel.NEEDS_REVIEW,
      },
      {
        title: "Family House in CMC",
        location: "CMC",
        propertyType: "House",
        listedPriceUsd: 6200,
        listedPriceEtb: 355000,
        sizeSqm: 180,
        bedrooms: 4,
        bathrooms: 3,
        amenitiesCount: 6,
        completenessScore: 0.8,
        description:
          "Family house with compound space and access to main road services.",
        imageUrl: "/listings/house-1.jpg",
        listingUrl: "",
        sourcePlatform: "Noble Addis",
        latitude: 9.0185,
        longitude: 38.8321,
        status: ListingStatus.APPROVED,
        reviewLevel: ReviewLevel.STANDARD,
      },
      {
        title: "Incomplete Apartment Listing in Arada",
        location: "Arada",
        propertyType: "Apartment",
        listedPriceUsd: 3158,
        listedPriceEtb: 180000,
        sizeSqm: 75,
        bedrooms: 2,
        bathrooms: 1,
        amenitiesCount: 1,
        completenessScore: 0.42,
        description:
          "Apartment listing with missing details and limited supporting information.",
        imageUrl: "/listings/apartment-3.jpg",
        listingUrl: "",
        sourcePlatform: "Noble Addis",
        latitude: 9.0369,
        longitude: 38.7501,
        status: ListingStatus.NEEDS_REVIEW,
        reviewLevel: ReviewLevel.HIGH_REVIEW,
      },
    ],
  });

  console.log("Seed completed");
  console.log("Buyer: buyer@nobleaddis.com / buyer123");
  console.log("Super Admin: admin@nobleaddis.com / nobleaddis123");
  console.log("Listings Admin: listings@nobleaddis.com / listings123");
  console.log("Finance Admin: finance@nobleaddis.com / finance123");
  console.log("Verification Admin: verify@nobleaddis.com / verify123");
  console.log("Support Admin: support@nobleaddis.com / support123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });