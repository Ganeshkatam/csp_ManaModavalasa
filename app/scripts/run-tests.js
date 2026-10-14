import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Discover all test files recursively across all directory depths.
// Works cross-platform on Linux, macOS, and Windows regardless of shell globbing quirks.
const testFiles = fs.readdirSync('src', { recursive: true })
    .filter(file => file.endsWith('.test.js'))
    .map(file => path.join('src', file));

if (testFiles.length === 0) {
    console.error('No test files found under src/');
    process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...testFiles], {
    stdio: 'inherit'
});

process.exit(result.status ?? 1);
