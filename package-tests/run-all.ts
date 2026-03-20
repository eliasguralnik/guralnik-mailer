// package-tests/run-all.ts
// ═══════════════════════════════════════════════════════════════
// Führt alle Tests (01-04) nacheinander aus.
// Test 05 (Live Send) wird NICHT automatisch ausgeführt.
// ═══════════════════════════════════════════════════════════════

import { execSync } from 'child_process';
import * as path from 'path';

const tests = [
  { file: '01-render-all-templates.ts', name: '01 – Render All Templates' },
  { file: '02-engine-pipeline.ts', name: '02 – Engine Pipeline' },
  { file: '03-providers.ts', name: '03 – Provider Init' },
  { file: '04-medusa-adapter.ts', name: '04 – Medusa Adapter' },
];

console.log('');
console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  🧪 GURALNIK-MAILER TEST SUITE                     ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log('');

let allPassed = true;

for (const test of tests) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Running: ${test.name}`);
  console.log('═'.repeat(60));

  try {
    const testPath = path.join(__dirname, test.file);
    execSync(`npx tsx "${testPath}"`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (err) {
    allPassed = false;
    console.error(`\n  ❌ ${test.name} FAILED!\n`);
  }
}

console.log('\n');
console.log('╔══════════════════════════════════════════════════════╗');
if (allPassed) {
  console.log('║  ✅ ALL TESTS PASSED                                ║');
} else {
  console.log('║  ❌ SOME TESTS FAILED                               ║');
}
console.log('╚══════════════════════════════════════════════════════╝');
console.log('');
console.log('  💡 To run live send tests:');
console.log('     npx tsx package-tests/05-live-send.ts your@email.com');
console.log('     npx tsx package-tests/05-live-send.ts your@email.com Welcome');
console.log('');

process.exit(allPassed ? 0 : 1);
