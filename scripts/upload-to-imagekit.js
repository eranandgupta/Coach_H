const ImageKit = require('@imagekit/nodejs').default;
const fs = require('fs');
const path = require('path');

const imagekit = new ImageKit({
  privateKey: 'private_7eQ0Su4toqJz3cAeKZAShcHRoSE=',
});

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Files to upload (skip PWA icons, favicon, manifest, sw, offline page)
const SKIP = ['icons', 'favicon.png', 'manifest.json', 'sw.js', 'offline.html', 'workbox-', 'swe-worker-'];

function shouldSkip(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  return SKIP.some(s => rel.startsWith(s) || rel.includes(s));
}

function getAllFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else if (/\.(jpg|jpeg|png|webp|gif|svg|mp4)$/i.test(entry.name)) {
      if (!shouldSkip(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function uploadFile(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  const folder = '/' + (path.dirname(rel) === '.' ? 'public' : 'public/' + path.dirname(rel));
  const fileName = path.basename(filePath);

  try {
    const fileStream = fs.createReadStream(filePath);
    const result = await imagekit.files.upload({
      file: fileStream,
      fileName,
      folder,
      useUniqueFileName: false,
    });
    console.log(`OK: ${rel} -> ${result.url}`);
    return { local: '/' + rel, remote: result.url };
  } catch (err) {
    console.error(`FAIL: ${rel} -> ${err.message}`);
    return null;
  }
}

async function main() {
  const files = getAllFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} files to upload\n`);

  const results = [];
  for (const file of files) {
    const result = await uploadFile(file);
    if (result) results.push(result);
  }

  console.log('\n--- URL Mapping ---');
  const mapping = {};
  for (const r of results) {
    mapping[r.local] = r.remote;
    console.log(`${r.local} => ${r.remote}`);
  }

  fs.writeFileSync(
    path.join(__dirname, 'imagekit-urls.json'),
    JSON.stringify(mapping, null, 2)
  );
  console.log('\nSaved mapping to scripts/imagekit-urls.json');
}

main().catch(console.error);
