/**
 * seed_supabase.js
 *
 * Reads data/clean_questions.json and uploads all questions to the
 * Supabase `public.questions` table in batches of 50.
 *
 * Usage:  node scripts/seed_supabase.js
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY to be set in .env.local
 * (the service_role key bypasses RLS so we can insert data).
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// 1. Parse .env.local manually (no extra dependency)
// ---------------------------------------------------------------------------
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("ERROR: .env.local not found at", filePath);
    process.exit(1);
  }
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Remove surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Only set if not already in process.env (env vars take precedence)
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const envPath = path.resolve(__dirname, "..", ".env.local");
loadEnv(envPath);

// ---------------------------------------------------------------------------
// 2. Validate required env vars
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error(
    "ERROR: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local"
  );
  process.exit(1);
}
if (!SERVICE_ROLE_KEY) {
  console.error(
    "ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local.\n" +
      "       Grab it from https://supabase.com/dashboard/project/_/settings/api"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 3. Read the questions file
// ---------------------------------------------------------------------------
const questionsPath = path.resolve(__dirname, "..", "data", "clean_questions.json");

if (!fs.existsSync(questionsPath)) {
  console.error("ERROR: clean_questions.json not found at", questionsPath);
  process.exit(1);
}

const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
console.log(`Found ${questions.length} questions in clean_questions.json`);

// ---------------------------------------------------------------------------
// 4. Supabase client
// ---------------------------------------------------------------------------
const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket },
});

// ---------------------------------------------------------------------------
// 5. Upload in batches
// ---------------------------------------------------------------------------
const BATCH_SIZE = 50;

async function seed() {
  let totalInserted = 0;
  const total = questions.length;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    console.log(`Uploading batch ${batchNum} (${batch.length} questions)...`);

    const { data, error } = await supabase
      .from("questions")
      .insert(batch)
      .select("id");

    if (error) {
      console.error(`ERROR on batch ${batchNum}:`, error.message);
      console.error("Full error:", error);
      process.exit(1);
    }

    totalInserted += data.length;
    console.log(
      `  Batch ${batchNum} complete. Total inserted so far: ${totalInserted}`
    );
  }

  console.log(`\nSuccessfully inserted ${totalInserted} questions!`);
}

seed().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});