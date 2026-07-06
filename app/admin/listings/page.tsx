import { revalidatePath } from "next/cache";
import {
  Building2,
  ClipboardList,
  PlusCircle,
  Trash2,
} from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { formatMoney } from "../../../lib/prediction";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeString(value: FormDataEntryValue | null, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function safeNumber(value: FormDataEntryValue | null, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

async function addListingAction(formData: FormData) {
  "use server";

  await requireAdmin();

  await prisma.propertyListing.create({
    data: {
      title: safeString(formData.get("title"), "New property listing"),
      location: safeString(formData.get("location"), "Bole"),
      propertyType: safeString(formData.get("propertyType"), "Apartment"),
      listedPriceUsd: safeNumber(formData.get("listedPriceUsd"), 1850000),
      sizeSqm: safeNumber(formData.get("sizeSqm"), 95),
      bedrooms: safeNumber(formData.get("bedrooms"), 2),
      bathrooms: safeNumber(formData.get("bathrooms"), 2),
      amenitiesCount: 5,
      completenessScore: 0.85,
      riskLabel: "normal",
      status: "active",
      description: safeString(
        formData.get("description"),
        "Property listing added from the admin dashboard."
      ),
      imageUrl: "",
      sourcePlatform: "Noble Addis Admin",
      sourceNote: "Listing added from the admin dashboard.",
      listingUrl: "",
      verificationStatus: "Admin added",
      listingAge: "New",
      agentType: "Platform listing",
    } as any,
  });

  revalidatePath("/admin/listings");
  revalidatePath("/admin");
}

async function deleteListingAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const listingId = safeNumber(formData.get("id"));

  if (!listingId) return;

  try {
    await prisma.evaluationReport.updateMany({
      where: {
        listingId,
      },
      data: {
        listingId: null,
      },
    } as any);
  } catch {
    // Continue even if no reports are linked.
  }

  await prisma.propertyListing.delete({
    where: {
      id: listingId,
    },
  });

  revalidatePath("/admin/listings");
  revalidatePath("/admin");
}

export default async function AdminListingsPage() {
  await requireAdmin();

  const listings = (await prisma.propertyListing.findMany({
    orderBy: {
      id: "desc",
    },
    take: 20,
  })) as any[];

  return (
    <main className="premium-admin-page">
      <section className="premium-admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-kicker">Listing management</p>
            <h1 className="admin-page-title">Manage property listings</h1>
            <p className="admin-page-subtitle">
              Add listing records used for platform demos and remove outdated
              entries.
            </p>
          </div>
          <PlusCircle size={30} />
        </div>

        <form action={addListingAction} className="premium-admin-form">
          <label>
            <span>Listing title</span>
            <input
              name="title"
              placeholder="Example: 2-bedroom apartment in Bole"
              required
            />
          </label>

          <label>
            <span>Location</span>
            <select name="location" defaultValue="Bole">
              <option value="Bole">Bole</option>
              <option value="CMC">CMC</option>
              <option value="Ayat">Ayat</option>
              <option value="Summit">Summit</option>
              <option value="Gerji">Gerji</option>
              <option value="Megenagna">Megenagna</option>
              <option value="Piassa">Piassa</option>
              <option value="Saris">Saris</option>
              <option value="Kality">Kality</option>
              <option value="Kirkos">Kirkos</option>
              <option value="Arada">Arada</option>
            </select>
          </label>

          <label>
            <span>Property type</span>
            <select name="propertyType" defaultValue="Apartment">
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Land">Land</option>
            </select>
          </label>

          <label>
            <span>Listed price</span>
            <input
              name="listedPriceUsd"
              type="number"
              min="1"
              placeholder="1850000"
              required
            />
          </label>

          <label>
            <span>Size in sqm</span>
            <input
              name="sizeSqm"
              type="number"
              min="1"
              placeholder="95"
              required
            />
          </label>

          <label>
            <span>Bedrooms</span>
            <input name="bedrooms" type="number" min="0" placeholder="2" />
          </label>

          <label>
            <span>Bathrooms</span>
            <input name="bathrooms" type="number" min="0" placeholder="2" />
          </label>

          <label className="admin-form-wide">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Brief property description..."
              rows={4}
            />
          </label>

          <button className="admin-primary-button" type="submit">
            <PlusCircle size={18} />
            Add listing
          </button>
        </form>
      </section>

      <section className="premium-admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-kicker">All listings</p>
            <h2>Current listing records</h2>
          </div>
          <ClipboardList size={28} />
        </div>

        {listings.length === 0 ? (
          <div className="admin-empty-box">
            <Building2 size={26} />
            <p>No listings have been added yet.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="premium-admin-table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      <strong>{listing.title || "Untitled listing"}</strong>
                      <span>{listing.description || "No description added."}</span>
                    </td>
                    <td>{listing.location || "Addis Ababa"}</td>
                    <td>{listing.propertyType || "Property"}</td>
                    <td>{formatMoney(Number(listing.listedPriceUsd || 0))}</td>
                    <td>{Number(listing.sizeSqm || 0)} sqm</td>
                    <td>
                      <form action={deleteListingAction}>
                        <input type="hidden" name="id" value={String(listing.id)} />
                        <button className="admin-remove-button" type="submit">
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}