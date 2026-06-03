#!/usr/bin/env node
/**
 * Patch tutorial HTML with Bootcamp+ blocks from content/curriculum/*.json
 * Usage: node scripts/build-lesson.mjs [track]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SNIPPETS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/snippets/ethiopia.json'), 'utf8'));
const MARKER = '<!-- BOOTCAMP-PLUS -->';

function patchLesson(lesson, trackDir) {
  const files = fs.readdirSync(trackDir).filter(f => f.endsWith('.html') && f.includes(lesson.id));
  if (!files.length) return false;
  const file = path.join(trackDir, files[0]);
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARKER)) return false;

  const eth = lesson.ethiopia_example ? SNIPPETS[lesson.ethiopia_example] : null;
  const mods = (lesson.bootcamp_additions || []).map(m => `<li>${m}</li>`).join('');
  const block = `
${MARKER}
<div class="bootcamp-plus-injected" style="background:#ecfdf5;border-left:4px solid #078930;padding:1rem 1.25rem;margin:1.5rem 0;border-radius:0 8px 8px 0;">
  <strong>Bootcamp+ (2026)</strong>
  ${mods ? `<ul style="margin:0.5rem 0 0 1.25rem;">${mods}</ul>` : ''}
  ${eth ? `<p style="margin-top:0.75rem;">🇪🇹 <em>${eth}</em></p>` : ''}
</div>`;

  const h1 = html.match(/<h1[^>]*>/);
  if (!h1) return false;
  const idx = html.indexOf('</h1>');
  if (idx === -1) return false;
  html = html.slice(0, idx + 5) + block + html.slice(idx + 5);
  fs.writeFileSync(file, html);
  return true;
}

const trackArg = process.argv[2];
const curriculumDir = path.join(ROOT, 'content/curriculum');
const files = trackArg
  ? [`${trackArg}.json`]
  : fs.readdirSync(curriculumDir).filter(f => f.endsWith('.json'));

let patched = 0;
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(curriculumDir, f), 'utf8'));
  const trackDir = path.join(ROOT, 'tutorials', data.track);
  if (!fs.existsSync(trackDir)) continue;
  for (const lesson of data.lessons || []) {
    if (patchLesson(lesson, trackDir)) patched++;
  }
}
console.log('Patched', patched, 'lessons');
