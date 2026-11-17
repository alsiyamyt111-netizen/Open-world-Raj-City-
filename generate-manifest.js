// প্রতিটা মডেল/ছবির হ্যাশ দিয়ে pack-manifest.json বানায়। GitHub Action এটা নিজে চালাবে।
// হাতে চালাতে: node generate-manifest.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const files = {};
const walk = d => {
  if (!fs.existsSync(d)) return;
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n), st = fs.statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    const key = p.split(path.sep).map(encodeURIComponent).join('/');
    files[key] = { h: crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex').slice(0, 12), s: st.size };
  }
};
['models', 'branding'].forEach(walk);
fs.writeFileSync('pack-manifest.json', JSON.stringify({ files }));
console.log(Object.keys(files).length + ' files');
