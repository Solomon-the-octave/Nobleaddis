/*
  Warnings:

  - You are about to drop the column `ownerId` on the `PropertyListing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "financeNote" TEXT;
ALTER TABLE "Payment" ADD COLUMN "receiptUrl" TEXT;

-- AlterTable
ALTER TABLE "ReservationRequest" ADD COLUMN "contactName" TEXT;
ALTER TABLE "ReservationRequest" ADD COLUMN "contactPhone" TEXT;
ALTER TABLE "ReservationRequest" ADD COLUMN "receiptUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "adminDepartment" TEXT;
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PropertyListing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "listedPriceUsd" INTEGER NOT NULL,
    "listedPriceEtb" INTEGER,
    "sizeSqm" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "amenitiesCount" INTEGER NOT NULL DEFAULT 0,
    "completenessScore" REAL NOT NULL DEFAULT 0.7,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "listingUrl" TEXT,
    "sourcePlatform" TEXT NOT NULL DEFAULT 'Noble Addis',
    "latitude" REAL,
    "longitude" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewLevel" TEXT NOT NULL DEFAULT 'STANDARD',
    "adminNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PropertyListing" ("adminNote", "amenitiesCount", "bathrooms", "bedrooms", "completenessScore", "createdAt", "description", "id", "imageUrl", "latitude", "listedPriceEtb", "listedPriceUsd", "listingUrl", "location", "longitude", "propertyType", "reviewLevel", "sizeSqm", "sourcePlatform", "status", "title", "updatedAt") SELECT "adminNote", "amenitiesCount", "bathrooms", "bedrooms", "completenessScore", "createdAt", "description", "id", "imageUrl", "latitude", "listedPriceEtb", "listedPriceUsd", "listingUrl", "location", "longitude", "propertyType", "reviewLevel", "sizeSqm", "sourcePlatform", "status", "title", "updatedAt" FROM "PropertyListing";
DROP TABLE "PropertyListing";
ALTER TABLE "new_PropertyListing" RENAME TO "PropertyListing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
