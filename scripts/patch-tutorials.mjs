#!/usr/bin/env node
/** Add config.js before navigation.js on all tutorial pages */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'tutorials');

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

let n = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('js/config.js')) continue;
  const needle = '<script src="../../js/navigation.js"></script>';
  if (!html.includes(needle)) continue;
  html = html.replace(
    needle,
    '<script src="../../js/config.js"></script>\n    <script src="../../js/navigation.js"></script>'
  );
  fs.writeFileSync(file, html);
  n++;
}
console.log('Added config.js to', n, 'tutorials');
