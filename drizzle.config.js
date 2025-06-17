require("dotenv").config(); // 👈 This loads environment variables

const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    dbCredentials: {
      url: "postgresql://neondb_owner:npg_rspP4LdFcbj0@ep-crimson-leaf-a8y6nh3e-pooler.eastus2.azure.neon.tech/zenterview?sslmode=require",
    },
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  strict: true,
  verbose: true,
});
