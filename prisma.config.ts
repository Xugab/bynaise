import { defineConfig } from "prisma/config";

// DATABASE_URL diisi dari environment variable (Heroku atau .env.local)
// Untuk generate schema tanpa DB connection, cukup definisikan datasource
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/bynaise_dev",
  },
});
