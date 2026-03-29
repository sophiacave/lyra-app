#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
const args = process.argv.slice(2);

if (args[0] === 'upload') {
  const bunnyUploadCommand = `node ${fileURLToPath(new URL('.', import.meta.url))}/bunny-upload.js ${args.slice(1).join(' ')}`;
  console.log(`Running: ${bunnyUploadCommand}`);
  execSync(bunnyUploadCommand, { stdio: 'inherit' });
} else {
  console.error('Unknown command. Usage: node studio/cli.js upload [options]');
  process.exit(1);
}
