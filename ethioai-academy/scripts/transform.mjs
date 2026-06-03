#!/usr/bin/env node
/**
 * Bulk transform: scrub clone remnants, fix CDN paths, rebrand, fix verify links.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REPLACEMENTS = [
  [/utm_source=aitutorials/gi, 'utm_source=nebaz-ai'],
  [/utm_source%3Daitutorials/gi, 'utm_source%3Dnebaz-ai'],
  [/tag=aitutorials-21/gi, ''],
  [/via=aitutorials/gi, 'via=nebaz-ai'],
  [/ref=aitutorials/gi, 'ref=nebaz-ai'],
  [/cdnjs\.cloudflare\.com\/ajax\/libs\//g, 'vendor/'],
  [/highlight\.html/g, 'highlight.min.js'],
  [/verify4294\.html/g, 'verify.html'],
  [/assets\/og-image\.json/g, 'assets/og-image.svg'],
  [/EthioAI Academy/g, 'Nebaz AI Academy'],
  [/EthioAI/g, 'Nebaz AI'],
  [/ethioai\.academy/gi, 'nebaz-ai.local'],
  [/ETHIOAI-/g, 'NEBAZAI-'],
  [/ethioai_certs/g, 'nebaz_certs'],
  [/EthioAITutor_requests/g, 'nebaz_tutor_requests'],
  [/learningProgress/g, 'nebaz_learningProgress'],
  [/twitter\.com\/aitutorials/gi, ''],
  [/linkedin\.com\/company\/aitutorials/gi, ''],
  [/github\.com\/aitutorials/gi, ''],
  [/support@ethioai\.academy/gi, 'hello@nebaz-ai.local'],
  [/contact@ethioai\.academy/gi, 'hello@nebaz-ai.local'],
];

const EXT = new Set(['.html', '.js', '.css', '.json']);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === 'scripts') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (EXT.has(path.extname(ent.name))) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  if (file.includes('transform.mjs') || file.includes('config.js')) continue;
  let text = fs.readFileSync(file, 'utf8');
  const orig = text;
  for (const [re, rep] of REPLACEMENTS) text = text.replace(re, rep);
  if (text !== orig) {
    fs.writeFileSync(file, text);
    changed++;
  }
}

// Remove mirror error artifacts
const mlopsResp = path.join(ROOT, 'tutorials', 'mlops', 'response.json');
if (fs.existsSync(mlopsResp)) {
  const j = fs.readFileSync(mlopsResp, 'utf8');
  if (j.includes('File not found')) fs.unlinkSync(mlopsResp);
}

const verify4294 = path.join(ROOT, 'certificates', 'verify4294.html');
if (fs.existsSync(verify4294)) fs.unlinkSync(verify4294);

const ogJson = path.join(ROOT, 'assets', 'og-image.json');
if (fs.existsSync(ogJson)) fs.unlinkSync(ogJson);

console.log('Updated', changed, 'files');
