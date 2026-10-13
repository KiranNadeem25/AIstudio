import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);

  // Center coordinates
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (isMaskable ? 0.35 : 0.42);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Dark Slate (#020617)
      let r = 2;
      let g = 6;
      let b = 23;
      let a = 255;

      // Shield / Emblem region
      const inShield = Math.abs(dx) <= (width * 0.28) && y >= height * 0.22 && y <= height * 0.78;
      const shieldCurve = (y - height * 0.5) / (height * 0.28);
      const shieldWidth = (1 - Math.max(0, shieldCurve * 0.7)) * (width * 0.28);

      if (Math.abs(dx) <= shieldWidth && y >= height * 0.20 && y <= height * 0.78) {
        // Gradient from Rose (#f43f5e) to Amber (#d97706)
        const t = (y - height * 0.2) / (height * 0.58);
        r = Math.round(244 * (1 - t) + 217 * t);
        g = Math.round(63 * (1 - t) + 119 * t);
        b = Math.round(94 * (1 - t) + 6 * t);

        // Center core circle in dark slate
        if (dist <= radius * 0.45) {
          r = 2;
          g = 6;
          b = 23;
        }

        // Inner glowing node in rose
        if (dist <= radius * 0.22) {
          r = 244;
          g = 63;
          b = 94;
        }

        // Center white dot
        if (dist <= radius * 0.08) {
          r = 255;
          g = 255;
          b = 255;
        }
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // Build raw scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let scanOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[scanOffset++] = 0; // Filter: None
    const rowStart = y * width * 4;
    buffer.copy(scanlines, scanOffset, rowStart, rowStart + width * 4);
    scanOffset += width * 4;
  }

  const compressed = zlib.deflateSync(scanlines);

  // PNG chunks helpers
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
    return chunk;
  }

  // IHDR data
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write PWA PNG icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, false));

console.log('Successfully generated all PWA icons in /public!');
