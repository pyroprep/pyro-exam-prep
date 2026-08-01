/**
 * Seed Script – Bulk-upload AI-generated practice questions into Supabase.
 *
 * Usage:
 *   1. Place your questions array in generated_questions.json
 *   2. Ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local
 *   3. Run: node --env-file=.env.local seed_questions.js
 *
 * The --env-file flag requires Node.js >= 20.6.0.
 * If you're on an older version, install dotenv and uncomment the line below.
 */

// import "dotenv/config"; // uncomment if using dotenv

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// ── Configuration ────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
  process.exit(1);
}
if (!SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
  process.exit(1);
}

// ── Supabase admin client (bypasses RLS) ────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ── Read & parse generated_questions.json ───────────────────────────────────

const jsonPath = path.resolve(__dirname, "generated_questions.json");

let questions;
try {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  questions = JSON.parse(raw);
} catch (err) {
  console.error(`❌ Failed to read/parse ${jsonPath}:`, err.message);
  process.exit(1);
}

if (!Array.isArray(questions) || questions.length === 0) {
  console.warn("⚠️  No questions found in generated_questions.json (empty array). Nothing to insert.");
  process.exit(0);
}

console.log(`📦 Found ${questions.length} question(s) to insert…`);

// ── Insert all records ──────────────────────────────────────────────────────

async function seed() {
  const { data, error } = await supabase.from("questions").insert(questions).select();

  if (error) {
    console.error("❌ Insert failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data.length} question(s) into the "questions" table.`);
  process.exit(0);
}

seed();