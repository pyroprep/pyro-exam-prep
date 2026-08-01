#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const WORKSPACE_DIR = __dirname;
const OUTPUT_FILE = path.resolve(WORKSPACE_DIR, "clean_questions.json");
const INPUT_CANDIDATES = [
  path.resolve(WORKSPACE_DIR, "generated_questions.json"),
  path.resolve(WORKSPACE_DIR, "../question bank archive"),
  path.resolve(WORKSPACE_DIR, "question bank archive"),
];

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

const VALID_ANSWERS = new Set(["A", "B", "C", "D"]);

function findInputFile() {
  for (const candidate of INPUT_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function sanitizeJSONText(text) {
  let fixed = String(text || "").replace(/^\uFEFF/, "");
  fixed = fixed.replace(/^```(?:json)?\s*/i, "");
  fixed = fixed.replace(/\s*```\s*$/gim, "");
  fixed = fixed.replace(/\]\s*\[/g, "],[");
  fixed = fixed.replace(/,\s*([}\]])/g, "$1");
  return fixed.trim();
}

function extractJSONObjectCandidates(text) {
  const sanitized = sanitizeJSONText(text);
  const objects = [];
  let depth = 0;
  let startIndex = null;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < sanitized.length; index += 1) {
    const char = sanitized[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\" && inString) {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        startIndex = index;
      }
      depth += 1;
      continue;
    }

    if (char === "}") {
      if (depth > 0) {
        depth -= 1;
        if (depth === 0 && startIndex !== null) {
          const candidate = sanitized.slice(startIndex, index + 1);
          if (candidate.trim()) {
            objects.push(candidate);
          }
          startIndex = null;
        }
      }
    }
  }

  return objects;
}

function tryParseJSON(text) {
  const candidates = [text, sanitizeJSONText(text)];
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // continue
    }
  }

  const recoveredObjects = extractJSONObjectCandidates(text);
  if (recoveredObjects.length > 0) {
    const parsedObjects = [];
    for (const candidate of recoveredObjects) {
      try {
        parsedObjects.push(JSON.parse(candidate));
      } catch {
        // ignore malformed object fragments
      }
    }
    if (parsedObjects.length > 0) {
      return parsedObjects;
    }
  }

  return null;
}

function normalizeQuestion(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const answer = String(
    item.correct_answer || item.correctAnswer || item.correct_option || item.answer || ""
  )
    .trim()
    .toUpperCase();

  const answerMatch = answer.match(/[A-D]/);

  return {
    module_name: String(item.module_name || item.module || item.moduleName || "").trim(),
    question_text: String(item.question_text || item.questionText || item.question || "").trim(),
    option_a: String(item.option_a || item.optionA || item.a || "").trim(),
    option_b: String(item.option_b || item.optionB || item.b || "").trim(),
    option_c: String(item.option_c || item.optionC || item.c || "").trim(),
    option_d: String(item.option_d || item.optionD || item.d || "").trim(),
    correct_answer: answerMatch ? answerMatch[0] : answer,
    explanation: String(item.explanation || "").trim(),
  };
}

function extractQuestions(parsed) {
  if (Array.isArray(parsed)) {
    return parsed.map(normalizeQuestion).filter(Boolean);
  }
  if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.questions)) {
      return parsed.questions.map(normalizeQuestion).filter(Boolean);
    }
    if (Array.isArray(parsed.items)) {
      return parsed.items.map(normalizeQuestion).filter(Boolean);
    }
    if (Array.isArray(parsed.data)) {
      return parsed.data.map(normalizeQuestion).filter(Boolean);
    }
    return [normalizeQuestion(parsed)].filter(Boolean);
  }
  return [];
}

function deduplicate(questions) {
  const seen = new Set();
  const unique = [];
  for (const question of questions) {
    const key = String(question.question_text || "").trim().toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(question);
  }
  return unique;
}

function auditQuestions(questions) {
  const moduleTally = {};
  const flaggedQuestions = [];

  for (const question of questions) {
    const moduleName = question.module_name || "(UNKNOWN MODULE)";
    moduleTally[moduleName] = (moduleTally[moduleName] || 0) + 1;
  }

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const issues = [];

    for (const field of REQUIRED_FIELDS) {
      if (!question[field] || String(question[field]).trim() === "") {
        issues.push(`Missing/empty field: "${field}"`);
      }
    }

    if (question.correct_answer && !VALID_ANSWERS.has(question.correct_answer)) {
      issues.push(`Invalid correct_answer: "${question.correct_answer}" (expected A/B/C/D)`);
    }

    for (const option of ["option_a", "option_b", "option_c", "option_d"]) {
      if (question[option] && String(question[option]).trim().length < 2) {
        issues.push(`Suspiciously short ${option}: "${question[option]}"`);
      }
    }

    if (question.question_text && String(question.question_text).trim().length < 10) {
      issues.push(`Suspiciously short question_text (${String(question.question_text).trim().length} chars)`);
    }

    if (issues.length > 0) {
      flaggedQuestions.push({
        index: index + 1,
        module: question.module_name,
        question: String(question.question_text || "").slice(0, 80),
        issues,
      });
    }
  }

  return { moduleTally, flaggedQuestions };
}

function main() {
  const inputFile = findInputFile();
  if (!inputFile) {
    console.error("No input question file found.");
    process.exit(1);
  }

  console.log(`Reading input file: ${inputFile}`);
  let rawText = "";
  try {
    rawText = fs.readFileSync(inputFile, "utf8");
  } catch (error) {
    console.error("Failed to read input file:", error.message);
    process.exit(1);
  }

  console.log(`Input file size: ${(rawText.length / 1024).toFixed(1)} KB`);

  let parsed;
  try {
    parsed = tryParseJSON(rawText);
  } catch (error) {
    console.error("Failed to parse JSON content:", error.message);
    process.exit(1);
  }

  let questions = extractQuestions(parsed);
  questions = deduplicate(questions);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
  console.log(`Clean questions written to: ${OUTPUT_FILE}`);

  const { moduleTally, flaggedQuestions } = auditQuestions(questions);

  console.log("\n" + "=".repeat(70));
  console.log("COVERAGE AUDIT REPORT");
  console.log("=".repeat(70));
  console.log(`\nTotal questions: ${questions.length}`);

  console.log("\nMODULE BREAKDOWN:");
  console.log("-".repeat(50));
  const sortedModules = Object.entries(moduleTally).sort((a, b) => b[1] - a[1]);
  for (const [moduleName, count] of sortedModules) {
    const pct = ((count / questions.length) * 100).toFixed(1);
    console.log(`  ${moduleName.padEnd(45)} ${String(count).padStart(4)}  (${pct}%)`);
  }

  console.log("\nDATA INTEGRITY CHECK:");
  console.log("-".repeat(50));
  if (flaggedQuestions.length === 0) {
    console.log("  All questions pass integrity checks.");
  } else {
    console.log(`  ${flaggedQuestions.length} question(s) flagged with issues:\n`);
    for (const flag of flaggedQuestions) {
      console.log(`  #${flag.index} [${flag.module}]`);
      console.log(`     "${flag.question}..."`);
      for (const issue of flag.issues) {
        console.log(`     - ${issue}`);
      }
      console.log();
    }
  }

  const completeCount = questions.length - flaggedQuestions.length;
  console.log("-".repeat(50));
  console.log(`  Complete and valid: ${completeCount} / ${questions.length}`);
  console.log(`  Flagged with issues: ${flaggedQuestions.length} / ${questions.length}`);
  if (questions.length > 0) {
    console.log(`  Health score: ${((completeCount / questions.length) * 100).toFixed(1)}%`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("Audit complete.");
}

main();
