#!/usr/bin/env node
/**
 * Deep customization: colors, affiliate removal, legal scrub, theme injection.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ETHIOPIA_PRACTICE = `
<section class="nebaz-practice-box">
    <h2>🇪🇹 Practice — Ethiopian context</h2>
    <p>Apply what you learned with a local scenario: use Amharic+English content, Telebirr or agriculture data, or a civic/NGO use case in Addis Ababa. Document assumptions, evaluate outputs, and note ETB cost if you use cloud APIs.</p>
    <ul>
        <li><strong>Data:</strong> Prefer open Ethiopian datasets or synthetic data you create and own.</li>
        <li><strong>Tools:</strong> Official docs and free tiers only — no affiliate links on Nebaz AI Academy.</li>
        <li><strong>Deploy:</strong> Consider low-bandwidth users; test on modest hardware when possible.</li>
    </ul>
</section>`;

const COLOR_MAP = [
  ['#3b82f6', '#078930'],
  ['#2563eb', '#065f46'],
  ['#1d4ed8', '#064e3b'],
  ['#1e40af', '#065f46'],
  ['#14b8a6', '#0d9488'],
  ['#06b6d4', '#0d9488'],
  ['#60a5fa', '#34d399'],
  ['#dbeafe', '#ecfdf5'],
  ['#e0f2fe', '#fef9c3'],
  ['#f0f9ff', '#ecfdf5'],
  ['linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)', 'linear-gradient(135deg, #078930 0%, #0d9488 55%, #ca8a04 100%)'],
  ['linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)', 'linear-gradient(135deg, #078930 0%, #0d9488 100%)'],
];

function walk(dir, ext, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'vendor' || e.name === 'scripts') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, files);
    else if (ext.some(x => p.endsWith(x))) files.push(p);
  }
  return files;
}

function applyColors(text) {
  let out = text;
  for (const [a, b] of COLOR_MAP) {
    out = out.split(a).join(b);
    out = out.split(a.toUpperCase()).join(b);
  }
  return out;
}

function stripAffiliateSections(html) {
  let out = html;
  // Remove sections dominated by affiliate tool CTAs
  const sectionRe = /<section[\s\S]*?<\/section>/gi;
  out = out.replace(sectionRe, (block) => {
    if (/Try [A-Za-z0-9.+ ]+→|utm_medium=affiliate|utm_medium=tutorial.*Try |tool-cta|Scale Your Content Creation|Jasper AI - Professional|Copy\.ai - High-Speed|Grammarly Premium - AI-Powered|<!-- Tool \d:/i.test(block)) {
      if (!block.includes('nebaz-practice-box')) return ETHIOPIA_PRACTICE;
    }
    return block;
  });
  // Remove standalone affiliate link paragraphs
  out = out.replace(/<div[^>]*>[\s\S]*?Try [^<]+→[\s\S]*?<\/div>\s*(?=<div|<\/section|<h2)/gi, '');
  // Strip utm params from remaining external links
  out = out.replace(/(\?|&)utm_[^"'&\s]+/gi, '');
  out = out.replace(/\?&/g, '?').replace(/\?$/, '');
  // Fix broken canva
  out = out.replace(/https:\/\/www\.canva\.com\/&/g, 'https://www.canva.com/');
  out = out.replace(/your-repo\//g, 'nebaz-ai-academy/');
  // Remove monetization script
  out = out.replace(/<script[^>]*src="[^"]*monetization\.js"[^>]*><\/script>\s*/gi, '');
  // Remove per-page clone :root overrides
  out = out.replace(/<style>[\s\S]*?:root\s*\{[^}]*--primary-color:\s*#3b82f6[\s\S]*?<\/style>/gi, '');
  out = out.replace(/data-track-event="affiliate_click"/g, 'data-track-event="resource_click"');
  return out;
}

function injectThemeLink(html, depth) {
  const prefix = depth === 0 ? '' : depth === 1 ? '../' : '../../';
  const link = `<link rel="stylesheet" href="${prefix}css/nebaz-theme.css">`;
  if (html.includes('nebaz-theme.css')) return html;
  return html.replace(/<link rel="stylesheet" href="[^"]*style\.css">/, m => m + '\n    ' + link);
}

function scrubNetflixMarketing(html) {
  return html.replace(/Netflix|Uber|Airbnb/gi, (m, offset, s) => {
    const ctx = s.slice(Math.max(0, offset - 80), offset + 80);
    if (/case study|used by|companies like|learn from/i.test(ctx)) {
      return 'Ethiopian tech teams';
    }
    return m;
  });
}

let stats = { files: 0, affiliate: 0, theme: 0 };

for (const file of walk(ROOT, ['.html', '.css', '.js'])) {
  if (file.includes('deep-customize') || file.includes('transform.mjs')) continue;
  let text = fs.readFileSync(file, 'utf8');
  const orig = text;
  if (file.endsWith('.html')) {
    const before = text;
    text = stripAffiliateSections(text);
    if (text !== before) stats.affiliate++;
    text = scrubNetflixMarketing(text);
    const rel = path.relative(ROOT, file);
    const depth = rel.startsWith('tutorials') ? 2 : rel.startsWith('courses') || rel.startsWith('certificates') ? 1 : 0;
    text = injectThemeLink(text, depth);
    if (text.includes('nebaz-theme.css') && !orig.includes('nebaz-theme.css')) stats.theme++;
  }
  text = applyColors(text);
  if (text !== orig) {
    fs.writeFileSync(file, text);
    stats.files++;
  }
}

// Fix style.css dark duplicate — remove second [data-theme="dark"] block lines 107-124 approx
const stylePath = path.join(ROOT, 'css', 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');
css = applyColors(css);
css = css.replace(/\/\* Dark Mode Variables \*\/\s*\[data-theme="dark"\]\s*\{[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}/s, '/* duplicate dark block removed — see nebaz-theme.css */');
fs.writeFileSync(stylePath, css);

console.log('Deep customize:', stats);
