#!/usr/bin/env node
/**
 * Audit ethioai-academy for clone remnants, broken paths, and missing href targets.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPORT = path.join(ROOT, 'audit-report.md');

const PATTERNS = [
  { name: 'aitutorials brand', re: /aitutorials/i },
  { name: 'broken cdnjs mirror path', re: /cdnjs\.cloudflare\.com/ },
  { name: 'verify4294 artifact', re: /verify4294/ },
  { name: 'og-image.json error file', re: /og-image\.json/ },
  { name: 'EthioAI legacy brand', re: /EthioAI|ethioai\.academy|ETHIOAI/i },
];

const EXT = new Set(['.html', '.js', '.css', '.json']);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === 'vendor') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (EXT.has(path.extname(ent.name))) files.push(p);
  }
  return files;
}

function collectInternalHrefs(html, filePath) {
  const relDir = path.dirname(filePath);
  const hrefs = [];
  const re = /href=["']([^"'#?]+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const h = m[1];
    if (h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('javascript:')) continue;
    hrefs.push(h);
  }
  return hrefs;
}

const files = walk(ROOT);
const issues = {};
for (const p of PATTERNS) issues[p.name] = [];

const brokenLinks = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, 'utf8');
  for (const p of PATTERNS) {
    if (p.re.test(text)) {
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        if (p.re.test(line)) issues[p.name].push({ file: rel, line: i + 1, snippet: line.trim().slice(0, 120) });
      });
    }
  }
  if (file.endsWith('.html')) {
    for (const href of collectInternalHrefs(text, file)) {
      const target = path.normalize(path.join(path.dirname(file), href));
      if (!fs.existsSync(target)) {
        brokenLinks.push({ from: rel, href, resolved: path.relative(ROOT, target) });
      }
    }
  }
}

let md = `# Audit Report\n\nGenerated: ${new Date().toISOString()}\n\n`;
for (const p of PATTERNS) {
  md += `## ${p.name}\n\nCount: ${issues[p.name].length}\n\n`;
  issues[p.name].slice(0, 30).forEach((x) => {
    md += `- \`${x.file}:${x.line}\` — ${x.snippet}\n`;
  });
  if (issues[p.name].length > 30) md += `\n_...and ${issues[p.name].length - 30} more_\n`;
  md += '\n';
}
md += `## Broken internal links\n\nCount: ${brokenLinks.length}\n\n`;
brokenLinks.slice(0, 50).forEach((x) => {
  md += `- \`${x.from}\` → \`${x.href}\` (missing: \`${x.resolved}\`)\n`;
});
if (brokenLinks.length > 50) md += `\n_...and ${brokenLinks.length - 50} more_\n`;

fs.writeFileSync(REPORT, md);
console.log('Wrote', REPORT);
let exit = 0;
for (const p of PATTERNS) {
  if (p.name !== 'EthioAI legacy brand' && issues[p.name].length > 0) {
    console.log(p.name, issues[p.name].length);
    exit = 1;
  }
}
process.exit(exit);
