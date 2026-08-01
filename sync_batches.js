const fs = require('fs');
const path = require('path');

const workspaceDir = __dirname;
const masterFile = path.join(workspaceDir, 'clean_questions.json');
const master = JSON.parse(fs.readFileSync(masterFile, 'utf8'));

function splitIntoBatches(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

const canonicalBatches = splitIntoBatches(master, 75);
for (let i = 0; i < canonicalBatches.length; i += 1) {
  const fileName = `remaining_questions_batch_${i + 1}.json`;
  const filePath = path.join(workspaceDir, fileName);
  fs.writeFileSync(filePath, `${JSON.stringify(canonicalBatches[i], null, 2)}\n`, 'utf8');
}

console.log(`Wrote ${canonicalBatches.length} batch files from the 500-question master bank.`);
console.log(`Master bank count: ${master.length}`);
