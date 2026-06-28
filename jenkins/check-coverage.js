const fs = require('fs');

const THRESHOLD = 90;
const report = JSON.parse(fs.readFileSync('./newman/report.json', 'utf8'));
const { total, failed } = report.run.stats.assertions;
const coverage = ((total - failed) / total) * 100;

console.log(`Cobertura de testes: ${coverage.toFixed(2)}% (mínimo exigido: ${THRESHOLD}%)`);

if (coverage < THRESHOLD) {
  console.error('Cobertura de testes abaixo do limite.');
  process.exit(1);
}
