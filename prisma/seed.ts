/**
 * Seed database dengan data awal:
 * - 4 kategori (Baju Thrift, Wig Styling, Nail Art, Ilustrator)
 * - Admin user
 * - Beberapa produk contoh
 *
 * Jalankan dengan: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Prisma v7 requires a driver adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ============ KATEGORI ============
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "baju-thrift" },
      update: {},
      create: {
        name: "Baju Thrift",
        slug: "baju-thrift",
        description: "Koleksi baju bekas berkualitas pilihan",
      },
    }),
    prisma.category.upsert({
      where: { slug: "wig-styling" },
      update: {},
      create: {
        name: "Wig Styling",
        slug: "wig-styling",
        description: "Jasa styling wig profesional",
      },
    }),
    prisma.category.upsert({
      where: { slug: "nail-art" },
      update: {},
      create: {
        name: "Nail Art",
        slug: "nail-art",
        description: "Jasa nail art cantik dan aesthetic",
      },
    }),
    prisma.category.upsert({
      where: { slug: "ilustrator" },
      update: {},
      create: {
        name: "Ilustrator",
        slug: "ilustrator",
        description: "Jasa ilustrasi custom",
      },
    }),
  ]);

  console.log("✅ Kategori dibuat:", categories.map((c: typeof categories[0]) => c.name));

  // ============ ADMIN USER ============
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@bynaise.com";
  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin by.naise",
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user:", admin.email);

  // ============ PRODUK CONTOH ============
  const thriftCat = categories[0];
  const wigCat = categories[1];
  const nailCat = categories[2];
  const ilustratorCat = categories[3];

  const sampleProducts = [
    {
      name: "Kemeja Flanel Oversize Vintage",
      slug: "kemeja-flanel-oversize-vintage",
      description: "Kemeja flanel bekas kondisi bagus, bahan tebal dan hangat. Cocok untuk tampilan casual aesthetic. Ukuran M-L.",
      price: 75000,
      comparePrice: 120000,
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"],
      stock: 3,
      type: "PHYSICAL" as const,
      categoryId: thriftCat.id,
      tags: ["vintage", "flannel", "oversize"],
      isFeatured: true,
    },
    {
      name: "Dress Floral Y2K",
      slug: "dress-floral-y2k",
      description: "Dress mini motif bunga gaya Y2K, kondisi seperti baru. Panjang 80cm, cocok untuk size S-M.",
      price: 95000,
      comparePrice: 180000,
      images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500"],
      stock: 1,
      type: "PHYSICAL" as const,
      categoryId: thriftCat.id,
      tags: ["y2k", "floral", "dress"],
      isFeatured: true,
    },
    {
      name: "Jasa Wig Styling — Basic",
      slug: "jasa-wig-styling-basic",
      description: "Styling wig kamu jadi lebih rapi dan cantik! Meliputi: trimming, blending, baby hair setting. Estimasi 1-3 hari kerja.",
      price: 80000,
      images: ["https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500"],
      stock: 0,
      type: "SERVICE" as const,
      categoryId: wigCat.id,
      tags: ["wig", "styling", "basic"],
      isFeatured: true,
    },
    {
      name: "Jasa Wig Styling — Custom Color",
      slug: "jasa-wig-styling-custom-color",
      description: "Styling wig dengan pewarnaan custom. Tersedia berbagai pilihan warna. Hasil natural dan tahan lama. DM untuk konsultasi!",
      price: 150000,
      images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500"],
      stock: 0,
      type: "SERVICE" as const,
      categoryId: wigCat.id,
      tags: ["wig", "color", "custom"],
    },
    {
      name: "Nail Art — Soft Gradient",
      slug: "nail-art-soft-gradient",
      description: "Nail art dengan teknik gradient warna soft, tampilan aesthetic dan elegan. Tersedia berbagai kombinasi warna. Tahan 2-3 minggu.",
      price: 60000,
      images: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500"],
      stock: 0,
      type: "SERVICE" as const,
      categoryId: nailCat.id,
      tags: ["nail-art", "gradient", "aesthetic"],
      isFeatured: true,
    },
    {
      name: "Ilustrasi Digital — Portrait",
      slug: "ilustrasi-digital-portrait",
      description: "Pesan ilustrasi portrait digital custom! Cocok untuk gift, konten media sosial, atau merchandise. Pengerjaan 5-7 hari kerja. File dikirim dalam format PNG.",
      price: 120000,
      images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500"],
      stock: 0,
      type: "SERVICE" as const,
      categoryId: ilustratorCat.id,
      tags: ["ilustrasi", "digital", "portrait", "custom"],
      isFeatured: true,
    },
  ];

  for (const productData of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }

  console.log("✅ Produk contoh dibuat:", sampleProducts.length);
  console.log("\n🎉 Seeding selesai!");
  console.log("   Admin email:", adminEmail);
  console.log("   Admin password: admin123");
  console.log("   Ganti password setelah login pertama!");
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
