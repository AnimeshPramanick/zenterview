require("dotenv").config(); // 👈 This loads environment variables

const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL,
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  strict: true,
  verbose: true,
});
