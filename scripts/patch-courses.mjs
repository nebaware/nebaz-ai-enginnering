import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const coursesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'courses');
for (const f of fs.readdirSync(coursesDir).filter(x => x.endsWith('.html'))) {
  const p = path.join(coursesDir, f);
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes('js/config.js')) {
    html = html.replace('<script src="../js/navigation.js"></script>', '<script src="../js/config.js"></script>\n    <script src="../js/navigation.js"></script>');
  }
  if (!html.includes('bootcamp-plus.js') && html.includes('bootcamp-plus-banner')) {
    html = html.replace('</body>', '    <script src="../js/bootcamp-plus.js"></script>\n</body>');
  }
  fs.writeFileSync(p, html);
}
console.log('Courses patched');
