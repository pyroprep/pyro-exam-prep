const fs = require('fs');
const path = require('path');

const workspaceDir = __dirname;
const outputFile = path.join(workspaceDir, 'clean_questions.json');
const inputFiles = [
  'clean_questions.json',
  'remaining_questions_batch_1.json',
  'remaining_questions_batch_2.json',
  'remaining_questions_batch_3.json',
  'remaining_questions_batch_4.json',
  'remaining_questions_batch_5.json',
  'remaining_questions_batch_6.json'
];

const questions = [];
const seen = new Set();

for (const file of inputFiles) {
  const fullPath = path.join(workspaceDir, file);
  if (!fs.existsSync(fullPath)) {
    continue;
  }

  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  for (const item of data) {
    const key = String(item.question_text || '').trim().toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    questions.push(item);
  }
}

fs.writeFileSync(outputFile, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');

const byModule = {};
for (const q of questions) {
  const moduleName = q.module_name || '(UNKNOWN MODULE)';
  byModule[moduleName] = (byModule[moduleName] || 0) + 1;
}

console.log(`Merged ${questions.length} unique questions into ${path.basename(outputFile)}`);
console.log(JSON.stringify(byModule, null, 2));
