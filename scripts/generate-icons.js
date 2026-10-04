import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, r, g, b, isMaskable = false) {
  // Simple uncompressed/deflated raw RGBA PNG writer
  const rowSize = width * 4 + 1; // 1 filter byte per scanline
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = width * 0.44;
  const innerR = width * 0.32;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Slate base background
      let pr = 15;
      let pg = 23;
      let pb = 42;
      let pa = 255;

      if (!isMaskable && dist > outerR) {
        // Outside circle for non-maskable
        pr = 15;
        pg = 23;
        pb = 42;
      } else if (dist <= outerR) {
        // Acrobat crimson gradient / emblem
        pr = r;
        pg = g;
        pb = b;

        // Inner ribbon shape highlight
        if (Math.abs(dx * dy) < (width * width * 0.04) && dist < innerR) {
          pr = 255;
          pg = 255;
          pb = 255;
        }
      }

      rawData[pxOffset] = pr;
      rawData[pxOffset + 1] = pg;
      rawData[pxOffset + 2] = pb;
      rawData[pxOffset + 3] = pa;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16); // bit depth
  ihdr.writeUInt8(6, 17); // color type (RGBA)
  ihdr.writeUInt8(0, 18); // compression
  ihdr.writeUInt8(0, 19); // filter
  ihdr.writeUInt8(0, 20); // interlace
  const ihdrCrc = crc32(ihdr.subarray(4, 21));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // IDAT Chunk
  const idatHeader = Buffer.alloc(8);
  idatHeader.writeUInt32BE(deflated.length, 0);
  idatHeader.write('IDAT', 4);
  const idatCrcVal = crc32(Buffer.concat([Buffer.from('IDAT'), deflated]));
  const idatCrc = Buffer.alloc(4);
  idatCrc.writeUInt32BE(idatCrcVal, 0);
  const idat = Buffer.concat([idatHeader, deflated, idatCrc]);

  // IEND Chunk
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 234, 28, 36, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 234, 28, 36, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 234, 28, 36, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 234, 28, 36, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(32, 32, 234, 28, 36, false));

console.log('Successfully generated all PWA PNG icons in /public');
