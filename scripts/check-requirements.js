import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * List of required files that must exist in project root
 * Add more as needed (PRD.md, etc.)
 */
const requiredFiles = [
  'README.md',
  'eslint.config.js',
  '.prettierrc.json',
  'package.json',
  'tsconfig.json',
];

const missing = [];

for (const file of requiredFiles) {
  const filePath = resolve(process.cwd(), file);
  if (!existsSync(filePath)) {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error('❌ Missing required files:', missing.join(', '));
  process.exit(1);
} else {
  console.log('✅ All required files present.');
  process.exit(0);
}
