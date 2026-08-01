#!/usr/bin/env node
/**
 * cleanup_dataset.js
 *
 * Complete workspace audit, data consolidation, deduplication, validation,
 * and export of all pyrotechnic practice question data sources into one
 * pristine master dataset.
 *
 * Usage: node scripts/cleanup_dataset.js
 */

const fs = require("fs");
const path = require("path");

const WORKSPACE_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.resolve(WORKSPACE_DIR, "data");
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, "clean_questions.json");

const VALID_MODULES = new Set([
  "California Fireworks Law",
  "Pyrotechnic Chemistry",
  "Display Operations",
  "Emergency & Safety",
]);

const VALID_ANSWERS = new Set(["A", "B", "C", "D"]);

const REQUIRED_FIELDS = [
  "module_name",
  "question_text",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "explanation",
];

const SKIP_PATTERNS = [
  /node_modules/,
  /\.git\//,
  /\.next\//,
  /\.vercel\//,
  /package-lock\.json$/,
  /package\.json$/,
  /tsconfig/,
  /eslint/,
  /postcss/,
  /next\.config/,
  /next-env/,
  /\.env\b/,
  /CLAUDE\.md$/,
  /AGENTS\.md$/,
  /README\.md$/,
];

const QUESTION_FILE_GLOBS = [
  "generated_questions.json",
  "generated_questions.json.fixed",
  "clean_questions.json",
  "remaining_questions_batch_*.json",
  "lib/questions.ts",
  "audit_questions.js",
  "seed_questions.js",
  "finalize_bank.js",
  "merge_questions.js",
  "sync_batches.js",
  "proxy.ts",
];

// ── Sanitization ───────────────────────────────────────────────────────────

function sanitizeJSONText(text) {
  let fixed = String(text || "").replace(/^\uFEFF/, "");
  fixed = fixed.replace(/^```(?:json|javascript|typescript|js|ts)?\s*/gim, "");
  fixed = fixed.replace(/\s*```\s*$/gim, "");
  fixed = fixed.replace(/,\s*([}\]])/g, "$1");
  fixed = fixed.replace(/\]\s*\[/g, ",");
  return fixed.trim();
}

// ── Permissive JSON Parser ─────────────────────────────────────────────────

/**
 * Parse text with multiple fallback strategies.
 * 1. Direct JSON.parse
 * 2. Extract JSON objects from raw text (handles concatenated arrays like [..][..])
 * 3. Sanitize + parse
 * 4. Wrap & parse
 * 5. Extract objects from sanitized text
 */
function tryParseJSON(text) {
  try { return JSON.parse(text); } catch {}

  const rawObjects = extractJSONObjects(text);
  if (rawObjects.length > 0) return rawObjects;

  const sanitized = sanitizeJSONText(text);
  try { return JSON.parse(sanitized); } catch {}

  if (!sanitized.startsWith("[") && sanitized.includes("{")) {
    try { return JSON.parse("[" + sanitized + "]"); } catch {}
  }

  const sanitizedObjects = extractJSONObjects(sanitized);
  if (sanitizedObjects.length > 0) return sanitizedObjects;

  return null;
}

/**
 * Extract individual JSON object strings from malformed text
 * by tracking brace depth. Handles escaped quotes in strings.
 */
function extractJSONObjects(text) {
  const objects = [];
  let depth = 0, startIndex = null, inString = false, escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (escaped) { escaped = false; continue; }
    if (char === "\\" && inString) { escaped = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (char === "{") {
      if (depth === 0) startIndex = i;
      depth++;
      continue;
    }
    if (char === "}") {
      if (depth > 0) {
        depth--;
        if (depth === 0 && startIndex !== null) {
          const candidate = text.slice(startIndex, i + 1).trim();
          if (candidate) objects.push(candidate);
          startIndex = null;
        }
      }
    }
  }
  return objects;
}

// ── Source File Extraction (.ts/.js) ──────────────────────────────────────

function extractFromSourceFile(text) {
  const results = [];
  const arrayBlockRegex = /(?:const|let|var|export\s+const)\s+\w+\s*=\s*(\[[\s\S]*?\])\s*;?/g;
  let match;
  while ((match = arrayBlockRegex.exec(text)) !== null) {
    const parsed = tryParseJSON(match[1]);
    if (parsed && Array.isArray(parsed)) {
      for (const item of parsed) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          results.push(item);
        }
      }
    }
  }
  const moduleExportsRegex = /module\.exports\s*=\s*(\[[\s\S]*?\])\s*;?/g;
  while ((match = moduleExportsRegex.exec(text)) !== null) {
    const parsed = tryParseJSON(match[1]);
    if (parsed && Array.isArray(parsed)) {
      for (const item of parsed) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          results.push(item);
        }
      }
    }
  }
  return results;
}

// ── Schema Normalization ───────────────────────────────────────────────────

function normalizeModuleName(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (VALID_MODULES.has(s)) return s;
  const lower = s.toLowerCase();
  if (lower.includes("california") && (lower.includes("law") || lower.includes("firework")))
    return "California Fireworks Law";
  if (lower.includes("chemistry") || lower.includes("chemical"))
    return "Pyrotechnic Chemistry";
  if (lower.includes("display") || lower.includes("operation"))
    return "Display Operations";
  if (lower.includes("emergency") || lower.includes("safety") || lower.includes("first aid"))
    return "Emergency & Safety";
  if (lower.includes("module 1")) return "California Fireworks Law";
  if (lower.includes("module 2")) return "Pyrotechnic Chemistry";
  if (lower.includes("module 3")) return "Display Operations";
  if (lower.includes("module 4")) return "Emergency & Safety";
  return null;
}

function categoryToModule(category, sectionCode) {
  const cat = String(category || "").toLowerCase();
  const sec = String(sectionCode || "").toLowerCase();
  if (cat === "basic" || sec.includes("981") || sec.includes("982") || sec.includes("983"))
    return "California Fireworks Law";
  if (sec.includes("984") || cat === "chemistry") return "Pyrotechnic Chemistry";
  if (sec.includes("1004") || sec.includes("display") || cat === "display")
    return "Display Operations";
  if (sec.includes("985") || sec.includes("emergency") || sec.includes("safety") || cat === "safety")
    return "Emergency & Safety";
  return "California Fireworks Law";
}

function normalizeQuestion(item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;

  if (Array.isArray(item.choices) && item.choices.length === 4) {
    return {
      module_name: categoryToModule(item.category, item.sectionCode),
      question_text: String(item.question || "").trim(),
      option_a: String(item.choices[0] || "").trim(),
      option_b: String(item.choices[1] || "").trim(),
      option_c: String(item.choices[2] || "").trim(),
      option_d: String(item.choices[3] || "").trim(),
      correct_answer: mapIndexToAnswer(item.correctIndex),
      explanation: String(item.rationale || item.explanation || "").trim(),
    };
  }

  const moduleRaw = item.module_name || item.module || item.moduleName || item.category || "";
  const moduleName = normalizeModuleName(moduleRaw);
  const questionText = String(item.question_text || item.questionText || item.question || "").trim();
  const optionA = String(item.option_a || item.optionA || item.a || "").trim();
  const optionB = String(item.option_b || item.optionB || item.b || "").trim();
  const optionC = String(item.option_c || item.optionC || item.c || "").trim();
  const optionD = String(item.option_d || item.optionD || item.d || "").trim();

  const answerRaw = String(item.correct_answer || item.correctAnswer || item.correct_option || item.answer || "").trim();
  let correctAnswer = answerRaw.toUpperCase();
  if (/^[0-3]$/.test(correctAnswer)) {
    correctAnswer = String.fromCharCode(65 + parseInt(correctAnswer, 10));
  }
  const answerMatch = correctAnswer.match(/[A-D]/);
  correctAnswer = answerMatch ? answerMatch[0] : correctAnswer;

  return {
    module_name: moduleName || moduleRaw,
    question_text: questionText,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    correct_answer: correctAnswer,
    explanation: String(item.explanation || item.rationale || item.reason || "").trim(),
  };
}

function mapIndexToAnswer(correctIndex) {
  const idx = parseInt(correctIndex, 10);
  if (!isNaN(idx) && idx >= 0 && idx <= 3) return String.fromCharCode(65 + idx);
  const str = String(correctIndex || "").trim().toUpperCase();
  const match = str.match(/[A-D]/);
  return match ? match[0] : str;
}

// ── File Discovery ─────────────────────────────────────────────────────────

function findQuestionFiles(dir) {
  const found = [];
  function walk(currentDir) {
    let entries;
    try { entries = fs.readdirSync(currentDir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      let skip = false;
      for (const pattern of SKIP_PATTERNS) {
        if (pattern.test(fullPath)) { skip = true; break; }
      }
      if (skip) continue;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const fileName = entry.name;
        for (const glob of QUESTION_FILE_GLOBS) {
          if (matchGlob(fileName, glob)) { found.push(fullPath); break; }
        }
        if (/\.json$/i.test(fileName) && currentDir === WORKSPACE_DIR && !found.includes(fullPath)) {
          found.push(fullPath);
        }
      }
    }
  }
  walk(dir);
  return found;
}

function matchGlob(fileName, glob) {
  return new RegExp("^" + glob.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$", "i").test(fileName);
}

// ── Deduplication ──────────────────────────────────────────────────────────

function deduplicate(questions) {
  const seen = new Set();
  const unique = [];
  for (const q of questions) {
    const key = normalizeKey(q.question_text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(q);
  }
  return unique;
}

function normalizeKey(text) {
  if (!text) return "";
  return String(text).toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

// ── Validation ─────────────────────────────────────────────────────────────

function validateQuestion(q) {
  const issues = [];
  for (const field of REQUIRED_FIELDS) {
    if (!q[field] || String(q[field]).trim() === "") {
      issues.push(`Missing/empty "${field}"`);
    }
  }
  if (q.module_name && !VALID_MODULES.has(q.module_name)) {
    issues.push(`Invalid module_name: "${q.module_name}"`);
  }
  if (q.correct_answer && !VALID_ANSWERS.has(q.correct_answer)) {
    issues.push(`Invalid correct_answer: "${q.correct_answer}" (expected A/B/C/D)`);
  }
  if (q.question_text && String(q.question_text).trim().length < 10) {
    issues.push(`Suspiciously short question_text`);
  }
  return issues;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse "parsed" results into an array of JavaScript objects.
 * Handles the case where extractJSONObjects returns an array of raw JSON strings.
 */
function resolveItems(parsed) {
  const items = [];

  if (Array.isArray(parsed)) {
    for (const elem of parsed) {
      if (typeof elem === "string" && elem.trim().startsWith("{")) {
        // This is a raw JSON string from extractJSONObjects – parse it
        try { items.push(JSON.parse(elem)); } catch {}
      } else if (elem && typeof elem === "object" && !Array.isArray(elem)) {
        items.push(elem);
      }
    }
  } else if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.questions)) items.push(...parsed.questions);
    else if (Array.isArray(parsed.items)) items.push(...parsed.items);
    else if (Array.isArray(parsed.data)) items.push(...parsed.data);
    else items.push(parsed);
  }

  return items;
}

// ── Main Pipeline ──────────────────────────────────────────────────────────

function main() {
  console.log("=".repeat(70));
  console.log("PYRO EXAM PREP – WORKSPACE AUDIT & DATA CONSOLIDATION");
  console.log("=".repeat(70));
  console.log(`Workspace: ${WORKSPACE_DIR}\n`);

  // Step 1: Discover
  console.log("STEP 1: Discovering question data files...\n");
  const questionFiles = findQuestionFiles(WORKSPACE_DIR);
  console.log(`  Found ${questionFiles.length} candidate file(s):`);
  for (const f of questionFiles) {
    const rel = path.relative(WORKSPACE_DIR, f);
    console.log(`    • ${rel}  (${(fs.statSync(f).size / 1024).toFixed(1)} KB)`);
  }

  // Step 2: Parse
  console.log("\nSTEP 2: Parsing all files...\n");
  let totalRaw = 0;
  const allQuestions = [];
  for (const filePath of questionFiles) {
    const rel = path.relative(WORKSPACE_DIR, filePath);
    let rawText;
    try { rawText = fs.readFileSync(filePath, "utf8"); } catch (e) {
      console.log(`  ⚠  Could not read ${rel}: ${e.message}`);
      continue;
    }

    let parsed = tryParseJSON(rawText);
    if (!parsed && /\.(ts|js)$/i.test(filePath)) {
      const extracted = extractFromSourceFile(rawText);
      if (extracted.length > 0) parsed = extracted;
    }
    if (!parsed) {
      console.log(`  ⚠  ${rel}: Could not parse any question data`);
      continue;
    }

    const items = resolveItems(parsed);
    const normalized = [];
    for (const item of items) {
      const n = normalizeQuestion(item);
      if (n) normalized.push(n);
    }

    if (normalized.length > 0) {
      console.log(`  ✓  ${rel}: ${normalized.length} question(s) extracted`);
      totalRaw += normalized.length;
      allQuestions.push(...normalized);
    } else {
      console.log(`  － ${rel}: 0 questions extracted (schema mismatch)`);
    }
  }
  console.log(`\n  Total raw questions extracted: ${totalRaw}`);

  // Step 3: Deduplicate
  console.log("\nSTEP 3: Deduplicating by question_text...");
  const beforeDedup = allQuestions.length;
  const deduped = deduplicate(allQuestions);
  console.log(`  Before dedup: ${beforeDedup}`);
  console.log(`  Duplicates removed: ${beforeDedup - deduped.length}`);
  console.log(`  After dedup: ${deduped.length}`);

  // Step 4: Validate
  console.log("\nSTEP 4: Validating and filtering...\n");
  const valid = [];
  const flagged = [];
  for (let i = 0; i < deduped.length; i++) {
    const q = deduped[i];
    const issues = validateQuestion(q);
    if (issues.length === 0 && VALID_MODULES.has(q.module_name)) {
      valid.push(q);
    } else {
      flagged.push({ index: i + 1, question: q.question_text ? q.question_text.slice(0, 60) : "(empty)", issues, module: q.module_name || "(none)" });
    }
  }
  console.log(`  Valid questions: ${valid.length}`);
  console.log(`  Flagged/removed: ${flagged.length}`);

  if (flagged.length > 0 && flagged.length <= 20) {
    console.log("\n  Flagged entries:");
    for (const f of flagged) {
      console.log(`    #${f.index} [${f.module}] "${f.question}..."`);
      for (const issue of f.issues) console.log(`       - ${issue}`);
    }
  }

  // Step 5: Export
  console.log("\nSTEP 5: Exporting clean dataset...");
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(valid, null, 2) + "\n", "utf8");
  console.log(`  ✓ Written to: ${path.relative(WORKSPACE_DIR, OUTPUT_FILE)}`);
  console.log(`  File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);

  // Step 6: Report
  console.log("\n" + "=".repeat(70));
  console.log("FINAL CLEANUP REPORT");
  console.log("=".repeat(70));
  console.log(`\n  Total raw questions found:      ${totalRaw}`);
  console.log(`  Total duplicates removed:        ${beforeDedup - deduped.length}`);
  console.log(`  Total invalid/corrupt removed:   ${flagged.length}`);
  console.log(`  ─────────────────────────────────────────`);
  console.log(`  Final clean question count:      ${valid.length}`);

  console.log("\n  MODULE BREAKDOWN:");
  console.log("  " + "-".repeat(45));
  const moduleTally = {};
  for (const q of valid) {
    const m = q.module_name;
    moduleTally[m] = (moduleTally[m] || 0) + 1;
  }
  const sortedModules = Object.entries(moduleTally).sort((a, b) => b[1] - a[1]);
  for (const [mod, count] of sortedModules) {
    const pct = valid.length > 0 ? ((count / valid.length) * 100).toFixed(1) : "0.0";
    console.log(`    ${mod.padEnd(35)} ${String(count).padStart(4)}  (${pct}%)`);
  }

  console.log("\n  FILES PROCESSED:");
  for (const f of questionFiles) {
    console.log(`    • ${path.relative(WORKSPACE_DIR, f)}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("Cleanup complete! Ready for: data/clean_questions.json");
  console.log("=".repeat(70));
}

main();