const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Crisp Cheerplex CP Monogram:
// - Background: Cheerplex main color (#1d4ed8)
// - Only "CP"
// - Text color: Pure White (#ffffff)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#1d4ed8" />
  <!-- Letter C -->
  <path d="M 199 140 L 242 140 L 242 188 L 199 188 A 68 68 0 1 0 199 324 L 242 324 L 242 372 L 199 372 A 116 116 0 1 1 199 140 Z" fill="#ffffff" />
  <!-- Letter P -->
  <path d="M 269 140 L 361 140 A 68 68 0 0 1 361 276 L 317 276 L 317 372 L 269 372 Z M 317 188 L 361 188 A 20 20 0 0 1 361 228 L 317 228 Z" fill="#ffffff" fill-rule="evenodd" />
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');

async function buildFavicons() {
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log('Saved public/favicon.svg');

  const svgBuffer = Buffer.from(svgContent);

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-64x64.png', size: 64 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-128x128.png', size: 128 },
    { name: 'favicon-144x144.png', size: 144 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'web-app-manifest-192x192.png', size: 192 },
    { name: 'web-app-manifest-512x512.png', size: 512 },
  ];

  for (const s of sizes) {
    await sharp(svgBuffer)
      .resize(s.size, s.size)
      .png()
      .toFile(path.join(publicDir, s.name));
    console.log(`Generated ${s.name} (${s.size}x${s.size})`);
  }

  // Create standard multi-resolution ICO file (16x16, 32x32, 48x48)
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  const pngImages = [
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ];

  const headerSize = 6;
  const dirEntrySize = 16;
  const count = pngImages.length;
  let offset = headerSize + dirEntrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = Icon
  header.writeUInt16LE(count, 4); // Number of images

  const dirEntries = [];
  const imageBuffers = [];

  for (const img of pngImages) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width, 0); // Width
    entry.writeUInt8(img.height, 1); // Height
    entry.writeUInt8(0, 2); // Colors (0 = no palette)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data

    dirEntries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...imageBuffers]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`Generated favicon.ico (multi-res 16, 32, 48)`);
}

buildFavicons().catch(err => {
  console.error('Failed to build favicons:', err);
  process.exit(1);
});
